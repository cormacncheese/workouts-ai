'use client';

import OnboardingFlow from './components/onboarding-flow';

export default function Dashboard() {
  return (
    <section className="mb-32 height-screen-helper h-full flex justify-center pt-40 w-full">
      <OnboardingFlow />
    </section>
  );
}
