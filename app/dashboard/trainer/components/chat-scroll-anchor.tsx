'use client';

import * as React from 'react';
import { useInView } from 'react-intersection-observer';

import { useAtBottom } from '@/lib/hooks/use-at-bottom';

interface ChatScrollAnchorProps {
  trackVisibility?: boolean;
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps) {
  const isAtBottom = useAtBottom();
  const { ref, entry, inView } = useInView({
    trackVisibility,
    delay: 100,
    rootMargin: '0px 0px -150px 0px'
  });

  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);

  React.useEffect(() => {
    if (isAtBottom) {
      setShouldAutoScroll(true);
    } else {
      setShouldAutoScroll(false);
    }
  }, [isAtBottom]);

  React.useEffect(() => {
    if (shouldAutoScroll && trackVisibility && !inView) {
      entry?.target.scrollIntoView({
        block: 'start'
      });
    }
  }, [inView, entry, shouldAutoScroll, trackVisibility]);

  return <div ref={ref} className="h-px w-full" />;
}
