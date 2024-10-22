import React from 'react';
import MarketWallet from '@/components/markets-dashboard/market-wallet';
import Layout from '@/components/markets-dashboard/layout';
const MarketWalletPage = () => {
  return (
    <div>
      <MarketWallet />
    </div>
  );
};

export default MarketWalletPage;

MarketWalletPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
