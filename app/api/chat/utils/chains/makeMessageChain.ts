import { learnUser } from '@/app/api/chat/utils/learnUser';
import { getModel } from '@/app/api/chat/utils/model';
import SimilaritySearchText from '@/app/api/chat/utils/searchText';
import getLearnedContext from '@/app/api/chat/utils/getLearnedContext';
import searchGoogle from '@/app/api/chat/utils/serpSearch';
import searchSavedEmbeddings from '@/app/api/chat/utils/searchSavedEmbeddings';
import { openai } from '@/app/api/chat/utils/getOpenAI';
import { StreamingTextResponse, OpenAIStream } from 'ai';
import { formatHistory } from '@/app/api/chat/utils/history/formatHistory';
import { Message, OpenAIMessage } from '@/types/custom';
import { determineModel } from '@/app/api/chat/utils/determineModel';

type Props = {
  query: string;
  user_data: any;
  history: Message[];
  is_live_search?: boolean;
};

export default async function makeMessageChain({
  query,
  user_data,
  history,
  is_live_search
}: Props) {
  let prompt;

  const name = user_data.full_name;
  const uid = user_data.uid;
  const userBio = user_data?.bio || '';

  const contextData = `
    Fitness goals: ${userBio?.fitness_goals || ''},
    Where they workout: ${userBio?.workout_location},
    Workout frequency: ${userBio?.workout_frequency || ''},
    Expderience level: ${userBio?.workout_experience || ''},
  `;

  const [
    // relevantData,
    liveSearchContext,
    aiLearnedContext,
    savedContext
  ] = await Promise.all([
    // SimilaritySearchText({
    //   query,
    //   text: contextData,
    //   k: 4
    // }),
    searchGoogle({ query, is_live_search }),
    getLearnedContext({
      query,
      uid
    }),
    searchSavedEmbeddings({
      query,
      uid
    })
  ]);

  console.log('after promises');

  const stringifiedHistory = JSON.stringify(history);

  // Learn about the user for future conversations
  learnUser({
    query,
    messageHistory: stringifiedHistory,
    userBio,
    uid
  });

  const systemMessage = `
    You are a personal trainer and knolegeable about all things fitness, weightlifting, hypertrophy, etc.

    My name: ${user_data?.full_name}. Only greet me with my name when applicable, do not use it every message.

    Prioritize data from User preferences when possible.

    Respond in a personal way like a companion.
  `;

  const formattedHistory = (await formatHistory(history)) as any;
  // Add the system message to the beginning of the array
  formattedHistory.unshift({
    role: 'system',
    content: systemMessage
  });

  const newMessage = {
    role: 'user',
    content: `Query: ${query}.

      User preferences:  ${contextData}.

      Live search context: ${liveSearchContext}.

      Previously learned context: ${aiLearnedContext}.

      Saved context: ${savedContext}.
    `
  };

  console.log('newMessage: ', newMessage);

  formattedHistory.push(newMessage);

  const model = await determineModel({});

  const response = await openai.chat.completions.create({
    model: model,
    stream: true,
    messages: formattedHistory
  });

  // @ts-ignore
  const stream = OpenAIStream(response);

  return stream;
}
