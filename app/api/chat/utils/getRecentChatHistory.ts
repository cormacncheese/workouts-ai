import { Message } from '@/types/custom';
import { cleanHistory } from '@/app/api/chat/utils/cleanHistory';

interface Props {
  history: Message[];
}

export default async function GetRecentChatHistory({ history }: Props) {
  const cleanedMessages = cleanHistory(history);

  const stringifiedMessages = JSON.stringify(cleanedMessages);

  const recentHistory = stringifiedMessages.slice(-1500);

  // Maybe should run chat history through a summarizer chain instead

  return recentHistory;
}
