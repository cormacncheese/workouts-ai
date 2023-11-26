import { getSession } from '@/app/supabase-server';
import { supabase } from '@/app/api/utils/supabase-server-client';

export async function getUserId() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  return user.id;
}

export async function saveUserBio(bio: any) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ bio: bio })
    .eq('id', user.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function getCurrentUserData() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user: ', error);
    return null;
  }

  return data;
}

export async function getSubscription() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .eq('user_id', user.id)
      .single();

    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export const getActiveProductsWithPrices = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};
