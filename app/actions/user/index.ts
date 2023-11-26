'use server';

import { supabase } from '@/utils/supabase';
import { getSession } from '@/app/supabase-server';
import { TodoItem } from '@/types/custom';
import { moderateText } from '@/app/actions/moderate';

export async function getUserId() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  return user.id;
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

export async function getCurrentUserEmail() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  return user.email;
}

export async function updateOnboardingStep(uid: string, step: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ onboarding_step: step })
    .eq('id', uid)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateOnboardingStatus(uid: string, status: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ has_onboarded: status })
    .eq('id', uid)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function saveUserBio(bio: any) {
  const text = JSON.stringify(bio);

  // // first moderate
  // const isClean = await moderateText(text);

  // if (!isClean) {
  //   throw new Error('Bio contains inappropriate content.');
  // }

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

export async function updateWebsiteInUserBio(website_url: string) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  console;

  const { data, error } = await supabase
    .from('users')
    .update({ website_url: website_url })
    .eq('id', user.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateWebsiteInBusinessBio(
  business_id: string,
  website_url: string
) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .update({ website_url: website_url })
    .eq('id', business_id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function getUserBusinesses() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateTodoInUserBio(todoList: TodoItem[]) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ todo: todoList })
    .eq('id', user.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateUserFullName(uid: string, fullName: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', uid)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function updateSystemInstructions(
  uid: string,
  system_message: string
) {
  const { data, error } = await supabase
    .from('users')
    .update({ system_instructions: system_message })
    .eq('id', uid)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
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
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

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

export const getUserSaved = async () => {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('saved')
    .select('*')
    .eq('uid', user.id);

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};
