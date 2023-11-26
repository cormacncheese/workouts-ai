'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import React, { useEffect, useState } from 'react';
import { updateTodoInUserBio } from '@/app/actions/user';
import { TodoItem } from '@/types/custom';
import { debounce } from 'lodash';
import TodoList from '@/app/dashboard/todo/components/todo-list';
import useWorkspace from '@/lib/hooks/use-workspace';

interface Props {
  trigger: React.ReactNode;
}

export function TodoSheet({ trigger }: Props) {
  const { workspace } = useWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  const handleUpdateTodoItem = (id: string, title: string) => {
    const updatedTodoItems = todoItems.map((item) =>
      item.id === id ? { ...item, title } : item
    );

    setTodoItems(updatedTodoItems);

    handleSyncTodoWithSupabase(updatedTodoItems);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    debouncedHandleUpdateTodoItem.flush(); // Immediately invoke the debounced function
    setIsOpen(false);
  };

  const handleSyncTodoWithSupabase = (updatedList: TodoItem[]) => {
    updateTodoInUserBio(updatedList);
  };

  const debouncedHandleUpdateTodoItem = debounce(handleUpdateTodoItem, 500);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{workspace && workspace.name} todo list</SheetTitle>
          <SheetDescription>
            Add and remove items from here for your assistant to keep track of.
          </SheetDescription>
        </SheetHeader>
        <TodoList />
      </SheetContent>
    </Sheet>
  );
}
