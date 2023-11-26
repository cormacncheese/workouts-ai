'use client';

import { getUserId } from '@/app/actions/user';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { activeWorkspaceAtom } from '@/utils/atoms';
import useSWR from 'swr';

export default function useUser() {
  const { data: uid } = useSWR('uid', getUserId);

  const [workspace, setWorkspace] = useAtom(activeWorkspaceAtom);

  useEffect(() => {
    if (uid && !workspace) {
      setWorkspace({
        id: uid,
        name: 'Personal',
        type: 'personal'
      });
    }
  }, [uid]);

  return {
    workspaceId: workspace?.id || '',
    workspace: workspace,
    setWorkspace: setWorkspace
  };
}
