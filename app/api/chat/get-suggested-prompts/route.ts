import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { getModel } from '../utils/model';
import { currentDate, dayOfWeek } from '@/utils/date';
import GetRecentChatHistory from '../utils/history/getRecentChatHistory';

export const runtime = 'edge';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { history, workspace } = await req.json();

    try {
      const [recentChatHistory] = await Promise.all([
        GetRecentChatHistory({ history })
      ]);

      const stringifiedHistory = JSON.stringify(recentChatHistory);

      const prompt = PromptTemplate.fromTemplate(
        `You are a helpful personal assistant and companion. You help me with anything users need.
        
          This includes files, documents, messages, websites, integrations and more.

          Recent message history: {history}.

          Come up with 2 relevant prompts the user can ask you to help them with their personal or business life.      
          
          Return the 2 prompts in a list of objects. Each prompt should have a title and a prompt.

          Example title: "Write a blog outline"
          Example prompt: "Write a blog outline in my brand voice using the data in my website"

          Example title: "Learn more about sales strategy"
          Example prompt: "Help me learn more about sales strategy using the data in my CRM"

          The prompt should be in the voice of the user talking to you.
        `
      );

      const model = await getModel({ overRideModel: 'gpt-3' });

      const chain = new LLMChain({ llm: model, prompt: prompt });

      const response = await chain.call(
        {
          date: currentDate,
          day_of_week: dayOfWeek,
          history: stringifiedHistory
        },
        {}
      );

      const reply = response?.text?.trim();

      return new Response(JSON.stringify({ response: reply }), {
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
