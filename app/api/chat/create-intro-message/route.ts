import { StreamingTextResponse, OpenAIStream } from 'ai';
import { metaPrompt } from '@/utils/meta-prompt';
import { getModel } from '../utils/model';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { user_name } = await req.json();

      const systemMessage = `
       You are a personal trainer and knolegeable about all things fitness, weightlifting, hypertrophy, etc.
                        
        User name: ${user_name}.

        Meta Prompt: ${metaPrompt}

        Great the user like a companion, friend and trainer
        
        Use the date to greet the user casually.
        
      `;

      // const prompt = PromptTemplate.fromTemplate(`
      //   You are a personal trainer and knolegeable about all things fitness, weightlifting, hypertrophy, etc.

      //   User name: {user_name}.

      //   Great the user like a companion, friend and trainer

      //   Use the date to greet the user casually
      // `);

      // const { stream } = LangChainStream();

      // const model = await getModel({ overRideModel: 'gpt-4' });

      // const chain = new LLMChain({ llm: model, prompt: prompt });

      // chain.call({
      //   user_name: user_name || '',
      //   metaPrompt: metaPrompt
      // });

      const response = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        stream: true,
        messages: [
          {
            role: 'system',
            content: systemMessage
          }
        ]
      });

      const stream = OpenAIStream(response);

      console.log('after chain call: ', stream);

      // Respond with the stream
      return new StreamingTextResponse(stream);
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
