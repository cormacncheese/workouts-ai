'use client'

import React, {useEffect} from 'react'

import { cn } from '@/lib/utils'
import { useAtBottom } from '@/lib/hooks/use-at-bottom'
import { Button, type ButtonProps } from '@/components/ui/button'
import { ArrowDown, ArrowUp } from 'lucide-react'

interface Props extends ButtonProps {
  chatRef: HTMLDivElement | null;
}

export function ButtonScrollToBottom({ className, chatRef, ...props }: Props) {
  const offset = 100; 

  const [isAtBottom, setIsAtBottom] = React.useState(false);
  const [isAtTop, setIsAtTop] = React.useState(false);
  const [isAboveWindowHeight, setIsAboveWindowHeight] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!chatRef || !chatRef) return;
      const { scrollHeight, scrollTop, clientHeight } = chatRef;

      setIsAboveWindowHeight(scrollHeight > window.innerHeight);
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + offset);      
      setIsAtTop(scrollTop < scrollHeight - 2000); 
    };

    if (chatRef) {
      chatRef.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (chatRef && chatRef) {
        chatRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [chatRef, offset]);

  const handleClick = () => {
    if (isAtTop && chatRef) {
      chatRef.scroll({ top: chatRef.scrollHeight, behavior: 'smooth' });
    }
    
    // else if (isAtBottom && chatRef) {
    //    chatRef.scroll({ top: 0, behavior: 'smooth' });
    // }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'absolute md:right-4 right-2 md:top-2 -top-11 z-10 bg-background transition-opacity duration-300 sm:right-8 ',
        ((!isAtTop) || !isAboveWindowHeight) ? 'opacity-0' : 'opacity-100',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {isAtTop && <ArrowDown />} 
      
      {/* {isAtBottom && <ArrowUp />} */}

      <span className="sr-only">
        {isAtTop && 'Scroll to bottom'}
        {isAtBottom && 'Scroll to top'}
     </span>
    </Button>
  )
}