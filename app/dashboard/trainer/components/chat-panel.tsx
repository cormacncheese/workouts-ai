import { Button } from '@/components/ui/button';
import { PromptForm } from './prompt-form';
import { ButtonScrollToBottom } from './button-scroll-to-bottom';
import { RotateCcw, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ChatPanelProps {
  chatRef: HTMLDivElement | null;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  reload: any;
  stop: any;
  messages: any;
  setMessages: any;
  threadId: string | null;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  send: any;
  promptSuggestions: any;
  isLiveSearch: boolean;
  setIsLiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
  attachmentsOpen: boolean;
  setAttachmentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uid: string | null;
}

export function ChatPanel({
  chatRef,
  query,
  setQuery,
  isLoading,
  setIsLoading,
  reload,
  stop,
  messages,
  threadId,
  setThreadId,
  setMessages,
  send,
  promptSuggestions,
  isLiveSearch,
  setIsLiveSearch,
  attachmentsOpen,
  setAttachmentsOpen,
  uid
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-transparent">
      {/* <ButtonScrollToBottom chatRef={chatRef} /> */}
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center md:justify-center gap-4 md:mb-0 mb-2">
          {isLoading && messages?.length > 1 ? (
            <Button variant="outline" onClick={stop} className="bg-background">
              <XCircle className="mr-2" />
              Cancel
            </Button>
          ) : (
            <></>
            // messages?.length > 1 && (
            //   <Button
            //     variant="outline"
            //     onClick={() => reload()}
            //     className="bg-background mb-2"
            //   >
            //     <RotateCcw className="mr-2" />
            //     Regenerate response
            //   </Button>
            // )
          )}

          {!isLoading && promptSuggestions && (
            <div className="flex flex-nowrap md:overflow-auto overflow-x-scroll md:justify-center w-full hide-scrollbar md:mb-8 mb-2">
              {promptSuggestions.map((prompt: any) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  key={prompt.prompt}
                  className="flex-shrink-0 px-1"
                >
                  <Button
                    variant="outline"
                    onClick={() => setQuery(prompt.prompt)}
                    className="h-14 hover:cursor-pointer py-1 md:w-48 flex justify-start items-center md:text-sm text-sm w-[60vw] text-left overflow-hidden"
                    style={{
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {prompt.title}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="md:mb-6 mb-0">
          <PromptForm
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            threadId={threadId}
            setThreadId={setThreadId}
            messages={messages}
            setMessages={setMessages}
            send={send}
            isLiveSearch={isLiveSearch}
            setIsLiveSearch={setIsLiveSearch}
            attachmentsOpen={attachmentsOpen}
            setAttachmentsOpen={setAttachmentsOpen}
            uid={uid}
          />
        </div>
      </div>
    </div>
  );
}
