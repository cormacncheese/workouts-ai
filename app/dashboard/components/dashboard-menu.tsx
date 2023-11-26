'use client';

import React from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { UserNav } from '@/app/dashboard/components/user-nav';
import cn from 'classnames';
import { TodoSheet } from './todo-sheet';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { ROUTES } from '@/lib/constants/routes';
import { usePathname } from 'next/navigation';
import WorkspaceDropdown from './workspace-dropdown';
import PaywallWithButton from './paywall-with-button';
import {
  FolderOpen,
  MessageCircle,
  Puzzle,
  ListTodo,
  Lightbulb
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  user: any;
}

export default function DashboardMenu({ user }: Props) {
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // This is a side effect that runs after the first render and sets the isMounted state to true
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // This is a conditional rendering that returns null if the component is not mounted yet
  if (!isMounted) {
    return null;
  } else {
    return (
      <NavigationMenu className="flex flex-row justify-between w-full ">
        <NavigationMenuList className="flex flex-row gap-8 ">
          <NavigationMenuItem>
            <Link
              href="/dashboard/assistant"
              className={cn(
                navigationMenuTriggerStyle(),
                `${pathName === ROUTES.Assistant && 'bg-muted'}`
              )}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/dashboard/files"
              className={cn(
                navigationMenuTriggerStyle(),
                `${pathName === ROUTES.Files && 'bg-muted'}`
              )}
              prefetch={true}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Files
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/dashboard/integrations"
              className={cn(
                navigationMenuTriggerStyle(),
                `${pathName === ROUTES.Integrations && 'bg-muted'}`
              )}
              prefetch={true}
            >
              <Puzzle className="mr-2 h-4 w-4" />
              Integrations
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/dashboard/train"
              className={cn(
                navigationMenuTriggerStyle(),
                `${pathName === ROUTES.Files && 'bg-muted'}`
              )}
              prefetch={true}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Train
            </Link>
          </NavigationMenuItem>
          {/* <TodoSheet
          trigger={
            <NavigationMenuItem className="hover:cursor-pointer md:flex hidden">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <ListTodo className="mr-2 h-4 w-4" />
                Todo
              </NavigationMenuLink>
            </NavigationMenuItem>
          }
        /> */}
        </NavigationMenuList>

        <NavigationMenuList className="flex gap-4">
          <PaywallWithButton />

          <NavigationMenuItem>
            <WorkspaceDropdown />
          </NavigationMenuItem>
          {user && (
            <NavigationMenuItem>
              <UserNav user={user} />
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
}
