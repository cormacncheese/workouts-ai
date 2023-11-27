import {
  SupabaseFilterRPCCall,
  SupabaseVectorStore
} from 'langchain/vectorstores/supabase';
import { supabase } from '@/app/api/utils/supabase-server-client';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import CreateDocsFromText from './createDocsFromText';
import { getModel } from './model';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import removeDocumentsWithIds from '../../embed/utils/removeDocumentsWithIds';
import addDocsToSupabase from '../../embed/utils/addDocsToSupabase';
import filterDocumentsBySimilarityScore from '@/app/api/chat/utils/filterDocumentsByScore';

type Props = {
  uid: string;
  businessId?: string;
  information: string;
};

// AI learned information is stored in the documents table
// 1) Similarity search user learned – return DOCs
// 2) Compare docs with new query
// 3) Remove old docs if conflicting and add updated docs
// 4) Add new docs if non existing

export async function addToLearned({ uid, businessId, information }: Props) {
  if (!uid) return;

  const embeddings = new OpenAIEmbeddings();

  try {
    const store = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: 'documents'
    });

    let funcFilter: SupabaseFilterRPCCall;

    // Create filter – only allow users to update "local" information (query by uid)
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

    // Get documents that match the new learned information

    const arrayOfDocuments = await store.similaritySearchWithScore(
      information,
      4,
      funcFilter
    );

    const documents = await filterDocumentsBySimilarityScore(
      arrayOfDocuments,
      0.85
    );

    // If matching documents, combine and update info and delete old documents
    if (documents && documents.length > 0) {
      const documentContents = documents.map((doc) => doc.pageContent);

      const existingInformation = documents
        .map((doc) => doc.pageContent)
        .join(' ');

      // Check if the documents contradict the new information
      // If so, update information, remove old information and add new information
      const model = await getModel({});

      // Make request
      const prompt = PromptTemplate.fromTemplate(
        `You are in charge of collecting and learning information about a user.
    
        Your job is to compare old and new information about a the user.

        You use a combination of the existing information: {existing}. And new information you learned {new_information} to create a new learning about the user.

        If they condradict, you should update the information with theh new information.

        DO NOT OVERWRITE information unless it contradicts. For example if old information is: user likes weightlifting. And new information is: the user needs a workout plan. The combined information should include both.

        If something is unknown do not include it in the new information.

        Return just the new udpated information which combine the two.  Don't preface it with "I learned... or the new updated information...".
        
        Just return the combined information as text without any extra information.
    `
      );

      const chain = new LLMChain({ llm: model, prompt: prompt });

      const response = await chain.call({
        existing: existingInformation,
        new_information: information
      });

      const reply = response?.text?.trim();

      // add new information to ai learned
      const newDocuments = await CreateDocsFromText({ text: reply });

      // add metadata
      const newDocumentsWithMetadata = newDocuments.map((doc) => {
        doc.metadata = {
          type: 'ai learned',
          uid: uid,
          business_id: businessId ? businessId : null
        };
        return doc;
      });

      const addRes = await addDocsToSupabase(newDocumentsWithMetadata);

      // remove old documents
      let existingRowIds: string[] = [];
      if (addRes) {
        // get existingRowIds
        const promises = documentContents.map(async (content) => {
          // get all row ids with documentContents
          const { data, error } = await supabase
            .from('documents')
            .select('id')
            .eq('content', content);

          console.log('existing row ids', data);

          if (data && data.length > 0) {
            const id = data[0]?.id;
            existingRowIds.push(id);
          }
        });

        await Promise.all(promises);

        console.log('removing old documents with ids', existingRowIds);

        if (existingRowIds.length > 0) {
          await removeDocumentsWithIds(existingRowIds);
        }
      }

      return true;
    } else {
      // Add new learned information to documents table
      const newDocuments = await CreateDocsFromText({ text: information });

      // add metadat
      const newDocumentsWithMetadata = newDocuments.map((doc) => {
        doc.metadata = {
          type: 'ai learned',
          uid: uid,
          business_id: businessId ? businessId : null
        };
        return doc;
      });

      await store.addDocuments(newDocumentsWithMetadata);

      return true;
    }
  } catch (e) {
    console.error('Error adding to learned', e);
    return false;
  }
}
