'use client';

import ChatAndMessages from './components/chat-messages';
import { useRef, useEffect, useState } from 'react';

export default function Assistant() {
  const [chatRef, setChatRef] = useState(null);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      setChatRef(chatContainerRef.current);
    }
  }, [chatContainerRef]);

  return (
    <div
      className="relative bg-backgroundMuted h-full overflow-y-scroll"
      ref={chatContainerRef}
    >
      <ChatAndMessages chatRef={chatRef} />
    </div>
  );
}
