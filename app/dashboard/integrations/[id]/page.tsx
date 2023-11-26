'use client';

import { INTEGRATIONS } from '../constants';
import { pathHeaderAtom, currentIntegrationIdAtom } from '@/utils/atoms';
import { useAtom, useStore } from 'jotai';
import IntegrationCardHeader from './components/IntegrationCardHeader';
import { useSearchParams } from 'next/navigation';
import CarbonConnectWrapper from '../components/carbon-connect';
import useUser from '@/lib/hooks/use-user';
import { useState } from 'react';

export default function IntegrationPage({
  params
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const { uid } = useUser();

  const [, setHeaderText] = useAtom(pathHeaderAtom);
  const [, setCurrentIntegrationId] = useAtom(currentIntegrationIdAtom);

  const { id } = params;
  const googleClientId = searchParams.get('client_id');

  setCurrentIntegrationId(id);
  const integration = INTEGRATIONS.find((integration) => integration.id === id);

  if (!integration) {
    throw new Error(`Integration with id ${id} not found`);
  }

  setHeaderText(`Integrations/${integration.name}`);

  return (
    <section className="mb-32 bg-black height-screen-helper py-6">
      <IntegrationCardHeader
        integration={integration}
        clientId={googleClientId}
      />
    </section>
  );
}
