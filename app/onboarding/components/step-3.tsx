'use client';

import React from 'react';
import BottomButtons from './bottom-buttons';
import HeaderText from './header-text';
import OnboardingWrapper from './wrapper';
import CarbonConnectFiles from '@/app/dashboard/assistant/components/carbon-connect-files';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import SubHeaderText from './sub-header-text';

type Props = {
  uid: string;
  userData: any;
  userBio: any;
  step: number;
  setStep: (step: number) => void;
};

export function OnboardingStep3({
  uid,
  userData,
  userBio,
  step,
  setStep
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [isOpenCarbonFiles, setIsOpenCarbonFiles] = React.useState(false);

  const submit = async () => {
    setStep(step + 1);
    // setLoading(true);

    // toast({
    //   title: "One sec, I'm scraping your website."
    // });

    // const isClean = await moderateText(url);

    // if (!isClean) {
    //   toast({
    //     title: 'Website contains inappropriate content. Please try again.'
    //   });
    //   setLoading(false);
    // }

    // // second index the new website
    // try {
    //   const response = await fetch('/api/embed/website', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ url: url })
    //   });

    //   const embedRes = await response.json();

    //   await updateWebsiteInUserBio(url);

    //   if (embedRes) {
    //     updateOnboardingStep(uid, step + 1);
    //     setStep(step + 1);
    //   } else {
    //     throw new Error('Error saving website');
    //   }
    // } catch (e) {
    //   toast({
    //     title: 'Something went wrong. Please try again or skip for now'
    //   });
    // }

    // setLoading(false);
  };

  return (
    <OnboardingWrapper>
      <HeaderText>Upload your files</HeaderText>
      <SubHeaderText>
        Attach your PDFs, CSVs, DOCXs, and TXTs and your AI will read them all
        for you
      </SubHeaderText>

      <CarbonConnectFiles
        uid={uid || ''}
        open={isOpenCarbonFiles}
        setOpen={setIsOpenCarbonFiles}
      />

      <div className="pb-8">
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            loading={loading}
            onClick={() => setIsOpenCarbonFiles(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload file
          </Button>
        </div>
      </div>

      <BottomButtons
        step={step}
        setStep={setStep}
        handleSubmit={submit}
        isLoading={loading}
        allowSkip={true}
      />
    </OnboardingWrapper>
  );
}
