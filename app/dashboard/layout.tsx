import React from 'react';
import DashboardNavbar from './components/dashboard-navbar';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <DashboardNavbar />

      <div className="bg-backgroundMuted h-full height-screen-helper md:px-8 py-4">
        {/* <HeaderTitle /> */}
        {children}
      </div>
    </section>
  );
}
