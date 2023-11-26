'use client';

import React from 'react';
import BottomButtons from './bottom-buttons';
import { updateOnboardingStep } from '@/app/actions/user';
import HeaderText from './header-text';
import OnboardingWrapper from './wrapper';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';
import SubHeaderText from './sub-header-text';
import CarbonConnectWrapper from '@/app/dashboard/integrations/components/carbon-connect';

type Props = {
  uid: string;
  step: number;
  setStep: (step: number) => void;
};

export function OnboardingStep5({ uid, step, setStep }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [
    isOpenCarbonIntegrations,
    setIsOpenCarbonIntegrations
  ] = React.useState(false);

  const submit = async () => {
    setLoading(true);

    updateOnboardingStep(uid, step + 1);
    setStep(step + 1);

    setLoading(false);
  };

  return (
    <OnboardingWrapper>
      <HeaderText>Setup your integrations</HeaderText>
      <SubHeaderText>
        Connect to Google Drive, Dropbox, Notion, and I'll automatically listen
        for updates and changes.
      </SubHeaderText>

      <CarbonConnectWrapper
        uid={uid || ''}
        open={isOpenCarbonIntegrations}
        setOpen={setIsOpenCarbonIntegrations}
      />

      <div className="pb-8">
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            loading={loading}
            onClick={() => setIsOpenCarbonIntegrations(true)}
          >
            <Puzzle className="w-4 h-4 mr-2" />
            Connect integrations
          </Button>
        </div>
      </div>

      <BottomButtons
        step={step}
        setStep={setStep}
        handleSubmit={submit}
        isLoading={loading}
      />
    </OnboardingWrapper>
  );
}
