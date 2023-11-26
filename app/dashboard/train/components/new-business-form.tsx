'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { createNewBusiness } from '@/app/actions/business';
import { getUserBusinesses } from '@/app/actions/user';
import { useToast } from '@/components/ui/use-toast';
import { selectedBusinessIdAtom } from '@/utils/atoms';
import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import { mutate } from 'swr';
import useSubscription from '@/lib/hooks/use-subscription';
import PaywallDialog from '@/app/dashboard/components/paywall-dialog';

export function AddBusinessForm() {
  const { toast } = useToast();
  const { subscription, products } = useSubscription();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [, setSelectedBusinessId] = useAtom(selectedBusinessIdAtom);
  const [isOpenPaywall, setIsOpenPaywall] = useState(false);

  const proProduct = products?.find((product: any) => product.name === 'Pro');
  const proPrice = proProduct?.prices[0];

  const isProActive =
    subscription &&
    subscription.status === 'active' &&
    subscription?.prices?.id === proPrice?.id;

  const handleSubmit = async () => {
    setLoading(true);

    const res = await createNewBusiness(name);

    if (res) {
      setSelectedBusinessId(res[0].id);
      toast({
        title: 'Created business successfully'
      });
      mutate('userBusinesses');
      setIsOpen(false);
    } else {
      toast({
        title: 'Error creating new business'
      });
    }

    setLoading(false);
  };

  const handleAddABusinessClick = async () => {
    if (!isProActive) {
      toast({
        title: 'Upgrade to pro',
        description:
          'Upgrade to pro to unlock more workspaces for all your projects'
      });

      setIsOpenPaywall(true);
      setIsOpen(false);
      return;
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <PaywallDialog isOpen={isOpenPaywall} setIsOpen={setIsOpenPaywall} />

      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(!isOpen);
        }}
      >
        {/* <DialogTrigger> */}
        <Button variant="outline" onClick={handleAddABusinessClick}>
          <Plus className="h-4 w-4" />
          Add a business
        </Button>
        {/* </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add your business</DialogTitle>
            <DialogDescription>
              Enter the name of your business to get started
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="SpaceX"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} loading={loading}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
