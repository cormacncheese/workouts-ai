import { UseChatHelpers } from 'ai/react';
import * as React from 'react';
import Textarea from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import { Message } from '@/types/custom';
import { SendHorizontal } from 'lucide-react';
import Attachments from './attachments';

export interface PromptProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  threadId: string | null;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
  messages: any;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  send: any;
  isLiveSearch: boolean;
  setIsLiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
  attachmentsOpen: boolean;
  setAttachmentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string | null;
}

export function PromptForm({
  isLoading,
  setIsLoading,
  threadId,
  setThreadId,
  messages,
  setMessages,
  query,
  setQuery,
  send,
  isLiveSearch,
  setIsLiveSearch,
  attachmentsOpen,
  setAttachmentsOpen,
  uid
}: PromptProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  React.useEffect(() => {
    if (inputRef.current && query !== '') {
      inputRef.current.focus();
    }
  }, [query]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // prevent the default action (line break)
      send();
    }
  };

  return (
    <div
      className="relative flex max-h-60 w-full grow flex-col overflow-hidden sm:rounded-md sm:border "
      style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.2)' }}
    >
      <div className="absolute left-0 top-4 ">
        <Attachments
          isOpen={attachmentsOpen}
          setIsOpen={setAttachmentsOpen}
          uid={uid || ''}
          isLiveSearch={isLiveSearch}
          setIsLiveSearch={setIsLiveSearch}
        />
      </div>

      <Textarea
        ref={inputRef}
        tabIndex={0}
        rows={1}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="How can I help?"
        onKeyDown={handleKeyPress}
        spellCheck={false}
        className="min-h-[60px] w-full resize-none bg-muted px-4 pr-20 pl-10 py-[1.3rem] shadow-lg focus-within:outline-none sm:text-sm"
      />

      <div className="absolute top-3 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                onClick={send}
                disabled={isLoading || query === ''}
              >
                <SendHorizontal />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
