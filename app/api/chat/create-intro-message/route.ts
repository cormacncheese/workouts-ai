import { tracer } from '../utils/langSmithClient';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { metaPrompt } from '@/utils/meta-prompt';
import { getModel } from '../utils/model';
import { currentDate, dayOfWeek } from '@/utils/date';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = true;

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { business_name, user_name } = await req.json();

      // Eventually want
      // - emails synced
      // - calendar synced
      // Maybe - user learned, history (pick back up where you left off), etc.

      const prompt = PromptTemplate.fromTemplate(`
          You are a helpful personal assistant and companion. You help me with anything I need.
                          
          User name: {user_name}.

          Business name: {business_name}. 

          Date: {date}. Day of the week: {day_of_week}.

          Be concise and to the point. Only answer in 1 sentence.

          Great the user like a companion, friend and personal assistant.
          
          Use the date to greet the user casually
        `);

      const { stream, handlers } = LangChainStream();

      const model = await getModel({ overRideModel: 'gpt-4' });

      const chain = new LLMChain({ llm: model, prompt: prompt });

      chain.call(
        {
          user_name: user_name || '',
          business_name: business_name || '',
          date: currentDate,
          day_of_week: dayOfWeek,
          metaPrompt: metaPrompt
        },
        {
          callbacks: [tracer, handlers]
        }
      );

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
