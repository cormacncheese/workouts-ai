'use client';

import React, { useEffect } from 'react';
import PulseLoader from '@/components/molecules/PulseLoader';
import { useRouter } from 'next/navigation';
import HeaderText from './header-text';

export function LoadingSpace({}) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/dashboard/assistant');
    }, 2000);
  }, []);

  return (
    <div className="flex w-full flex-col max-w-sm items-center text-center space-x-2 gap-2">
      <HeaderText>Training your Workout AI...</HeaderText>

      <PulseLoader width="w-40" height="h-40" />
    </div>
  );
}
