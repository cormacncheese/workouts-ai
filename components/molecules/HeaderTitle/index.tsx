'use client';

import { usePathname } from 'next/navigation';
import { getTitle } from '@/utils/paths';
import Typography from '@/components/molecules/Typography';
import { useAtom } from 'jotai';
import { pathHeaderAtom } from '@/utils/atoms';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function HeaderTitle() {
  const pathname = usePathname();
  const router = useRouter();

  const homeRoutes = [
    'integrations',
    'dashboard',
    'assistant',
    'files',
    'train'
  ];

  const headerText = pathname.startsWith('/')
    ? pathname
        .slice(1)
        .split('/')
        .filter((route) => route !== 'dashboard')
        .join(' / ')
    : pathname
        .split('/')
        .filter((route) => route !== 'dashboard')
        .join(' / ');

  return (
    <div className="flex flex-row gap-3 items-center">
      {homeRoutes.includes(headerText) || (
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
      )}
      <Typography size="xl" fontWeight="semibold">
        {headerText
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}
      </Typography>
    </div>
  );
}
