'use server';

import { supabase } from '@/utils/supabase';
import { getSession } from '@/app/supabase-server';
import { moderateText } from '@/app/actions/moderate';
import { TodoItem } from '@/types/custom';

export async function createNewBusiness(name: string) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert({ name: name, owner: user.id })
    .select();

  if (error) {
    console.error('Error creating business: ', error);
    return null;
  }

  return data;
}

export async function getBusinessData({
  businessId
}: {
  businessId: string | null;
}) {
  if (!businessId) {
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveBusinessBio(businessId: string, bio: any) {
  const text = JSON.stringify(bio);

  console.log('businessId: ', businessId);

  try {
    // first moderate
    const isClean = await moderateText(text);
    if (!isClean) {
      throw new Error('Bio contains inappropriate content.');
    }

    const session = await getSession();

    const user = session?.user;

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('businesses')
      .update({ bio: bio })
      .eq('id', businessId)
      .select();

    if (error) {
      console.error('Found bad content: ', error);
      throw new Error(error.message);
    }

    return data[0];
  } catch (e) {
    console.error('Error saving business bio: ', e);
    return false;
  }
}

export async function updateBusinessName(businessId: string, name: string) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .update({ name: name })
    .eq('id', businessId)
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

export async function updateTodoInBusiness(
  businessId: string | null,
  todo: TodoItem[]
) {
  const session = await getSession();

  const user = session?.user;

  if (!user || !businessId) {
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .update({ todo: todo })
    .eq('id', businessId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}
