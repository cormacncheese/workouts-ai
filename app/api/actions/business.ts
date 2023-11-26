'use server';

import { supabase } from '@/app/api/utils/supabase-server-client';

export async function getBusinessData(businessId: string) {
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
