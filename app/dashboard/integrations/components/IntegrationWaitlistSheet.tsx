'use client';

import { addToWaitlist } from '@/app/actions/waitlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUserData, getCurrentUserEmail } from '@/app/actions/user';
import { Database } from '@/types/supabase';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function IntegrationWaitlistSheet({ open, setOpen }: Props) {
  const { toast } = useToast();

  const submitWaitlist = async (formData: FormData) => {
    const userData = (await getCurrentUserData()) as Database['public']['Tables']['users']['Row'];

    const userEmail = await getCurrentUserEmail();

    const email = userEmail;
    const name = userData.full_name;

    const response = `Integration: ${formData.get(
      'integration'
    )}\nOther integration: ${formData.get('other_integrations')}` as string;

    if (!email || !name || !response) {
      toast({
        title: 'Please fill out all the answers'
      });
      return;
    }

    const feature = 'integrations';

    const result = await addToWaitlist(email, name, response, feature);

    const success = result.success as boolean;
    const message = result.message as string;

    toast({
      title: message
    });
  };

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Join waitlist for integrations</SheetTitle>
          <SheetDescription>
            Be the first to get access to integrations.
          </SheetDescription>
        </SheetHeader>
        <form id="integrationsWaitlistForm" action={submitWaitlist}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="integration" className="text-right">
                Which integration are you most excited about?
              </Label>
              <Input
                id="integration"
                name="integration"
                placeholder="Gmail"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="other_integrations" className="text-right">
                Any other integrations you'd like to see?
              </Label>
              <Input
                id="other_integrations"
                name="other_integrations"
                placeholder="Youtube, Figma, etc"
                className="col-span-3"
              />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Add to waitlist</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
