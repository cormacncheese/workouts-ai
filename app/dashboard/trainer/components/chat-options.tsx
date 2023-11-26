import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { HistorySheet } from './history-sheet';
import { useState } from 'react';
import { Plus, History } from 'lucide-react';

interface Props {
  handleReset: () => void;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatOptions({ handleReset, setThreadId }: Props) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="sticky justify-end flex top-0 right-0 md:px-0 px-4 z-10">
      <HistorySheet
        setThreadId={setThreadId}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="md:w-40 flex justify-end outline-none">
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            onClick={handleReset}
            className="hover:cursor-pointer"
          >
            <Plus className="mr-2 w-4 h-4" />
            New chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsHistoryOpen(true)}
            className="hover:cursor-pointer"
          >
            <History className="mr-2 w-4 h-4" />
            History
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
