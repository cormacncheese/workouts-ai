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
  Lightbulb,
  LifeBuoy,
  Puzzle,
  FolderOpen,
  Settings,
  Bookmark
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
        <Button variant="outline">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <MessageCircle className="mr-2 h-4 w-4" />
            <Link href="/dashboard/trainer" prefetch passHref legacyBehavior>
              Chat
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            <Link href="/dashboard/files" prefetch passHref legacyBehavior>
              Files
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Puzzle className="mr-2 h-4 w-4" />
            <Link
              href="/dashboard/integrations"
              prefetch
              passHref
              legacyBehavior
            >
              Integrations
            </Link>
          </DropdownMenuItem>

          {/* <DropdownMenuItem>
            <ListTodo className="mr-2 h-4 w-4" />
            <Link href="/dashboard/todo" prefetch passHref legacyBehavior>
              Todo
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <Link href="/dashboard/settings/profile">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Bookmark className="mr-2 h-4 w-4" />
          <Link href="/dashboard/settings/saved">Saved</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            window.open('https://discord.gg/mn9Pfb5cWx', '_blank');
          }}
        >
          <LifeBuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
