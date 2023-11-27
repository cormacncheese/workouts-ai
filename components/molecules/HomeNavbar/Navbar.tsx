import HomeMenu from '@/components/molecules/HomeNavbar/desktop-menu';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';
import { MobileMenu } from './mobile-menu';
import Typography from '@/components/molecules/Typography';

export default async function Navbar() {
  return (
    <>
      {/* Mobile menu */}
      <div className="md:hidden flex flex-row justify-between px-4 py-3 items-center bg-transparent absolute w-full top-0 z-20">
        <Link href="/" aria-label="Logo">
          <Logo />
        </Link>

        <div className="flex flex-row gap-4 items-center">
          <Link href="/auth/signin" aria-label="Logo">
            Login
          </Link>

          <MobileMenu />
        </div>
      </div>

      {/* Desktop menu */}
      <div className="w-full flex-row justify-between bg-transparent px-8 py-3 top-0 gap-6 md:flex hidden absolute z-10">
        <Link
          href="/"
          aria-label="Logo"
          className="flex flex-row gap-2 items-center"
        >
          <Logo />
        </Link>

        <HomeMenu />
      </div>
    </>
  );
}
