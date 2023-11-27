import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { getModel } from '../utils/model';
import { addToLearned } from './addToLearned';

type Props = {
  query: string;
  messageHistory: string;
  userBio: any;
  uid: string;
  businessId?: string;
};

export async function learnUser({
  query,
  messageHistory,
  userBio,
  uid,
  businessId
}: Props) {
  const model = await getModel({});

  // Make request
  const prompt = PromptTemplate.fromTemplate(
    `You are in charge of collecting and learning information about a user.
    
    As part of your job you learn about the user every time they send a message. You only collect

    You use a combination of the new message: {query}, the converstion history: {messageHistory} to learn something about the user.

    Do not collect all information. Only facts and specific information about the user such as preferences. If a user sends you an article don't keep track of this.

    You already respect user privacy but always return a snippet of what you learned.

    Do not learn:
    - the data

    Return what you learned, don't preface it with "I learned...". Just return the information.

    Be concise, and don't include extra information or things like "As an AI language model"

    If you didn't learn anything, return nothing.
    `
  );

  try {
    const chain = new LLMChain({ llm: model, prompt: prompt });

    const response = await chain.call({
      query: query,
      messageHistory: messageHistory
    });

    const reply = response?.text?.trim();

    const addRes = await addToLearned({
      uid: uid,
      businessId: businessId,
      information: reply
    });

    if (addRes) {
      return true;
    } else {
      throw new Error('Could not add to ai learned knowledge');
    }
  } catch (e) {
    return false;
  }
}
