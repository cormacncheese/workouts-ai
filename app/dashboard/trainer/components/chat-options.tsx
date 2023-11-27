import { HistorySheet } from './history-sheet';
import { useState } from 'react';
import { Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface Props {
  handleReset: () => void;
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatOptions({ handleReset, setThreadId }: Props) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="sticky justify-end flex top-0 right-0 md:px-0 px-4 z-10">
      <div className=" flex-row gap-2 hidden md:flex">
        <Button variant="outline" onClick={handleReset}>
          <Plus className="mr-2 w-4 h-4" />
          New chat
        </Button>

        <Button variant="outline" onClick={() => setIsHistoryOpen(true)}>
          <History className="mr-2 w-4 h-4" />
          History
        </Button>
      </div>

      <HistorySheet
        setThreadId={setThreadId}
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
      />

      <div className="block md:hidden">
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
    </div>
  );
}
