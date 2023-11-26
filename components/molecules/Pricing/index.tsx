'use client';

import { Button } from '@/components/ui/button';
import { Database } from '@/types/supabase';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Typography from '@/components/molecules/Typography';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'year' | 'month';

export default function Pricing({
  session,
  user,
  products,
  subscription
}: Props) {
  const [annual, setAnnual] = useState<boolean>(true);

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );

  const PlusPrice = products.find((product) => product.name === 'Plus');

  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    'month'
  );
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/auth/signin');
    }
    if (subscription) {
      return router.push('/dashboard/trainer');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  return (
    <section className="relative">
      {/* Radial gradient */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div className="absolute flex items-center justify-center top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/3 aspect-square">
          <div className="absolute inset-0 translate-z-0 bg-indigo-500 rounded-full blur-[120px] opacity-50" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Content */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <div>
              <div className="inline-flex font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-200 pb-3">
                Pricing
              </div>
            </div>
            <Typography
              size="4xl"
              fontWeight="semibold"
              className="dark:text-primary mb-2"
            >
              Unlock your growth
            </Typography>

            <p className="text-lg text-slate-400">
              How much is your time worth? The average Maia subscriber saves 10
              hours every week.
            </p>
          </div>

          {/* Pricing tabs */}
          <div className="relative">
            {/* Blurred shape */}
            <div
              className="max-md:hidden absolute bottom-0 -mb-20 left-2/3 -translate-x-1/2 blur-2xl opacity-70 pointer-events-none"
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
                <defs>
                  <linearGradient
                    id="bs5-a"
                    x1="19.609%"
                    x2="50%"
                    y1="14.544%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#672ff6" />
                    <stop offset="100%" stopColor="#2f36f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#bs5-a)"
                  fillRule="evenodd"
                  d="m661 736 461 369-284 58z"
                  transform="matrix(1 0 0 -1 -661 1163)"
                />
              </svg>
            </div>
            {/* Content */}
            <div className="md:grid md:grid-cols-3 flex flex-col gap-8 xl:-mx-6 text-sm">
              <div className="pt-4 md:block hidden">
                {/* Content of the first column */}
                {/* Pricing toggle */}
                <div className="px-6 md:flex flex-col justify-end h-32 hidden">
                  <div className="pb-5 ">
                    {/* Toggle switch */}
                    {/* <div className="max-md:text-center">
                    <div className="inline-flex items-center whitespace-nowrap">
                      <div className="text-sm text-slate-500 font-medium mr-2 md:max-lg:hidden">
                        Monthly
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="toggle"
                          className="peer sr-only"
                          checked={annual}
                          onChange={() => setAnnual(!annual)}
                        />
                        <label
                          htmlFor="toggle"
                          className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-slate-400 px-0.5 outline-slate-400 transition-colors before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow-sm before:transition-transform before:duration-150 peer-checked:bg-indigo-500 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gray-400 peer-checked:peer-focus-visible:outline-indigo-500"
                        >
                          <span className="sr-only">Pay Yearly</span>
                        </label>
                      </div>
                      <div className="text-sm text-slate-500 font-medium ml-2">
                        Yearly <span className="text-teal-500">(-20%)</span>
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
                {/* # Usage */}
                <div className="px-6 md:flex flex-col justify-end hidden">
                  <div className="py-2 text-slate-50 font-medium mt-4">
                    Features
                  </div>
                </div>

                {/* Requests */}
                <div className="px-6 md:flex flex-col justify-end hidden">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    Files
                  </div>
                </div>
                {/* Model */}
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    File types
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    Attach links
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    Integrations
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    Workspaces
                  </div>
                </div>
                {/* Automated Skills */}
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    AI Model
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    Limit
                  </div>
                </div>

                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-400 border-b border-slate-800">
                    Support
                  </div>
                </div>
              </div>
              <div>
                {/* Content of the second column */}
                {/* Free price */}
                <div className="px-6 flex flex-col justify-end pt-5">
                  <div className="grow pb-4 mb-4 border-b border-slate-800">
                    <div className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-200 pb-0.5">
                      Free
                    </div>
                    <div className="mb-1">
                      <span className="text-lg font-medium text-slate-500">
                        $
                      </span>
                      <span className="text-3xl font-bold text-slate-50">
                        0
                      </span>
                      <span className="text-sm text-slate-600 font-medium">
                        /mo
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Unlock what you're capable of.
                    </div>
                  </div>
                  <div className="pb-4 border-b border-slate-800">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={false}
                      // onClick={handleSignIn}
                      onClick={() => {
                        router.push('/auth/signin');
                      }}
                      className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 "
                    >
                      Get Started for Free
                    </Button>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="py-2 text-slate-50 font-medium mt-4 md:hidden">
                    Usage
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Unlimited</span>
                    <span className="md:hidden flex">Unlimited requests</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end ">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>

                    <span className="md:flex hidden">All </span>
                    <span className="md:hidden flex">All file types</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>

                    <span className="md:flex hidden">Yes</span>
                    <span className="md:hidden flex">Attach links</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>

                    <span className="md:flex hidden">1 integration</span>
                    <span className="md:hidden flex">1 integration</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end ">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>

                    <span className="md:flex hidden">1</span>
                    <span className="md:hidden flex">1 Workspace</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">GPT-3</span>
                    <span className="md:hidden flex">GPT-3</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">25 messages / hour</span>
                    <span className="md:hidden flex">25 messages / hour</span>
                  </div>
                </div>

                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Basic</span>
                    <span className="md:hidden flex">Basic support</span>
                  </div>
                </div>
              </div>
              <div className="border-2 py-4 border-indigo-500 rounded-md">
                {/* Content of the third column */}
                {/* Plus price */}
                <div className="px-6 flex flex-col justify-end">
                  <div className="grow pb-4 mb-4 border-b border-slate-800">
                    <div className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-200 pb-0.5">
                      Plus
                    </div>
                    <div className="mb-1">
                      <span className="text-lg font-medium text-slate-500">
                        $
                      </span>
                      <span className="text-3xl font-bold text-slate-50">
                        20
                      </span>
                      <span className="text-sm text-slate-600 font-medium">
                        /mo
                      </span>
                    </div>
                    <div className="text-slate-500">Become super human.</div>
                  </div>
                  <div className="pb-4 border-b border-slate-800">
                    <Button
                      variant="default"
                      type="button"
                      onClick={() => {
                        router.push('/auth/signin');
                      }}
                      className="block w-full py-2 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 "
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end ">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Unlimited</span>
                    <span className="md:hidden flex">Unlimited</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span>All</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Yes</span>
                    <span className="md:hidden flex">Attach links</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end ">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">
                      Unlimited integrations
                    </span>
                    <span className="md:hidden flex">
                      Unlimited integrations
                    </span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end ">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Unlimited</span>
                    <span className="md:hidden flex">Unlimited workspaces</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">GPT-4</span>
                    <span className="md:hidden flex">GPT-4</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Unlimited messages</span>
                    <span className="md:hidden flex">Unlimited messages</span>
                  </div>
                </div>
                <div className="px-6 flex flex-col justify-end">
                  <div className="flex items-center h-full border-b border-slate-800 py-2 text-slate-400">
                    <svg
                      className="shrink-0 fill-indigo-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="9"
                    >
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" />
                    </svg>
                    <span className="md:flex hidden">Priority</span>
                    <span className="md:hidden flex">Priority support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
