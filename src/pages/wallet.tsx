import React from 'react';
import Wallet from '@/components/dashboard/wallet';
import Layout from '@/components/dashboard/layout';
const WalletPage = () => {
  return (
    <div>
      <Wallet />
    </div>
  );
};

export default WalletPage;

WalletPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
