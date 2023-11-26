import { moderateQuery } from '../utils/moderateQuery';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { text } = await req.json();

    try {
      const accepted = await moderateQuery(text);

      return new Response(JSON.stringify({ response: accepted }), {
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
