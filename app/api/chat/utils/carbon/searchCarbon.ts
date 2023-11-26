type Props = {
  customer_id: string;
  query: string;
  k: number;
};

export async function searchCarbon({ customer_id, query, k }: Props) {
  try {
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
        hybrid_search: true,
        hybrid_search_tuning_parameters: {
          weight_a: 0.5,
          weight_b: 0.5
        }
      })
    })
      .then((response) => response.json())
      .then((data) => {
        return data.documents;
      })
      .catch((err) => {
        console.error('Error fetching carbon embeddings:', err);
        return [];
      });

    const documents = carbonDocuments.filter((doc: any) => doc.score > 0.01);

    if (documents) {
      const items = await Promise.all(
        documents.map((doc: any) => {
          const url = doc?.source_url ? new URL(doc.source_url) : '';
          const baseDomain = url ? url?.hostname?.split('.')[1] : '';

          return {
            integration: baseDomain,
            source: doc.source,
            source_url: doc?.source_url,
            content: doc.content
          };
        })
      );

      const stringified = JSON.stringify(items);

      return stringified;
    } else {
      return false;
    }
  } catch (e) {
    console.log('Error searching all of carbon: ', e);
    return false;
  }
}
