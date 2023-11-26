type Props = {
  customer_id: string;
  query: string;
  k: number;
  file_ids: string[];
};

export async function searchCarbonFiles({
  customer_id,
  query,
  k,
  file_ids
}: Props) {
  try {
    console.log('searchCarbonFiles:: ', customer_id, query, k, file_ids);

    if (!file_ids.length || file_ids.length === 0) {
      throw new Error('No file ids provided.');
    }

    const carbonDocuments = await fetch('https://api.carbon.ai/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.CARBON_API_KEY,
        'Customer-Id': customer_id
      },
      body: JSON.stringify({
        query,
        k,
        file_ids: file_ids,

        hybrid_search: true,
        hybrid_search_tuning_parameters: {
          weight_a: 0.3,
          weight_b: 0.7
        }
      })
    })
      .then((response) => {
        console.log('FILE RES: ', response);
        return response.json();
      })
      .then((data) => {
        return data.documents;
      })
      .catch((err) => {
        console.error('Error fetching carbon embeddings:', err);
        return [];
      });

    console.log('carbonDocuments from files: ', carbonDocuments);

    const documents = carbonDocuments.filter((doc: any) => doc.score > 0.01);

    if (documents) {
      const items = await Promise.all(
        documents.map((doc: any) => {
          return {
            srouce_type: doc.srouce_type,
            source: doc.source,
            source_url: doc.source_url,
            content: doc.content
          };
        })
      );

      const stringified = JSON.stringify(items);

      return stringified;
    } else {
      throw new Error('No documents found.');
    }
  } catch (e) {
    return '';
  }
}
