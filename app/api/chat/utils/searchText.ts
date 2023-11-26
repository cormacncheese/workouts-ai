import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import CreateDocsFromText from './createDocsFromText';
import filterDocumentsBySimilarityScore from '@/app/api/chat/utils/filterDocumentsByScore';

interface Props {
  query: string;
  text: string;
  k: number;
}

export default async function SimilaritySearchText({ query, text, k }: Props) {
  const embeddings = new OpenAIEmbeddings();

  const docs = await CreateDocsFromText({ text });

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const relevantData = await store.similaritySearchWithScore(query, k);

  const documents = await filterDocumentsBySimilarityScore(relevantData, 0.8);

  if (documents && documents.length > 0) {
    const pageContent = relevantData.map((doc) => doc[0].pageContent).join(' ');

    return pageContent;
  } else {
    return '';
  }
}
