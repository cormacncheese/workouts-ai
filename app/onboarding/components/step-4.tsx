'use client';

import React, { useEffect } from 'react';
import { updateOnboardingStep } from '@/app/actions/user';
import BottomButtons from './bottom-buttons';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { saveUserBio } from '@/app/actions/user';
import Typography from '@/components/molecules/Typography';
import OnboardingWrapper from './wrapper';
import HeaderText from './header-text';
import SubHeaderText from './sub-header-text';

type Props = {
  uid: string;
  bio: any;
  setBio: (bio: any) => void;
  step: number;
  setStep: (step: number) => void;
};

export function OnboardingStep4({ uid, bio, setBio, step, setStep }: Props) {
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await saveUserBio(bio);

      if (res) {
        updateOnboardingStep(uid, step + 1);
        setStep(step + 1);
      } else {
        throw new Error('Error saving bio');
      }
    } catch (e) {
      toast({
        title: 'Something went wrong. Please try again.'
      });
    }
    setLoading(false);
  };

  return (
    <OnboardingWrapper>
      <HeaderText>What's your workout schedule.</HeaderText>
      <SubHeaderText>
        Enter what muscles you workout each day. Example: Monday: legs, Tuesday:
        Chest/Triceps, etc.
      </SubHeaderText>

      <Textarea
        placeholder="Monday: legs, Tuesday:  Chest/Triceps, Wednesday: Back/Biceps, Thursday: Shoulders, Friday: Legs, Saturday: Chest/Triceps, Sunday: Back/Biceps"
        value={bio?.workout_frequency}
        onChange={(e) => {
          setBio({ ...bio, workout_frequency: e.target.value });
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
