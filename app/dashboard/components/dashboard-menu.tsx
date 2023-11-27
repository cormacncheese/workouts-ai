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
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { ROUTES } from '@/lib/constants/routes';
import { usePathname } from 'next/navigation';
import { FolderOpen, MessageCircle, GanttChartSquare } from 'lucide-react';
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
              href="/dashboard/trainer"
              className={cn(
                navigationMenuTriggerStyle(),
                `${pathName === ROUTES.Trainer && 'bg-muted'}`
              )}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Trainer
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              href="/dashboard/saved"
              className={cn(
                navigationMenuTriggerStyle(),
                `${pathName === ROUTES.Saved && 'bg-muted'}`
              )}
              prefetch={true}
            >
              <GanttChartSquare className="mr-2 h-4 w-4" />
              Saved Workouts
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>

        <NavigationMenuList className="flex gap-4">
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
