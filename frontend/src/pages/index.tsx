import React, { useRef } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';

type NFT = {
  id: number;
  name: string;
  imageUrl: string;
};

type HomeProps = {
  nfts: NFT[];
};


const Home: React.FC<HomeProps> = ({ nfts }) => {
  return (
    <div>
      <h2>Featured NFTs</h2>
      <ul>
        {nfts.map((nft) => (
          <li key={nft.id}>
            <Link href={`/nft/${nft.id}`}>
              <span className="link">{nft.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ParticleBackground />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch NFT data from an API or contract
  const nfts: NFT[] = [
    { id: 1, name: 'NFT 1', imageUrl: 'https://ipfs.io/ipfs/QmYrxAviWHGugdikgU1Awc8MRtfqxMYYRmBuCTMEc5mCAx' },
    { id: 2, name: 'NFT 2', imageUrl: 'https://ipfs.io/ipfs/QmcxJoj2F24qXpasJ9XKSXyzuEHHJqdX9sv7Er5isBxZ95' },
    { id: 3, name: 'NFT 3', imageUrl: 'https://ipfs.io/ipfs/QmY3aNgaE3NNHc3sZTBENFgRosny1EGCWjUZV5aTXvTB5S"' },
  ];

  return { props: { nfts } };
};

export default Home;
