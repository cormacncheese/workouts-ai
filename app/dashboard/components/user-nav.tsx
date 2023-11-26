'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import SignOutButton from './SignOutButton';
import { getCurrentUserData } from '@/app/actions/user';
import { useState } from 'react';
import { Database } from '@/types/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import Link from 'next/link';
import { Settings, Bookmark } from 'lucide-react';

interface Props {
  user: User;
}

export function UserNav({ user }: Props) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  const fetchUserData = async () => {
    const userData = (await getCurrentUserData()) as Database['public']['Tables']['users']['Row'];
    setName(userData.full_name || '');
    setAvatar(userData.avatar_url || '');
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt="maia pfp" />
            <AvatarFallback>{name.charAt(0) || 'M'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 hover:cursor-pointer"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {/* @ts-ignore */}
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup> */}
        <DropdownMenuItem className="hover:cursor-pointer">
          <Link
            href="/dashboard/settings/profile"
            className="flex flex-row items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>

          {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:cursor-pointer">
          <Link
            href="/dashboard/settings/saved"
            className="flex flex-row items-center"
          >
            <Bookmark className="mr-2 h-4 w-4" />
            Saved
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="hover:cursor-pointer">
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        {/* <DropdownMenuItem className="hover:cursor-pointer">
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        {/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
        {/* </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
