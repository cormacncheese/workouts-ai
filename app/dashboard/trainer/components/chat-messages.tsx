'use client';

import { useState, useEffect } from 'react';
import { getThreadMessages } from '@/app/actions/chat';
import { Database } from '@/types/supabase';
import { Message, SuggestedPrompt } from '@/types/custom';
import {
  createNewThread,
  addMessageToThread,
  removeMessage
} from '@/app/actions/chat';
import { useToast } from '@/components/ui/use-toast';
import { getUserChatHistory } from '@/app/actions/chat';
import useUser from '@/lib/hooks/use-user';
import { ChatList } from './chat-list';
import { ChatScrollAnchor } from './chat-scroll-anchor';
import { ChatPanel } from './chat-panel';
import cn from 'classnames';
import React from 'react';
import { messagesAtom } from '@/utils/atoms';
import { useAtom } from 'jotai';
import ChatOptions from './chat-options';
import { isWithinTokenLimit } from '@/utils/token-counter';
import TokenLimitAlert from './token-limit-alert';

interface Props {
  chatRef: HTMLDivElement | null;
}

export default function ChatAndMessages({ chatRef }: Props) {
  const { toast } = useToast();
  const { uid, userData } = useUser();

  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [isShowThread, setIsShowThread] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<
    SuggestedPrompt[] | []
  >([]);
  const [abortController, setAbortController] = useState<AbortController>();
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isOpenTokenLimitAlert, setIsOpenTokenLimitAlert] = useState(false);
  const [isLiveSearch, setIsLiveSearch] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  // on load - determine if need to fetch intro message
  useEffect(() => {
    determineMessages();
  }, []);

  // fetch messages from thread
  useEffect(() => {
    if (threadId) {
      fetchThreadMessages(threadId);
    }
  }, [threadId]);

  const determineMessages = async () => {
    // get history
    const history = await getUserChatHistory(1, 1);

    const mostRecentThreadTime = history
      ? new Date(history[0]?.created_at)
      : new Date();

    const now = new Date();

    const timeDiff = now.getTime() - mostRecentThreadTime.getTime();

    // check if the day of now isn't the same day as mostRecentThreadTime
    const isSameDay =
      now.getDate() === mostRecentThreadTime.getDate() &&
      now.getMonth() === mostRecentThreadTime.getMonth() &&
      now.getFullYear() === mostRecentThreadTime.getFullYear();

    // check if last message was sent more than an hour ago
    // if no history, create new thread
    if (
      !history ||
      history.length === 0 ||
      history[0].messages[0].content.length < 20
    ) {
      handleReset();
      return;
      // if the last message was sent > 8 hours ago, create new thread
    } else if (!isSameDay) {
      // fetch new if it's been a while
      handleReset();
    } else {
      // else set the messages and threadId from history
      setMessages(history[0].messages);
      setThreadId(history[0].id);

      // if (messages.length < 2) {
      //   fetchSuggestedPrompts();
      // }

      setIsShowThread(true);
      setIsLoading(false);
    }

    return;
  };

  const handleReset = () => {
    handleStop();
    setMessages([]);
    setSuggestedPrompts([]);
    setThreadId(null);

    fetchNewIntro();
  };

  const fetchNewIntro = async () => {
    setIsLoading(true);

    let fullNewMessage = '';

    // AI filler message – used to init loading state
    const aiResponseMessage: Message = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      uid: uid,
      thread_id: threadId || '',
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString()
    };

    setMessages((prevMessages) => [...prevMessages, aiResponseMessage]);

    console.log('before');

    const response = await fetch('/api/chat/create-intro-message', {
      method: 'POST',
      body: JSON.stringify({
        user_name: userData.full_name
      })
    }).catch((err) => {
      console.log('fetchNewIntro err: ', err);
      toast({
        title: 'Something went wrong. Please try again.'
      });
      return;
    });

    console.log('INTRO response: ', response);

    const textDecoder = new TextDecoder();
    const reader = response?.body?.getReader();

    let chunk = await reader?.read();

    const chunkContent = textDecoder.decode(chunk?.value);

    fullNewMessage += chunkContent;

    // finish reading the response
    while (!chunk?.done) {
      chunk = await reader?.read();
      const chunkContent = textDecoder.decode(chunk?.value);
      fullNewMessage += chunkContent;

      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].content = fullNewMessage;
        }
        return newMessages;
      });
    }

    console.log('INTRO fullNewMessage: ', fullNewMessage);

    try {
      if (fullNewMessage) {
        // create a new thread and save the message, then set the threadId
        const threadResult = await createNewThread();

        if (!threadResult) {
          toast({
            title: 'Something went wrong. Please try again.'
          });
          return;
        }

        const thread = threadResult as Database['public']['Tables']['threads']['Row'];

        const threadId_ = thread.id;

        setThreadId(threadId_);

        const queryData = await addMessageToThread(
          threadId_,
          fullNewMessage,
          'assistant'
        );

        if (!queryData) {
          // toast({
          //   title: 'Something went wrong. Please try again.'
          // });
          return;
        }

        // replace fullNewMessage with queryData
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = queryData;
          return newMessages;
        });
      }
    } catch (e) {
      toast({
        title: 'Something went wrong. Please try again.'
      });
    }

    setIsLoading(false);
  };

  const fetchThreadMessages = async (threadId: string) => {
    const messages = await getThreadMessages(threadId);
    setMessages(messages);
  };

  const fetchSuggestedPrompts = async () => {
    const response = await fetch('/api/chat/get-suggested-prompts', {
      method: 'POST',
      body: JSON.stringify({
        history: messages
      })
    }).catch((err) => {
      console.log('fetchSuggestedPrompts err: ', err);
      toast({
        title: 'Something went wrong. Please try again.'
      });
      return;
    });

    if (!response) return;

    function parsePrompts(str: string) {
      const regex = /Title: "(.+)"\s+Prompt: "(.+)"/g;
      // @ts-ignore
      const matches = [...str.matchAll(regex)];
      return matches.map((match) => ({ title: match[1], prompt: match[2] }));
    }

    const data = await response.json();
    const reply = data.response;

    console.log('parsing prompts: ', reply);

    const prompts = JSON.parse(reply);

    if (prompts) {
      setSuggestedPrompts(prompts);
    }

    return;
  };

  const handleSend = async (query_?: string) => {
    setSuggestedPrompts([]);
    setIsLoading(true);

    const userMessage = query_ || query;

    setQuery('');

    // first check token amount
    const isWithinLimit = await isWithinTokenLimit({ text: userMessage });
    if (!isWithinLimit) {
      setIsOpenTokenLimitAlert(true);
      return false;
    }

    let threadId_ = threadId;

    const fillerUserMessage: Message = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      uid: uid,
      thread_id: threadId || '',
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };

    setMessages((prevMessages) => [...prevMessages, fillerUserMessage]);

    // AI filler message
    const aiResponseMessage: Message = {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      uid: uid,
      thread_id: threadId || '',
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString()
    };

    setMessages((prevMessages) => [...prevMessages, aiResponseMessage]);

    // for simplicity, save message to databae first
    let queryData: any;
    // save query to existing thread
    if (threadId_) {
      queryData = await addMessageToThread(threadId_, userMessage, 'user');
    } else {
      // create a new thread and save the message, then set the threadId
      const threadResult = await createNewThread();

      if (!threadResult) {
        toast({
          title: 'Something went wrong. Please try again.'
        });
        setIsLoading(false);
        return;
      }

      const thread = threadResult as Database['public']['Tables']['threads']['Row'];

      threadId_ = thread.id;
      setThreadId(threadId_);

      queryData = await addMessageToThread(threadId_, userMessage, 'user');
    }

    // then replace the filler user message with the saved message
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages[newMessages.length - 2] = queryData;
      return newMessages;
    });

    let fullNewMessage = '';

    // create instance of AbortController to handle stream cancellation
    const abortController_ = new AbortController();
    setAbortController(abortController_);
    const { signal } = abortController_;

    const minifiedUserData = {
      uid: uid,
      full_name: userData.full_name,
      bio: userData.bio
    };

    try {
      const response = await fetch('/api/chat/send-message', {
        method: 'POST',
        body: JSON.stringify({
          query: userMessage,
          user_data: minifiedUserData,
          history: messages,
          is_live_search: isLiveSearch
        }),
        signal
      });

      if (response?.status === 400) {
        const object = await response.json();
        const err = object.error;
        toast({
          title: err
        });
        handleResetFailedSend();
        return;
      }

      const textDecoder = new TextDecoder();
      const reader = response?.body?.getReader();

      let chunk = await reader?.read();
      const chunkContent = textDecoder.decode(chunk?.value);

      fullNewMessage += chunkContent;

      // finish reading the response
      while (!chunk?.done) {
        chunk = await reader?.read();
        const chunkContent = textDecoder.decode(chunk?.value);
        aiResponseMessage.content += chunkContent;
        fullNewMessage += chunkContent;

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content = fullNewMessage;
          return newMessages;
        });
      }
    } catch (err) {
      if ((err as Error).message !== 'BodyStreamBuffer was aborted') {
        // remove the last message
        handleResetFailedSend();
        removeMessage(queryData.id);
        setIsLoading(false);
        toast({
          title: 'Something went wrong. Please try again.'
        });
        return; // early return on error
      }
    }

    // fetchSuggestedPrompts();

    try {
      if (!fullNewMessage) {
        throw new Error('No reply from the server');
      }

      // save the message to the database
      const saveResult = await addMessageToThread(
        threadId_,
        fullNewMessage,
        'assistant'
      );

      // update messages with the saved message
      if (saveResult) {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = saveResult;
          return newMessages;
        });
      }
    } catch (e) {
      // remove the last message
      handleResetFailedSend();
      toast({
        title: 'Something went wrong. Please try again.'
      });
    }

    setIsLoading(false);
  };

  const handleStop = () => {
    abortController?.abort();
  };

  const handleGenerateNewWorkout = () => {
    handleSend('Generate new workout for today');
  };

  // TODO - regenerate
  const reload = async () => {
    // console.log('reload');
  };

  const handleResetFailedSend = () => {
    setMessages((prevMessages) => prevMessages.slice(0, -2));
  };

  return (
    <>
      <TokenLimitAlert
        isOpen={isOpenTokenLimitAlert}
        setIsOpen={setIsOpenTokenLimitAlert}
      />

      <div className={cn('md:pb-[200px] pb-[140px] relative')}>
        <ChatOptions handleReset={handleReset} setThreadId={setThreadId} />

        <div>
          <div className="pt-0">
            <ChatList
              setOpenAttachments={setAttachmentsOpen}
              messages={messages}
              isLoading={isLoading}
              uid={uid || ''}
              threadId={threadId}
              handleGenerateNewWorkout={handleGenerateNewWorkout}
            />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </div>
        </div>

        {/* <EmptyScreen
            setInput={setQuery}
            messages={messages}
            suggestedPrompts={suggestedPrompts}
            isLoading={isLoading}
          /> */}
      </div>

      <ChatPanel
        isLoading={isLoading}
        chatRef={chatRef}
        stop={handleStop}
        reload={reload}
        messages={messages}
        query={query}
        setQuery={setQuery}
        setIsLoading={setIsLoading}
        threadId={threadId}
        setThreadId={setThreadId}
        setMessages={setMessages}
        send={handleSend}
        promptSuggestions={suggestedPrompts}
        isLiveSearch={isLiveSearch}
        setIsLiveSearch={setIsLiveSearch}
        attachmentsOpen={attachmentsOpen}
        setAttachmentsOpen={setAttachmentsOpen}
        uid={uid || null}
      />
    </>
  );
}
