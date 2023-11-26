import { compile } from 'html-to-text';
import { RecursiveUrlLoader } from 'langchain/document_loaders/web/recursive_url';
import vectorizeDocs from '../utils/addDocsToSupabase';
import { getUserId } from '@/app/api/actions/user';
import getCurrentWebsiteVectors from '../utils/getCurrentWebsiteVectors';
import removeCurrentWebsiteEmbeds from '../utils/removeDocumentsWithIds';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { url, businessId, type } = await req.json();

    try {
      const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

      const loader = new RecursiveUrlLoader(url, {
        extractor: compiledConvert,
        maxDepth: 1,
        excludeDirs: [url]
      });

      const docs = await loader.load();

      const uid = await getUserId();

      // add extra medatada to docs
      docs.forEach((doc) => {
        doc.metadata = {
          uid: uid,
          business_id: businessId,
          type: type
        };
      });

      // first remove current website vectors
      const currentWebsiteVectorIds = await getCurrentWebsiteVectors(
        uid,
        businessId
      );

      const vector = await vectorizeDocs(docs);

      // only if new vectors were added, remove old vectors
      if (vector && currentWebsiteVectorIds?.length > 0) {
        await removeCurrentWebsiteEmbeds(currentWebsiteVectorIds);
      }

      return new Response(JSON.stringify({ vector: vector }), {
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
