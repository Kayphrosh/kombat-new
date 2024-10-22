import React from 'react';
import Navbar from './navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-container">
      <Navbar />
      {children}
    </div>
  );
};
export default Layout;
