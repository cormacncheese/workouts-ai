import { ExtendedDocument } from '@/types/custom';

// filters supabase docs by similarity score
export default function filterDocumentsBySimilarityScore(
  documents: any[],
  minimumScore = 0.85
) {
  const relevantDocuments = documents.filter((doc) => doc[1] > minimumScore);

  const extractDocuments = (documents: any[]): ExtendedDocument[] => {
    return documents.map((doc) => doc[0]);
  };

  const filteredDocuments = extractDocuments(relevantDocuments);

  return filteredDocuments;
}
