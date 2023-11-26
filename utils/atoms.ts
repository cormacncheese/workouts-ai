import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Message, Workspace } from '@/types/custom';

export const pathHeaderAtom = atom('Dashboard');

export const currentIntegrationIdAtom = atom<string | null>(null);

export const messagesAtom = atomWithStorage<Message[]>('messages', []);

export const userAvatarAtom = atomWithStorage<string>('userAvatar', '');

export const isOpenHistoryAtom = atomWithStorage<boolean>(
  'isOpenHistory',
  false
);

export const selectedBusinessIdAtom = atomWithStorage<string | null>(
  'selectedBusinessId',
  null
);

export const activeWorkspaceAtom = atomWithStorage<Workspace | null>(
  'activeWorksapce',
  null
);
