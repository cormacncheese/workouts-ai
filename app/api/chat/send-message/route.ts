import { StreamingTextResponse, LangChainStream } from 'ai';
import moderateNewMessage from '../utils/moderateNewMessage';
import makeMessageChain from '../utils/chains/makeMessageChain';

export const runtime = 'edge';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { query, user_data, history, is_live_search } = await req.json();

    try {
      // First moderate
      const moderationResult = await moderateNewMessage({ message: query });
      if (moderationResult !== true) {
        return moderationResult;
      }

      console.log('send-message user_data: ', user_data);

      const stream = await makeMessageChain({
        query,
        user_data,
        history,
        is_live_search
      });

      // Respond with the stream
      return new StreamingTextResponse(stream);
    } catch (err) {
      console.log('send-message error: ', err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
