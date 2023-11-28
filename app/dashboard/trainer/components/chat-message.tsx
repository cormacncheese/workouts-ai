import { Message } from '@/types/custom';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { cn } from '@/lib/utils';
import { MemoizedReactMarkdown } from '@/components/markdown';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import PulseLoader from '@/components/molecules/PulseLoader';
import { ChatMessageActions } from './chat-message-actions';
import useUser from '@/lib/hooks/use-user';
import Typography from '@/components/molecules/Typography';

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
      className={cn('group relative mb-12 flex items-start md:-ml-12')}
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
                'prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-primary  md:text-lg text-sm',
                {
                  '!text-primaryMuted mr-2': message.role === 'user'
                }
              )}
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return (
                    <Typography
                      size="base"
                      fontWeight="normal"
                      className={cn({
                        '!text-primaryMuted-foreground mr-2':
                          message.role === 'user'
                      })}
                    >
                      {children}
                    </Typography>
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
