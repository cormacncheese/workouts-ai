'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { messagesAtom } from '@/utils/atoms';
import { useAtom } from 'jotai';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [messages, setMessages] = useAtom(messagesAtom);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAtoms();
    router.refresh();
  };

  const clearAtoms = () => {
    setMessages([]);
  };

  return <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>;
}
