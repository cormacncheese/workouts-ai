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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { addToWaitlist } from '@/app/actions/waitlist';
import { useState } from 'react';

export default function WaitlistForm() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const submitWaitlist = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const response = `Purpose: ${formData.get('purpose')}\nTeam: ${formData.get(
      'team'
    )}\nFrustrations: ${formData.get('frustrations')}` as string;

    if (!email || !name || !response) {
      toast({
        title: 'Please fill out all the answers'
      });
      return;
    }

    setLoading(true);

    const feature = 'beta_access';

    const result = await addToWaitlist(email, name, response, feature);

    const success = result.success as boolean;
    const message = result.message as string;

    toast({
      title: message
    });

    setIsOpen(false);

    setLoading(false);
  };

  return (
    <Dialog defaultOpen={false} onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          Join Waitlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply to waitlist</DialogTitle>
          <DialogDescription>
            We will slowly be rolling out access to select users. Please fill
            out some quick information and we will reach out.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col justify-start gap-4 py-4"
          action={submitWaitlist}
        >
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              className="col-span-3"
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email" className="text-left">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="john@apple.com"
              className="col-span-3"
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="purpose" className="text-left">
              How do you plan to use maia?
            </Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Startup, work, school, etc"
              className="w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="team" className="text-left">
              Do you work on a team? If so, how many people?
            </Label>
            <Textarea
              id="team"
              name="team"
              placeholder="Type your message here."
              className="w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <Label htmlFor="frustrations" className="text-left">
              What frustrates you about current AI tools?
            </Label>
            <Textarea
              id="frustrations"
              name="frustrations"
              placeholder="Impersonal, hallucinates, etc."
              className="w-full"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" loading={loading}>
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
