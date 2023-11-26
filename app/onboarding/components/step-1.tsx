'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { updateUserFullName, updateOnboardingStep } from '@/app/actions/user';
import BottomButtons from './bottom-buttons';
import { useToast } from '@/components/ui/use-toast';
import OnboardingWrapper from './wrapper';
import HeaderText from './header-text';

type Props = {
  uid: string;
  userData: any;
  userBio: any;
  step: number;
  setStep: (step: number) => void;
};

export function OnboardingStep1({
  uid,
  userData,
  userBio,
  step,
  setStep
}: Props) {
  const { toast } = useToast();

  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (userData?.full_name) {
      setName(userData?.full_name);
    }
  }, [userData]);

  const submit = async () => {
    setLoading(true);
    // update full_name in user table
    const res = await updateUserFullName(uid, name);
    if (res) {
      updateOnboardingStep(uid, step + 1);
      setStep(step + 1);
    } else {
      toast({
        title: 'Something went wrong. Please try again.'
      });
    }
    setLoading(false);
  };

  return (
    <OnboardingWrapper>
      <HeaderText>Welcome to Zenbase. What should I call you?</HeaderText>

      <Input
        type="name"
        placeholder="Your name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      <BottomButtons
        step={step}
        setStep={setStep}
        handleSubmit={submit}
        isLoading={loading}
      />
    </OnboardingWrapper>
  );
}
