import React from 'react';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';

type NFT = {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
};

type NFTDetailsProps = {
  nft: NFT;
};

const NFTDetails: React.FC<NFTDetailsProps> = ({ nft }) => {
  return (
    <div>
      <h2>{nft.name}</h2>
      <Image src={nft.imageUrl} alt={nft.name} width={500} height={500} />
      <p>{nft.description}</p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch NFT IDs from an API or contract
  const paths = [
    { params: { nftId: '1' } },
    { params: { nftId: '2' } },
    { params: { nftId: '3' } },
  ];

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Fetch NFT data for the given ID from an API or contract
  const nftId = params?.nftId;

  let imageUrl = ''
  switch (nftId) {
    case '1':
      imageUrl = 'https://ipfs.io/ipfs/QmYrxAviWHGugdikgU1Awc8MRtfqxMYYRmBuCTMEc5mCAx'
      break;
    case '2':
      imageUrl = 'https://ipfs.io/ipfs/QmcxJoj2F24qXpasJ9XKSXyzuEHHJqdX9sv7Er5isBxZ95'
      break;
    case '3':
      imageUrl = 'https://ipfs.io/ipfs/QmY3aNgaE3NNHc3sZTBENFgRosny1EGCWjUZV5aTXvTB5S'
      break;
    default:
      imageUrl = 'https://ipfs.io/ipfs/QmYrxAviWHGugdikgU1Awc8MRtfqxMYYRmBuCTMEc5mCAx'
      break;
  }

  const nft: NFT = {
    id: Number(nftId),
    name: `NFT ${nftId}`,
    imageUrl,
    description: `This is a description of NFT ${nftId}.`,
  };

  return { props: { nft } };
};

export default NFTDetails;
