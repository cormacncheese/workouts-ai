import { Message } from '@/types/custom';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/codeblock';
import { MemoizedReactMarkdown } from '@/components/markdown';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import PulseLoader from '@/components/molecules/PulseLoader';
// import { IconOpenAI, IconUser } from '@/components/ui/icons';
import { ChatMessageActions } from './chat-message-actions';
import useUser from '@/lib/hooks/use-user';

const ChatAvatar =
  'https://dorrdxizajloclrfhcth.supabase.co/storage/v1/object/public/web/logo/workouts-ai-pfp.png';

export interface ChatMessageProps {
  message: Message;
  isLoading: boolean;
  index?: number;
  messagesLength: number;
  uid: string;
  threadId?: string | null;
  businessId?: string | null;
  workspace?: any;
}

export function ChatMessage({
  message,
  isLoading,
  index,
  messagesLength,
  uid,
  threadId,
  businessId,
  workspace,
  ...props
}: ChatMessageProps) {
  const { avatar } = useUser();

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12 ', {
        'flex-row-reverse': message.role === 'user'
      })}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow',
          message.role === 'user'
            ? 'bg-background '
            : 'bg-primary text-primaryMuted'
        )}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={message.role === 'user' ? avatar : ChatAvatar}
            alt="chat avatar"
          />
          {/* <AvatarFallback>{name.charAt(0) || 'M'}</AvatarFallback> */}
        </Avatar>
      </div>
      <div className="flex-1 px-1 md:ml-4 ml-2 space-y-2 overflow-hidden">
        {(index === messagesLength - 1 || !messagesLength) &&
        isLoading &&
        message.content?.length < 5 ? (
          <>
            <PulseLoader height="h-8" width="w-8" />
          </>
        ) : (
          <>
            <MemoizedReactMarkdown
              className={cn(
                'prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-primaryMuted md:text-lg text-sm',
                {
                  'text-right text-primaryMuted-foreground mr-2':
                    message.role === 'user'
                }
              )}
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return <p className="md:text-lg text-sm">{children}</p>;
                },
                // @ts-ignore
                code({ node, inline, className, children, ...props }) {
                  if (Array.isArray(children) && children.length > 0) {
                    if (children[0] === '▍') {
                      return (
                        <span className="mt-1 cursor-default animate-pulse">
                          ▍
                        </span>
                      );
                    }

                    if (
                      Array.isArray(children) &&
                      typeof children[0] === 'string'
                    ) {
                      children[0] = children[0].replace('`▍`', '▍');
                    }
                  }

                  const match = /language-(\w+)/.exec(className || '');

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ''}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  );
                }
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
            <ChatMessageActions
              message={message}
              threadId={threadId}
              uid={uid}
              businessId={businessId}
              workspace={workspace}
            />
          </>
        )}
      </div>
    </div>
  );
}
