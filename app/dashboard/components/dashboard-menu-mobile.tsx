'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  MessageCircle,
  GanttChartSquare,
  LifeBuoy,
  Settings,
  Bookmark,
  User
} from 'lucide-react';
import React from 'react';
import SignOutButton from './SignOutButton';

export function DashboardMobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenu
      onOpenChange={() => {
        setIsOpen(!isOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 " align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <MessageCircle className="mr-2 h-4 w-4" />
            <Link href="/dashboard/trainer" prefetch passHref legacyBehavior>
              Trainer
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <GanttChartSquare className="mr-2 h-4 w-4" />
            <Link href="/dashboard/saved" prefetch passHref legacyBehavior>
              Saved Workouts
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <Link href="/dashboard/settings/profile">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <Link href="/dashboard/settings/preferences">Preferences</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
