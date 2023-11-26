'use client';

import { useEffect } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import useDevice from '@/lib/hooks/use-device';
import useSubscription from '@/lib/hooks/use-subscription';
import PaywallContent from './paywall-content';

type Props = {
  defaultOpen?: boolean;
};

export default function PaywallWithButton({ defaultOpen }: Props) {
  const { isMobile, isTablet } = useDevice();
  const { subscription, products } = useSubscription();

  const [isOpen, setIsOpen] = useState(defaultOpen);

  const proProduct = products?.find((product: any) => product.name === 'Pro');
  const proPrice = proProduct?.prices[0];

  const isProActive =
    subscription &&
    products &&
    subscription.status === 'active' &&
    subscription?.prices?.id === proPrice?.id;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger>
        <div>
          {isProActive ? (
            <Button variant="ghost" className="text-sm bg-transparent">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500">
                Pro
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-sm bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            >
              <Sparkles className="w-4 h-4" />

              {!isMobile && !isTablet && <span className="ml-2">Upgrade</span>}
            </Button>
          )}
        </div>
      </DialogTrigger>

      <PaywallContent setIsOpen={setIsOpen} />
    </Dialog>
  );
}
