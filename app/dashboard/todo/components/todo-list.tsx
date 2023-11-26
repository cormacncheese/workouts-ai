'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Typography from '@/components/molecules/Typography';
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { updateTodoInUserBio } from '@/app/actions/user';
import { updateTodoInBusiness } from '@/app/actions/business';
import { TodoItem } from '@/types/custom';
import { debounce } from 'lodash';
import useUser from '@/lib/hooks/use-user';
import useBusinesses from '@/lib/hooks/use-businesses';
import { mutate } from 'swr';
import useWorkspace from '@/lib/hooks/use-workspace';

export default function TodoList() {
  const { userTodo } = useUser();
  const { businessTodo, businessId } = useBusinesses();
  const { workspace } = useWorkspace();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<string | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    if (workspace && workspace.type === 'business') {
      setTodoItems(businessTodo || []);
    } else if (workspace && workspace.type === 'personal') {
      setTodoItems(userTodo || []);
    }
  }, []);

  const handleEditTodoItem = (id: string) => {
    setEditingTodoId(id);
  };

  const handleUpdateTodoItem = (id: string, title: string) => {
    const updatedTodoItems = todoItems.map((item) =>
      item.id === id ? { ...item, title } : item
    );

    setTodoItems(updatedTodoItems);

    handleSyncTodoWithSupabase(updatedTodoItems);
  };

  const handleClose = () => {
    debouncedHandleUpdateTodoItem.flush(); // Immediately invoke the debounced function
    setIsOpen(false);
  };

  const handleSyncTodoWithSupabase = (updatedList: TodoItem[]) => {
    if (workspace && workspace.type === 'personal') {
      updateTodoInUserBio(updatedList);
      mutate('userData');
    } else if (workspace && workspace.type === 'business') {
      updateTodoInBusiness(businessId, updatedList);
      mutate(`business-data-${businessId}`);
    }
  };

  const handleAddTodoItem = () => {
    const updatedTodoItems = [
      ...todoItems,
      {
        id: `${todoItems.length + 1}`,
        title: 'Add a title',
        completed: false
      }
    ];

    console.log(updatedTodoItems);

    setTodoItems(updatedTodoItems);
    setEditingTodoId(updatedTodoItems[updatedTodoItems.length - 1].id);

    setTimeout(() => handleSyncTodoWithSupabase(updatedTodoItems), 1000);
  };

  const handleRemoveTodoItem = (id: string) => {
    const updatedTodoItems = todoItems.filter((item) => item.id !== id);
    setTodoItems(updatedTodoItems);

    handleSyncTodoWithSupabase(updatedTodoItems);
  };

  const handleToggleTodoItem = (id: string) => {
    const updatedTodoItems = todoItems.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    setTodoItems(updatedTodoItems);

    handleSyncTodoWithSupabase(updatedTodoItems);
  };

  const debouncedHandleUpdateTodoItem = debounce(handleUpdateTodoItem, 500);

  return (
    <div className="flex flex-col gap-4 py-4 w-full">
      <div className="flex flex-col overflow-y-scroll gap-4">
        {todoItems &&
          [...todoItems]
            .sort((a, b) => Number(a.completed) - Number(b.completed))
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-between flex-row gap-2 w-full items-center transition-all duration-300 ease-in-out"
                onMouseEnter={() => setActiveTodoId(item.id)}
                onMouseLeave={() => setActiveTodoId(null)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => handleToggleTodoItem(item.id)}
                  />
                  {item.id === editingTodoId ? (
                    <Input
                      defaultValue={item.title}
                      onChange={(e) => {
                        debouncedHandleUpdateTodoItem(item.id, e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          e.currentTarget.blur();
                          handleSyncTodoWithSupabase(todoItems);
                        }
                      }}
                      onBlur={() => setEditingTodoId(null)}
                      className="w-full h-8"
                    />
                  ) : (
                    <div
                      className="hover:cursor-c w-full"
                      onClick={() => handleEditTodoItem(item.id)}
                    >
                      <Typography size="sm" fontWeight="normal">
                        {item.title}
                      </Typography>
                    </div>
                  )}
                </div>
                {item.id === activeTodoId && (
                  <div
                    onClick={() => {
                      handleRemoveTodoItem(item.id);
                    }}
                    className="hover:cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
      </div>
      <Button variant="outline" onClick={handleAddTodoItem}>
        Add Item
      </Button>
    </div>
  );
}
