'use client';

import React from 'react';
import BottomButtons from './bottom-buttons';
import { updateOnboardingStep } from '@/app/actions/user';
import HeaderText from './header-text';
import OnboardingWrapper from './wrapper';
import CarbonConnectUrl from '@/app/dashboard/assistant/components/carbon-connect-url';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
import SubHeaderText from './sub-header-text';

type Props = {
  uid: string;
  userData: any;
  userBio: any;
  step: number;
  setStep: (step: number) => void;
};

export function OnboardingStep4({
  uid,
  userData,
  userBio,
  step,
  setStep
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [isOpenCarbonUrl, setIsOpenCarbonUrl] = React.useState(false);

  const submit = async () => {
    setLoading(true);

    updateOnboardingStep(uid, step + 1);
    setStep(step + 1);

    setLoading(false);
  };

  return (
    <OnboardingWrapper>
      <HeaderText>Connect your website or any links</HeaderText>
      <SubHeaderText>
        I'll read the content on your website and any links you send me.
      </SubHeaderText>

      <CarbonConnectUrl
        uid={uid || ''}
        open={isOpenCarbonUrl}
        setOpen={setIsOpenCarbonUrl}
      />
      <div className="pb-8">
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            loading={loading}
            onClick={() => setIsOpenCarbonUrl(true)}
          >
            <Link className="w-4 h-4 mr-2" />
            Attach a website
          </Button>
        </div>
      </div>

      <BottomButtons
        step={step}
        setStep={setStep}
        handleSubmit={submit}
        allowSkip={true}
        isLoading={loading}
      />
    </OnboardingWrapper>
  );
}
