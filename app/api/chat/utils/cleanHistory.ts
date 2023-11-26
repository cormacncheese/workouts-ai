import { Message } from '@/types/custom';

export function cleanHistory(messages: Message[]) {
  const cleanedMessages = messages.map((message) => ({
    role: message.role,
    content: message.content
  }));
  return cleanedMessages;
}
