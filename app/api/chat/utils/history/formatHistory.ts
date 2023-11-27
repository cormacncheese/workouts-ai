import { Message } from '@/types/custom';

export function formatHistory(messages: Message[]) {
  const cleanedMessages = messages.map((message) => ({
    role: message.role || 'user',
    content: message.content
  }));
  return cleanedMessages;
}
