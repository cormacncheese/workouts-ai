import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { supabase } from '@/app/api/utils/supabase-server-client';
import { moderateText } from '@/app/api/actions/moderate';

// vectorizes docs and upserts them to supabase table 'documents'
export default async function addDocsToSupabase(documents: Document[]) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 50
    });

    const docOutput = await splitter.splitDocuments(documents);

    // go through each doc and pass pageContent through moderation
    docOutput.forEach(async (doc) => {
      const text = doc.pageContent;
      // first moderate
      const isClean = await moderateText(text);

      if (!isClean) {
        throw new Error('Text is not clean');
      }
    });

    const embeddings = new OpenAIEmbeddings();

    const store = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'documents'
    });

    await store.addDocuments(docOutput);

    return true;
  } catch (e) {
    return false;
  }
}
