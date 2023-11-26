import { Message } from '@/types/custom';
import { cleanHistory } from '@/app/api/chat/utils/cleanHistory';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ScoreThresholdRetriever } from 'langchain/retrievers/score_threshold';

interface Props {
  query: string;
  history: Message[];
}

export default async function SimilaritySearchChatHistory({
  query,
  history
}: Props) {
  const cleanedMessages = cleanHistory(history);

  // Convert your messages into texts for the vector store
  const texts = cleanedMessages.map(
    (message) => `${message.role}: ${message.content}`
  );

  const vectorStore = await MemoryVectorStore.fromTexts(
    texts,
    cleanedMessages, // Use the original messages as the documents
    new OpenAIEmbeddings()
  );

  const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
    minSimilarityScore: 0.8, // Finds results with at least this similarity score
    maxK: 100, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
    kIncrement: 2 // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  });

  const result = await retriever.getRelevantDocuments(query);

  return result;
}
