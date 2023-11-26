import { Message } from '@/types/custom';
import PulseLoader from '@/components/molecules/PulseLoader';
import { Separator } from '@/components/ui/separator';
import { ChatMessage } from './chat-message';
import { Button } from '@/components/ui/button';
import { Link, FolderClosed, Search } from 'lucide-react';

export interface ChatList {
  setOpenAttachments: React.Dispatch<React.SetStateAction<boolean>>;
  messages: Message[];
  isLoading: boolean;
  uid: string;
  threadId?: string | null;
  businessId?: string | null;
  workspace?: any;
}

export function ChatList({
  setOpenAttachments,
  messages,
  isLoading,
  uid,
  threadId,
  businessId,
  workspace
}: ChatList) {
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className="my-4 md:my-8">
          <ChatMessage
            message={message}
            index={index}
            messagesLength={messages.length}
            isLoading={isLoading}
            uid={uid}
            threadId={threadId}
            businessId={businessId}
            workspace={workspace}
          />
          {/* {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )} */}
        </div>
      ))}

      {messages.length === 1 && !isLoading && (
        <div className="flex flex-row gap-4">
          <Button
            variant="outline"
            className="w-full text-left"
            onClick={() => {
              setOpenAttachments(true);
            }}
          >
            <FolderClosed className="mr-2 w-4 h-4" />
            Attach a file
          </Button>
          <Button
            variant="outline"
            className="w-full text-left"
            onClick={() => {
              setOpenAttachments(true);
            }}
          >
            <Link className="mr-2 w-4 h-4" />
            Connect a link
          </Button>
        </div>
      )}
    </div>
  );
}
