'use server';

import { supabase } from '@/utils/supabase';

export async function addToWaitlist(
  email: string,
  name: string,
  response: string,
  feature: string
) {
  try {
    // first check supabase if email exists in waitlist table with the feature
    const { error: getError, data: waitlist } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .eq('feature', feature);

    if (waitlist && waitlist?.length > 0) {
      throw new Error('You are already on the waitlist.');
    }

    // if not, add user to waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        { email: email, name: name, response: response, feature: feature }
      ]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: 'You have been added to the waitlist!' };
  } catch (e) {
    if (e instanceof Error) {
      return { success: false, message: e.message };
    }
    return { success: false, message: 'An error occurred' };
  }
}

export async function checkIfEmailIsApproved(email: string, feature: string) {
  const { data: approved, error } = await supabase
    .from('waitlist')
    .select('accepted')
    .eq('email', email)
    .eq('feature', feature);

  if (error) {
    throw new Error(error.message);
  }

  if (approved && approved.length > 0) {
    return approved[0].accepted;
  }

  return false;
}
