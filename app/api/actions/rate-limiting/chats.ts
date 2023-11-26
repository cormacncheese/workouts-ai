import { getSession } from '@/app/supabase-server';
import { supabase } from '@/app/api/utils/supabase-server-client';

const MAX_MESSAGES_PER_HOUR = 1000;

export const isWithinChatRateLimit = async () => {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const uid = user.id || '';

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('uid', uid)
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if (error) {
    console.error('Error fetching messages: ', error);
    return false;
  }

  return messages.length <= MAX_MESSAGES_PER_HOUR;
};
