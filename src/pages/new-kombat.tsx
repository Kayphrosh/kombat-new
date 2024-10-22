import React from 'react';
import NewKombatForm from '@/components/dashboard/new-kombat';
import Layout from '@/components/dashboard/layout';

const NewKombatPage = () => {
  return (
    <div>
      <NewKombatForm message="" onClose={() => {}} />
    </div>
  );
};

export default NewKombatPage;

NewKombatPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
