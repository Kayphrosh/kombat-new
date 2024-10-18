import React from 'react';
import Head from 'next/head';
import Markets from '@/components/markets';
const markets = () => {
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

      <Markets />
    </>
  );
};

export default markets;
