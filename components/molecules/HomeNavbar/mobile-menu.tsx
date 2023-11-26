'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import GetStartedButton from '../GetStartedButton';
import { Menu, X } from 'lucide-react';
import React from 'react';
import WaitlistForm from '@/components/sections/hero/components/WaitlistForm';

export function MobileMenu() {
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
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/" legacyBehavior passHref>
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/blog" legacyBehavior passHref>
              Blog
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/manifesto">Manifesto</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/auth/signin">Login</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="w-full justify-center flex">
            <GetStartedButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
