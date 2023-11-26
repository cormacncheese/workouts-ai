import CreateDocsFromText from '@/app/api/chat/utils/createDocsFromText';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { supabase } from '@/app/api/utils/supabase-server-client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const {
      row_id,
      label,
      content,
      uid,
      businessId,
      workspace_type
    } = await req.json();

    try {
      const embeddings = new OpenAIEmbeddings();

      const store = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: 'documents'
      });

      // create documents from text
      const savedDocuments = await CreateDocsFromText({ text: content, label });

      // add metadata
      const newDocumentsWithMetadata = savedDocuments.map((doc) => {
        doc.metadata = {
          type: 'saved',
          saved_table_row_id: row_id,
          uid: uid,
          business_id: businessId ? businessId : null,
          workspace_type: workspace_type || 'unknown'
        };
        return doc;
      });

      await store.addDocuments(newDocumentsWithMetadata);

      return new Response(JSON.stringify({ success: true }), {
        status: 200
      });
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
