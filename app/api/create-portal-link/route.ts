import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { getURL } from '@/utils/helpers';
import { Database } from '@/types/supabase';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw Error('Could not get user');
      const customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });

      if (!customer) throw Error('Could not get customer');
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/dashboard/trainer`
      });
      return new Response(JSON.stringify({ url }), {
        status: 200
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';
      return new Response(
        JSON.stringify({ error: { statusCode: 500, message: message } }),
        {
          status: 500
        }
      );
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
