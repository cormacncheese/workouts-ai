'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { getUserChatHistory } from '@/app/actions/chat';
import React, { useEffect, useState } from 'react';
import { ChatHistory, ThreadWithMessages } from '@/types/custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  setThreadId: React.Dispatch<React.SetStateAction<string | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function HistorySheet({ setThreadId, isOpen, setIsOpen }: Props) {
  const [history, setHistory] = useState<ChatHistory[] | null>(null);
  const [page, setPage] = useState(1); // Add a state for the current page
  const [searchTerm, setSearchTerm] = useState(''); // Add a state for the search term

  useEffect(() => {
    const fetchHistory = async () => {
      const userHistory = (await getUserChatHistory(page, 10)) as ChatHistory[]; // Fetch data for the current page

      setHistory((prevHistory) => [...(prevHistory || []), ...userHistory]);
    };

    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, page]); // Add page as a dependency

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term when the input changes
  };

  const filteredHistory = history?.filter((thread: ThreadWithMessages) =>
    thread.messages.some((message) =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number when load more is clicked
  };

  const handleThreadClick = (id: string) => {
    setThreadId(id);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chat history</SheetTitle>
          <SheetDescription>
            Select a previous conversation to open it.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4 ">
          {/* <Label>Search</Label> */}
          <Input
            placeholder="Search for a conversation"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <div className="flex flex-col gap-2 overflow-y-scroll h-[85vh]">
            {filteredHistory &&
              filteredHistory.length > 0 &&
              filteredHistory.map((thread: ThreadWithMessages) => (
                <div key={thread.id}>
                  {thread.messages[0]?.content && (
                    <div
                      className="border-b border-muted py-4 px-4 hover:cursor-pointer hover:opacity-70"
                      onClick={(e) => {
                        handleThreadClick(thread.id);
                      }}
                    >
                      <div className="flex flex-row justify-between">
                        <p className="text-sm font-medium overflow-ellipsis overflow-hidden h-10 w-40">
                          {thread.messages[0]?.content}
                        </p>
                        <p className="text-xs text-muted text-right">
                          {formatDistanceToNow(
                            new Date(thread.messages[0]?.created_at),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                      {thread.messages.slice(1, 4).map((message, index) => (
                        <p
                          key={index}
                          className="text-xs text-muted-foreground overflow-ellipsis overflow-hidden h-8"
                        >
                          {message?.content}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            <Button variant="outline" onClick={handleLoadMore}>
              Load more
            </Button>
          </div>
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
