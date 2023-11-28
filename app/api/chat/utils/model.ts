import { OpenAI } from 'langchain/llms/openai';
import { getUserId } from '@/app/api/actions/user';
import { determineModel } from '@/app/api/chat/utils/determineModel';

export const LLM_MODELS = {
  'gpt-3': 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'gpt-4': 'gpt-4-1106-preview'
};

type Props = {
  overRideModel?: string;
};

export async function getModel({ overRideModel }: Props) {
  const [uid] = await Promise.all([getUserId()]);

  const model = await determineModel({ overRideModel });

  return new OpenAI({
    modelName: model,
    user: uid ? uid : 'unknown',
    configuration: {
      basePath: 'https://oai.hconeai.com/v1',
      baseOptions: {
        headers: {
          'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`
        }
      }
    },
    temperature: 0.7,
    streaming: true
  });
}
