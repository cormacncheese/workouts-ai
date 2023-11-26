'use client';

import { Button } from '@/components/ui/button';

export default function LearnMoreButton({}) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        const element = document.getElementById('features');
        element?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      Learn more
    </Button>
  );
}
