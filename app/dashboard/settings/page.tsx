'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsProfilePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/settings/profile');
  }, []);

  return <></>;
}
