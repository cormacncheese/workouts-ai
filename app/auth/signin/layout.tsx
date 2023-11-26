import React from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import AuthMenu from '@/app/auth/signin/auth-menu';
import Typography from '@/components/molecules/Typography';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-full">
      <div className="flex flex-row justify-between md:absolute relative top-0 left-0 w-full bg-transparent z-20 px-10 pt-6">
        <div className="">
          <Link href="/" aria-label="Logo" className="flex items-center">
            <Logo />
            <Typography
              size="3xl"
              fontWeight="normal"
              className="text-slate-300 ml-4"
            >
              Workouts AI
            </Typography>
          </Link>
        </div>

        <AuthMenu />
      </div>

      {children}
    </section>
  );
}
