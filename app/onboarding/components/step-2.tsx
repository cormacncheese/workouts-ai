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
  userData: any;
  userBio: any;
  step: number;
  setStep: (step: number) => void;
};

export function OnboardingStep2({
  uid,
  userData,
  userBio,
  step,
  setStep
}: Props) {
  const { toast } = useToast();

  const [bio, setBio] = React.useState<any>({
    fitness_goals: '',
    workout_location: '',
    workout_frequency: '',
    workout_duration: '',
    workout_experience: '',
    workout_intensity: ''
  });
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (userBio?.bio) {
      setBio(userBio?.bio);
    }
  }, [userBio]);

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
      <HeaderText>What are your fitness goals</HeaderText>
      <SubHeaderText>
        Growing muscles, getting lean, losing weight, etc.
      </SubHeaderText>

      <Textarea
        placeholder="Growing my chest and back muscles"
        value={bio?.fitness_goals}
        onChange={(e) => {
          setBio({ ...bio, fitness_goals: e.target.value });
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
