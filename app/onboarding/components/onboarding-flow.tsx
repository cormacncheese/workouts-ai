'use client';

import React, { useEffect } from 'react';
import { ONBOARDING_STEPS } from '../constants';
import { updateOnboardingStatus } from '@/app/actions/user';
import { LoadingSpace } from './loading-space';
import { useRouter } from 'next/navigation';
import useUser from '@/lib/hooks/use-user';
import { Progress } from '@/components/ui/progress';

export default function OnboardingFlow() {
  const router = useRouter();
  const { uid, onboardingStep, userData, userBio } = useUser();

  const [step, setStep] = React.useState(onboardingStep);
  const [bio, setBio] = React.useState<any>({
    fitness_goals: '',
    workout_location: '',
    workout_frequency: '',
    workout_experience: '',
    workout_intensity: ''
  });

  useEffect(() => {
    if (onboardingStep === ONBOARDING_STEPS.length) {
      router.push('/dashboard/trainer');
    }
    setStep(onboardingStep);
  }, [onboardingStep]);

  const CurrentStep = ONBOARDING_STEPS[step];

  useEffect(() => {
    if (step === ONBOARDING_STEPS.length) {
      updateOnboardingStatus(uid, true);
    }
  }, [step]);

  useEffect(() => {
    if (userBio?.bio) {
      setBio(userBio?.bio);
    }
  }, [userBio]);

  return (
    <div className="w-full flex justify-center">
      {step === ONBOARDING_STEPS.length ? (
        <LoadingSpace />
      ) : (
        <div className="flex flex-col gap-8">
          <Progress
            className="h-2"
            value={(step / ONBOARDING_STEPS.length) * 100}
          />

          <CurrentStep
            uid={uid}
            bio={bio}
            setBio={setBio}
            step={step}
            setStep={setStep}
          />
        </div>
      )}
    </div>
  );
}
