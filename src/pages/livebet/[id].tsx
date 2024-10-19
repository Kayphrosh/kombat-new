import React from 'react';
import BetOverview from '@/components/dashboard/livebet-overview';
import { GetStaticPaths, GetStaticProps } from 'next';

// Add this function at the top of your file
const safeBigInt = (value: string | number | bigint | undefined) => {
  if (value === undefined) return BigInt(0);
  return BigInt(value);
};

const index = () => {

  return (
    <div>
      <BetOverview />
    </div>
  );
};

export default index;
