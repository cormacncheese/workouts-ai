import { OpenAI } from 'langchain/llms/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SerpAPILoader } from 'langchain/document_loaders/web/serpapi';
import optimizeQueryToSearch from './optimizeQueryToSearch';

type Props = {
  query: string;
  is_live_search?: boolean;
};

export default async function searchGoogle({
  query,
  is_live_search = true
}: Props) {
  if (!is_live_search) {
    return '';
  }

  try {
    // Initialize the necessary components
    const llm = new OpenAI();
    const embeddings = new OpenAIEmbeddings();
    const apiKey = process.env.SERP_API_KEY;

    // Define your question and query
    const question = query;
    const searchQuery = await optimizeQueryToSearch({ query });

    if (!searchQuery) {
      throw new Error('No search query found');
    }

    // Use SerpAPILoader to load web search results
    const loader = new SerpAPILoader({ q: searchQuery, apiKey });
    const docs = await loader.load();

    // Use MemoryVectorStore to store the loaded documents in memory
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    // Use RetrievalQAChain to retrieve documents and answer the question
    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever());
    const answer = await chain.call({ query: question });

    console.log('Serp reseponse: ', answer.text);

    return answer.text;
  } catch (e) {
    return '';
  }
}
