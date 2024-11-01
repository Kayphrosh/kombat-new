// pages/identity.tsx
import Identity from '@/components/identity';
import Layout from '@/components/markets-dashboard/layout';

const IdentityPage = (props: any) => {
  return <Identity {...props} />;
};

export default IdentityPage;

IdentityPage.getLayout = function getLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
