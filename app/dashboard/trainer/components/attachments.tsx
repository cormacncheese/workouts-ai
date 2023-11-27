'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { buttonVariants } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import cn from 'classnames';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PaywallDialog from '@/app/dashboard/components/paywall-dialog';
import useSubscription from '@/lib/hooks/use-subscription';

type Props = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
  uid: string;
  isLiveSearch: boolean;
  setIsLiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Attachments({
  isOpen,
  setIsOpen,
  uid,
  isLiveSearch,
  setIsLiveSearch
}: Props) {
  const { subscription } = useSubscription();

  const [popOverContent, setPopOverContent] = React.useState('Choices');
  const [isOpenPaywall, setIsOpenPaywall] = React.useState(false);

  const handleSearchToggleClick = () => {
    if (!subscription || subscription?.status !== 'active') {
      setIsOpen(true);
      return;
    }

    setIsLiveSearch(!isLiveSearch);
  };

  return (
    <>
      <PaywallDialog isOpen={isOpenPaywall} setIsOpen={setIsOpenPaywall} />

      <Popover
        open={isOpen}
        onOpenChange={() => {
          setPopOverContent('Choices');
          if (isOpen) {
            setIsOpen(false);
          }
        }}
      >
        <PopoverTrigger
          onClick={() => {
            setIsOpen(true);
          }}
          className={cn(
            buttonVariants({ size: 'sm', variant: 'ghost' }),
            'h-10 w-10 rounded-full p-0 sm:left-4'
          )}
        >
          <Paperclip className="w-10 h-10" />
        </PopoverTrigger>
        <PopoverContent align="start">
          {popOverContent === 'Choices' && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Live data</h4>
                <p className="text-sm text-muted-foreground">
                  Use live information from the internet to inform your workout.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex flex-row  w-full  py-2 items-center gap-4">
                  <Switch
                    id="isLiveSearch"
                    checked={isLiveSearch}
                    onCheckedChange={() => {
                      handleSearchToggleClick();
                    }}
                  />
                  <Label htmlFor="isLiveSearch">Live Search</Label>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
