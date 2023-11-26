'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import WaitlistForm from '@/components/sections/hero/components/WaitlistForm';
import cn from 'classnames';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HomeMenu() {
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
      <NavigationMenu className="flex flex-row w-full justify-between">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/manifesto" className={navigationMenuTriggerStyle()}>
              Manifesto
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/blog" className={navigationMenuTriggerStyle()}>
              Blog
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>

        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/auth/signin" className={navigationMenuTriggerStyle()}>
              Login
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuItem className="ml-2">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.5 }}>
                <Link
                  href="/auth/signin"
                  className={cn(
                    'bg-primary text-primary-foreground dark:text-secondary hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                  )}
                >
                  <Button>Get Started for Free</Button>
                </Link>
              </motion.div>
            </NavigationMenuItem>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
}
