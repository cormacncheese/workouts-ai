import { Message } from '@/types/custom';
import { formatHistory } from '@/app/api/chat/utils/history/formatHistory';

interface Props {
  history: Message[];
}

export default async function GetRecentChatHistory({ history }: Props) {
  const cleanedMessages = formatHistory(history);

  const stringifiedMessages = JSON.stringify(cleanedMessages);

  const recentHistory = stringifiedMessages.slice(-1500);

  // Maybe should run chat history through a summarizer chain instead

  return recentHistory;
}
