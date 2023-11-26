'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { useAtom } from 'jotai';
import {
  activeWorkspaceAtom,
  messagesAtom,
  selectedBusinessIdAtom
} from '@/utils/atoms';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();

  const [, setMessages] = useAtom(messagesAtom);
  const [, setActiveWorkspace] = useAtom(activeWorkspaceAtom);
  const [, setSelectedBusinessId] = useAtom(selectedBusinessIdAtom);

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    // Clear all atoms
    setMessages([]);
    setActiveWorkspace(null);
    setSelectedBusinessId(null);

    router.refresh();
    router.push('/');
  };
  return (
    <DropdownMenuItem onClick={handleSignOut} className="hover:cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  );
}
