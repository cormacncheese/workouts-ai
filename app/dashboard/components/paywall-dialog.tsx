'use client';

import { Dialog } from '@/components/ui/dialog';
import React from 'react';
import PaywallContent from './paywall-content';

type Props = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function PaywallDialog({ isOpen, setIsOpen }: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <PaywallContent setIsOpen={setIsOpen} />
    </Dialog>
  );
}
