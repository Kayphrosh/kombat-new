'use client';
import React from 'react';
import Head from 'next/head';
import MarketOverview from '@/components/markets-dashboard/market-overview';
import Layout from '@/components/markets-dashboard/layout';
const Markets = () => {
  return (
    <>
      <Head>
        <title>Kombat</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
        <meta name="description" content="Kombat" />
      </Head>

      <MarketOverview />
    </>
  );
};

export default Markets;

Markets.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
