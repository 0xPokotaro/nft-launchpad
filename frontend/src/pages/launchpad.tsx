import React, { useState, useEffect } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import styles from '@/styles/Launchpad.module.css';

const Launchpad: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [price, setPrice] = useState(0);
  const [mintDeadline, setMintDeadline] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch data for NFT launchpad from an API or contract
    setTotalSupply(100);
    setCurrentSupply(50);
    setPrice(0.1);
    setMintDeadline(new Date('2023-04-30T00:00:00Z'));
  }, []);

  const handleMint = async () => {
    // Implement logic to mint NFT
    console.log('Minting NFT...');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>NFT Launchpad</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Total Supply:</span> {totalSupply}
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Current Supply:</span> {currentSupply}
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Price:</span> {price} ETH
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Mint Deadline:</span>{' '}
            {mintDeadline?.toLocaleDateString()}
          </div>
        </div>
        <button className={styles.button} onClick={handleMint}>
          Mint NFT
        </button>
      </div>
      <ParticleBackground />
    </div>
  );
};

export default Launchpad;
