import { Message, SuggestedPrompt } from '@/types/custom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PulseLoader from '@/components/molecules/PulseLoader';

interface Props {
  messages: Message[];
  setInput: React.Dispatch<React.SetStateAction<string>>;
  suggestedPrompts: SuggestedPrompt[] | [];
  isLoading: boolean;
}

export function EmptyScreen({
  messages,
  setInput,
  suggestedPrompts,
  isLoading
}: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome back Cormac!</h1>

        {isLoading &&
        (!messages[0]?.content || messages[0]?.content.length < 15) ? (
          <PulseLoader height="h-10" width="w-10" />
        ) : (
          <p className="mb-2 leading-normal text-muted-foreground">
            {messages && messages[0]?.content}
          </p>
        )}

        <div className="mt-4 flex flex-col items-start space-y-2">
          <>
            {suggestedPrompts.length > 0 ? (
              <>
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="link"
                    className="h-auto p-0 text-base"
                    onClick={() => setInput(prompt.prompt)}
                  >
                    <ArrowRight className="mr-2 text-muted-foreground" />
                    {prompt.title}
                  </Button>
                ))}
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
