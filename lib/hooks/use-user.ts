'use client';

import { getUserId, getCurrentUserData } from '@/app/actions/user';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAvatarAtom } from '@/utils/atoms';
import useSWR from 'swr';

export default function useUser() {
  const [avatar, setAvatar] = useAtom(userAvatarAtom);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [userData, setUserData] = useState<any>({});
  const [userBio, setUserBio] = useState<any>({});
  const [userTodo, setUserTodo] = useState<any[]>([]);

  const { data: uid, error: uidError } = useSWR('uid', getUserId);
  const { data: currentUserData, error: userDataError } = useSWR(
    'userData',
    getCurrentUserData
  );

  useEffect(() => {
    setUserData(currentUserData);
    setAvatar(currentUserData?.avatar_url || '');
    setHasOnboarded(currentUserData?.has_onboarded || false);
    setOnboardingStep(currentUserData?.onboarding_step || 0);
    setUserBio(currentUserData?.bio || {});
    setUserTodo(currentUserData?.todo || []);
  }, [currentUserData, uid]);

  return {
    uid: uid || '',
    avatar: avatar,
    hasOnboarded: hasOnboarded,
    onboardingStep: onboardingStep,
    userData: userData,
    userBio: userBio,
    userTodo: userData?.todo || []
  };
}
