// frontend/pages/index.tsx
import React from 'react';
import RootLayout from '../app/layout';
import DashboardPage from '../app/dashboard/page';

const Home: React.FC = () => {
  return (
    <RootLayout>
      <DashboardPage />
    </RootLayout>
  );
};

export default Home;
