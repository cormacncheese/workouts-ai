'use client';

import { Message } from '@/types/custom';
import { Button } from '@/components/ui/button';
import { Check, Copy, Bookmark, BookmarkCheck } from 'lucide-react';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { addToSaved } from '@/app/actions/chat';
import { useToast } from '@/components/ui/use-toast';
import { SavedLabelDialog } from './saved-label-dialog';

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message;
  uid: string;
  threadId?: string | null;
  businessId?: string | null;
  workspace?: any;
}

export function ChatMessageActions({
  message,
  className,
  uid,
  threadId,
  businessId,
  workspace,
  ...props
}: ChatMessageActionsProps) {
  const { toast } = useToast();

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const [label, setLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  const handleSave = async () => {
    if (isSaving || isSaved) return;

    setIsSaving(true);
    const res = await addToSaved({
      label: label,
      content: message.content,
      thread_id: threadId || '',
      uid: uid,
      business_id: businessId,
      workspace_type: workspace?.type || 'unknown'
    });

    if (res) {
      setIsSaved(true);
      toast({
        title: 'Saved!'
      });
    } else {
      toast({
        title: 'Error saving'
      });
    }

    setIsLabelOpen(false);
    setIsSaving(false);
  };

  return (
    <div
      className={cn(
        'md:flex flex-col hidden items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0 ',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy}>
        {isCopied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className=" w-4 h-4text-muted" />
        )}
        <span className="sr-only">Copy message</span>
      </Button>

      {message.role === 'assistant' && (
        <SavedLabelDialog
          isSaved={isSaved}
          handleSave={handleSave}
          setLabel={setLabel}
          label={label}
          isSaving={isSaving}
          isLabelOpen={isLabelOpen}
          setIsLabelOpen={setIsLabelOpen}
        />
      )}
    </div>
  );
}
