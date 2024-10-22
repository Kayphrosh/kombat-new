import React from 'react';
import Layout from '@/components/dashboard/layout';
import BetOverview from '@/components/dashboard/livebet-overview';



export default function BetOverviewPage() {
  return (
    <>
      <BetOverview />
    </>
  );
};

BetOverviewPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
