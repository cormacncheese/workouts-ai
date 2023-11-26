import React from 'react';
import Logo from '@/components/icons/Logo';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-row justify-between items-center px-8 border-b border-b-muted h-[64px]">
        <Logo />
      </div>

      <div className="bg-backgroundMuted height-screen-helper overflow-hidden md:px-8 px-4 py-4">
        {children}
      </div>
    </section>
  );
}
