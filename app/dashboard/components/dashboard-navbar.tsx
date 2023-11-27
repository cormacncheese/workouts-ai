import { createServerSupabaseClient } from '@/app/supabase-server';
import DashboardMenu from '@/app/dashboard/components/dashboard-menu';
import { DashboardMobileMenu } from './dashboard-menu-mobile';
import Logo from '@/components/icons/Logo';
import Link from 'next/link';
import PaywallWithButton from '@/app/dashboard/components/paywall-with-button';
import Typography from '@/components/molecules/Typography';

export default async function DashboardNavbar() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const renderLogo = () => {
    return user ? (
      <Link
        href="/dashboard/trainer"
        aria-label="Dashboard"
        className="flex items-center"
      >
        <Logo />
      </Link>
    ) : (
      <Link href="/" aria-label="Logo" className="flex items-center">
        <Logo />
      </Link>
    );
  };

  return (
    <>
      <div className="md:hidden flex px-4 py-1 justify-between flex-row items-center sticky top-0 bg-black z-20">
        {renderLogo()}

        <div className="flex gap-4">
          {/* <PaywallWithButton /> */}
          {/* <WorkspaceDropdown /> */}
          <DashboardMobileMenu />
        </div>
      </div>

      <div className="w-full flex-row gap-10 px-8 py-1 top-0 border-b border-b-secondaryMuted bg-background h-[64px] md:flex hidden">
        {renderLogo()}

        <DashboardMenu user={user} />
      </div>
    </>
  );
}
