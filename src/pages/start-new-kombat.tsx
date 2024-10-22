import React from 'react';
import StartNewCombat from '@/components/dashboard/start-new-kombat';
import Layout from '@/components/dashboard/layout';

const StartNewKombatPage = () => {
  return (
    <div>
      <StartNewCombat />
    </div>
  );
};

export default StartNewKombatPage;

StartNewKombatPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
