import { supabase } from '@/app/api/utils/supabase-server-client';

// removes docs with metadata.type === 'website' and metadata.uid === current user id
export default async function mgetCurrentWebsiteVectors(
  uid: string | null,
  businessId: string | null
) {
  if (!uid) {
    return [];
  }

  try {
    let websiteDocs: any[] | null;
    let getError;

    if (businessId) {
      const { data, error } = await supabase
        .from('documents')
        .select('id')
        .eq('metadata->>type', 'website')
        .eq('metadata->>uid', uid)
        .eq('metadata->>uid', businessId);

      websiteDocs = data;
      getError = error;
    } else {
      const { data, error } = await supabase
        .from('documents')
        .select('id')
        .eq('metadata->>type', 'website')
        .eq('metadata->>uid', uid);

      websiteDocs = data;
      getError = error;
    }

    if (getError) {
      console.error('Error fetching website vectors:', getError);
      return [];
    }

    const ids = websiteDocs ? websiteDocs.map((doc) => doc.id) : [];

    return ids;
  } catch (err) {
    console.error('Unexpected error fetching website vectors:', err);
    return [];
  }
}
