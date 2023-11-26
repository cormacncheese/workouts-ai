import {
  SupabaseFilterRPCCall,
  SupabaseVectorStore
} from 'langchain/vectorstores/supabase';
import { supabase } from '@/app/api/utils/supabase-server-client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import filterDocumentsBySimilarityScore from '@/app/api/chat/utils/filterDocumentsByScore';

interface Props {
  query: string;
  uid: string;
  businessId?: string;
}

export default async function SimilaritySearchWebsite({
  query,
  uid,
  businessId
}: Props) {
  const embeddings = new OpenAIEmbeddings();

  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: 'documents'
  });

  let funcFilter: SupabaseFilterRPCCall;

  if (businessId) {
    funcFilter = (rpc) =>
      rpc
        .filter('metadata->>uid::string', 'eq', uid)
        .filter('metadata->>business_id:string', 'eq', businessId)
        .filter('metadata->>type:string', 'eq', 'business website');
  } else {
    funcFilter = (rpc) =>
      rpc
        .filter('metadata->>uid::string', 'eq', uid)
        .filter('metadata->>type:string', 'eq', 'personal website');
  }

  const supabaseResponse = await store.similaritySearch(query, 4, funcFilter);

  const documents = await filterDocumentsBySimilarityScore(
    supabaseResponse,
    0.85
  );

  if (documents) {
    const onlyText = documents.map((doc) => doc.pageContent);
    const stringified = JSON.stringify(onlyText);

    return stringified;
  } else {
    return false;
  }
}
