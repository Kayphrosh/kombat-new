import React from 'react';
import BetOverview from '@/components/dashboard/livebet-overview';
import { GetStaticPaths, GetStaticProps } from 'next';
const index = () => {
  return (
    <div>
      <BetOverview />
    </div>
  );
};

export default index;
