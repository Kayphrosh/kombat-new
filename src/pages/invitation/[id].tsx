import React from 'react';
import Layout from '@/components/dashboard/layout';
import Invitation from '@/components/invitation';
export default function InvitationPage() {
  return (
    <>
      <Invitation />
    </>
  );
}

InvitationPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
