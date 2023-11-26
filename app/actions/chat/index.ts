'use server';

import { supabase } from '@/utils/supabase';
import { getSession } from '@/app/supabase-server';

export async function getThreadMessages(threadId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createNewThread() {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('threads')
    .upsert([{ uid: user?.id }])
    .select();

  if (error) {
    console.log('Error:', error);
    throw new Error(error.message);
  }

  return data[0];
}

export async function addMessageToThread(
  threadId: string,
  content: string,
  role: string
) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([
      { thread_id: threadId, content: content, role: role, uid: user?.id }
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

export async function removeMessage(messageId: string) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserChatHistory(page: number, limit: number) {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const uid = user?.id;

  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit * 2; // Fetch more threads initially

  const { data: threads, error: threadsError } = await supabase
    .from('threads')
    .select('*')
    .eq('uid', uid)
    .order('created_at', { ascending: false })
    .range(startIndex, endIndex); // Use range for pagination

  if (threadsError) {
    throw new Error(threadsError.message);
  }

  const threadsWithMessages = [];

  for (const thread of threads) {
    const { data: threadMessages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', thread.id);

    if (messagesError) {
      throw new Error(messagesError.message);
    }

    // Only push threads with 2 or more messages
    if (threadMessages.length >= 2) {
      threadsWithMessages.push({ ...thread, messages: threadMessages });
    }

    // Break the loop when we have enough threads
    if (threadsWithMessages.length >= limit) {
      break;
    }
  }

  return threadsWithMessages;
}

export async function addToSaved({
  label,
  content,
  thread_id,
  uid,
  business_id,
  workspace_type
}: {
  label: string;
  content: string;
  thread_id: string;
  uid: string;
  business_id?: string | null | undefined;
  workspace_type: string;
}) {
  try {
    const { data: existingSaved, error: existingError } = await supabase
      .from('saved')
      .select('*')
      .eq('content', content);

    if (existingError) {
      throw new Error(existingError.message);
    }

    if (existingSaved.length > 0) {
      throw new Error('Content already exists in saved.');
    }

    // first save
    const { data: insertData, error } = await supabase
      .from('saved')
      .insert([
        {
          content,
          label,
          thread_id,
          uid,
          business_id,
          workspace_type
        }
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!insertData) {
      throw new Error('No data returned from insert.');
    }

    console.log('insertData:: ', insertData);

    const row_id = insertData[0]?.id;

    console.log('row_id:: ', row_id);

    // them embed
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}api/embed/saved`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          row_id,
          label,
          content,
          uid,
          business_id: business_id ? business_id : null,
          workspace_type
        })
      }
    ).catch((err) => {
      throw new Error(err);
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.log('Error addToSaved: ', e);
    return false;
  }
}
