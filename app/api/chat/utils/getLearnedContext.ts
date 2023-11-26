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

export default async function getLearnedContext({
  query,
  uid,
  businessId
}: Props) {
  const embeddings = new OpenAIEmbeddings();

  console.log('getLearnedContext:: ', query, uid, businessId);

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
        .filter('metadata->>type:string', 'eq', 'ai learned');
  } else {
    funcFilter = (rpc) =>
      rpc
        .filter('metadata->>uid::string', 'eq', uid)
        .filter('metadata->>type:string', 'eq', 'ai learned');
  }

  const supabaseResponse = await store.similaritySearchWithScore(
    query,
    4,
    funcFilter
  );

  // console.log('LEARNED supabaseResponse:: ', supabaseResponse);

  const documents = await filterDocumentsBySimilarityScore(
    supabaseResponse,
    0.75
  );

  if (documents) {
    const pageContent = documents.map((doc) => doc.pageContent).join(' ');
    return pageContent;
  } else {
    return false;
  }
}
