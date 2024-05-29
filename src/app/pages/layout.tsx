import React from 'react';
import MainLayout from '../components/_layout';

const MainLayoutPage = ({ children }: {children: React.ReactNode}) => {
  return <MainLayout>{children}</MainLayout>;
};

export default MainLayoutPage;
