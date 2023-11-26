import Footer from '@/components/sections/footer';
import Navbar from '@/components/molecules/HomeNavbar';
import { PropsWithChildren } from 'react';

export default async function SubpageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="px-8 py-20">{children}</div>
      <Footer />
    </>
  );
}
