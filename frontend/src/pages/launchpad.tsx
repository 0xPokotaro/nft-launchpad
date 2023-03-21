import React, { useState, useEffect } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import styles from '@/styles/Launchpad.module.css';

const Launchpad: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [price, setPrice] = useState(0);
  const [mintDeadline, setMintDeadline] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data for NFT launchpad from an API or contract
    setTotalSupply(100);
    setCurrentSupply(50);
    setPrice(0.1);
    setMintDeadline(new Date('2023-04-30T00:00:00Z'));
  }, []);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mintDeadline) {
      return;
    }

    // タイマーを設定
    const timerId = setInterval(() => {
      const now = new Date().getTime();
      const distance = mintDeadline.getTime() - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    // タイマーを停止するために返却する関数を設定
    return () => clearInterval(timerId);
  }, [mintDeadline]);

  const handleMint = async () => {
    // Implement logic to mint NFT
    console.log('Minting NFT...');
  };

  return (
    <>
      {isLoading ? (
        <div className={isLoading ? styles.loading : styles.loaded}>
          <div className={styles.spinner}></div>
          <div className={styles.text}>{isLoading && 'NFT will bring a sweet and beautiful fragrance to your life. Experience that fragrance.'}</div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.content}>
            <h2 className={styles.title}>NFT Launchpad</h2>
            <div className={styles.stats}>
              <p className={styles.stat}>
                <span className={styles.label}>Total Supply:</span> {totalSupply}
              </p>
              <p className={styles.stat}>
                <span className={styles.label}>Current Supply:</span> {currentSupply}
              </p>
              <p className={styles.stat}>
                <span className={styles.label}>Price:</span> {price} ETH
              </p>
              <p className={styles.stat}>
                <span className={styles.label}>Mint Deadline:</span>{' '}
                {mintDeadline?.toLocaleDateString()}
              </p>
            </div>
            <button className={styles.button} onClick={handleMint}>
              Mint NFT
            </button>
          </div>
          <ParticleBackground />
        </div>
      )}
    </>
  );
};

export default Launchpad;
