import React from 'react';
import Layout from '@/components/dashboard/layout';
import Overview from '@/components/dashboard/overview';

export default function OverviewPage() {
  return (
    <>
      <Overview />
    </>
  );
}

OverviewPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
