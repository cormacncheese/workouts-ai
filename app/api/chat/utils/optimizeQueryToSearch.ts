import { tracer } from '../utils/langSmithClient';
import { LLMChain } from 'langchain/chains';
import { getModel } from '../utils/model';
import { PromptTemplate } from 'langchain/prompts';

type Props = {
  query: string;
};

export default async function OptimizeQueryToSearch({ query }: Props) {
  try {
    const model = await getModel({ overRideModel: 'gpt-3.5-turbo' });

    const prompt = PromptTemplate.fromTemplate(
      `You are a convert a chat message from a user into a search query that can be used in google.
    
    The user has sent you the following message: {query}

    Return a string that is a search query that can be used in google.

    Note: search queries must be short and concise.
    `
    );

    const chain = new LLMChain({ llm: model, prompt: prompt });

    const response = await chain.call(
      {
        query: query
      },
      { callbacks: [tracer] }
    );

    const reply = response?.text?.trim();

    console.log('google saerch query: ', reply);

    return reply;
  } catch (e) {
    return false;
  }
}
