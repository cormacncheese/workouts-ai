type Props = {
  customer_id: string;
  query: string;
  k: number;
  link_ids: string[];
};

export async function searchCarbonLinks({
  customer_id,
  query,
  k,
  link_ids
}: Props) {
  try {
    if (!link_ids.length || link_ids.length === 0) {
      throw new Error('No link ids provided.');
    }

    console.log('link_ids: ', link_ids);

    console.log('searching carbon links...: ', query);

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
        file_ids: link_ids
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

    // console.log('carbonDocuments from links: ', carbonDocuments);

    const documents = carbonDocuments.filter((doc: any) => doc.score > 0.01);

    if (documents) {
      const items = await Promise.all(
        documents.map((doc: any) => {
          return {
            source_type: doc.source_type,
            source: doc.source,
            source_url: doc.source_url,
            content: doc.content
          };
        })
      );

      const stringified = JSON.stringify(items);

      return stringified;
    } else {
      throw new Error('No documents found from links.');
    }
  } catch (e) {
    return '';
  }
}
