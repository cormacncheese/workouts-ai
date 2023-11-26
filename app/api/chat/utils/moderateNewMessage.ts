import { isWithinChatRateLimit } from '@/app/api/actions/rate-limiting/chats';
import { moderateQuery } from '../../utils/moderateQuery';

type Props = {
  message: string;
};

export default async function moderateNewMessage({ message }: Props) {
  // check token amoutn

  const [isWithinLimit, accepted] = await Promise.all([
    isWithinChatRateLimit(),
    moderateQuery(message)
  ]);

  if (!isWithinLimit) {
    return new Response(
      JSON.stringify({
        error: 'You have exceeded your chat limit hour (50 messages).'
      }),
      { status: 400 }
    );
  }

  if (!accepted) {
    return new Response(
      JSON.stringify({
        error: 'Text was found that violates our content policy.'
      }),
      { status: 400 }
    );
  }

  return true;
}
