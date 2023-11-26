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

  useEffect(() => {
    if (onboardingStep === ONBOARDING_STEPS.length) {
      router.push('/dashboard/assistant');
    }
    setStep(onboardingStep);
  }, [onboardingStep]);

  const CurrentStep = ONBOARDING_STEPS[step];

  useEffect(() => {
    if (step === ONBOARDING_STEPS.length) {
      updateOnboardingStatus(uid, true);
    }
  }, [step]);

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
            userData={userData}
            userBio={userBio}
            step={step}
            setStep={setStep}
          />
        </div>
      )}
    </div>
  );
}
