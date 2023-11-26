import { supabase } from '@/app/api/utils/supabase-server-client';

export default async function removeDocumentsWithIds(rowIds: string[]) {
  for (const id of rowIds) {
    await supabase.from('documents').delete().eq('id', id);
  }

  return true;
}
