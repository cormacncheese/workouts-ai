import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CheckCircle2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Typography from '@/components/molecules/Typography';
import React, { useState } from 'react';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import useSubscription from '@/lib/hooks/use-subscription';

const FREE_FEATURES = [
  'Unlimited files',
  '1 integration',
  'All file types (PDFs, CSVs, Images, etc.)',
  'Attach links',
  '1 Workspace',
  'GPT-3',
  '25 messages / hour'
];

const PRO_FEATURES = [
  'Everything in Free',
  'All Integrations',
  'Live Search',
  'Unlimited workspaces',
  'GPT-4',
  'Unlimited messages'
];

type Props = {
  setIsOpen: (value: boolean) => void;
};

export default function PaywallContent({ setIsOpen }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const { subscription, products } = useSubscription();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomerPortal, setIsLoadingCustomerPortal] = useState(false);

  const proProduct = products?.find((product: any) => product.name === 'Pro');
  const proPrice = proProduct?.prices[0];

  const isProActive =
    subscription &&
    products &&
    subscription.status === 'active' &&
    subscription?.prices?.id === proPrice?.id;

  const handleSelectFree = () => {
    setIsOpen(false);
  };

  const handleSelectPro = async () => {
    setIsLoading(true);

    if (!proPrice) return;

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price: proPrice }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast({
        title: 'Something went wrong. Please try again.'
      });
      return alert((error as Error)?.message);
    } finally {
      console.log('finally');
    }

    setIsLoading(false);
  };

  const redirectToCustomerPortal = async () => {
    setIsLoadingCustomerPortal(true);
    try {
      const { url } = await postData({
        url: '/api/create-portal-link'
      });
      router.push(url);
    } catch (error) {
      setIsLoadingCustomerPortal(false);
      if (error) return alert((error as Error).message);
    }

    setIsLoadingCustomerPortal(false);
  };

  return (
    <DialogContent className="md:max-w-2xl md:max-h-full max-h-screen overflow-y-scroll max-w-md">
      <DialogHeader>
        <DialogTitle>Become super human</DialogTitle>
        <DialogDescription>
          Unlock full access to Maia and make your life easier.
        </DialogDescription>

        <div className="pt-6 flex md:flex-row flex-col gap-8 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Unlock what you're capable of</CardDescription>
            </CardHeader>
            <CardContent>
              {FREE_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex flex-row gap-2 py-1 items-center"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <Typography size="base" fontWeight="normal">
                    {feature}
                  </Typography>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              {isProActive ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={redirectToCustomerPortal}
                  loading={isLoadingCustomerPortal}
                >
                  Switch to Free
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSelectFree}
                >
                  Continue with Free
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="w-full border-brand">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Unlock what you're capable of</CardDescription>
            </CardHeader>
            <CardContent>
              {PRO_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex flex-row gap-2 py-1 items-center"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <Typography size="base" fontWeight="normal">
                    {feature}
                  </Typography>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              {isProActive ? (
                <Button
                  onClick={redirectToCustomerPortal}
                  loading={isLoadingCustomerPortal}
                >
                  Manage Plan
                </Button>
              ) : (
                <Button onClick={handleSelectPro} loading={isLoading}>
                  Upgrade to Pro
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
