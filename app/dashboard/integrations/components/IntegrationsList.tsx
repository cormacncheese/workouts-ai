'use client';

import IntegrationCard from './IntegrationCard';
import { INTEGRATIONS } from '../constants';
import { IntegrationWaitlistSheet } from './IntegrationWaitlistSheet';
import { useState, useEffect } from 'react';
import CarbonConnectWrapper from './carbon-connect';
import useUser from '@/lib/hooks/use-user';
import { tokenFetcher } from '@/app/actions/carbon';
import * as Carbon from 'carbon-connect-js';
import useWorkspace from '@/lib/hooks/use-workspace';
import useSubscription from '@/lib/hooks/use-subscription';
import { useToast } from '@/components/ui/use-toast';
import PaywallDialog from '@/app/dashboard/components/paywall-dialog';

export default function IntegrationsList() {
  const { uid } = useUser();
  const { workspace, workspaceId } = useWorkspace();
  const { subscription } = useSubscription();
  const { toast } = useToast();

  const [isOpenWaitlist, setIsOpenWaitlist] = useState(false);
  const [openCarbon, setOpenCarbon] = useState(false);
  const [userIntegrations, setUserIntegrations] = useState<any>([]);
  const [isOpenPaywall, setIsOpenPaywall] = useState(false);

  async function fetchUserIntegrations() {
    if (!workspace) return;

    const access_token = await tokenFetcher(workspaceId);

    try {
      const response = await Carbon.getUserConnections({
        accessToken: access_token.access_token
      });

      if (response.status === 200) {
        setUserIntegrations(response.connections);
      } else {
        // console.error('Error:', response.error.message);
      }
    } catch (err) {
      // console.error('Unexpected error:', err.message);
    }
  }

  useEffect(() => {
    fetchUserIntegrations();
  }, [workspace]);

  const handleOpenIntegrations = () => {
    if (subscription?.status === 'active') {
      setOpenCarbon(true);
    } else if (userIntegrations.length < 2 || !userIntegrations) {
      setOpenCarbon(true);
    } else {
      setIsOpenPaywall(true);
      toast({
        title: 'You must be subscribed to Pro to use this feature.'
      });
    }
  };

  return (
    <div>
      <IntegrationWaitlistSheet
        open={isOpenWaitlist}
        setOpen={setIsOpenWaitlist}
      />

      <CarbonConnectWrapper
        uid={uid}
        open={openCarbon}
        setOpen={setOpenCarbon}
      />

      <PaywallDialog isOpen={isOpenPaywall} setIsOpen={setIsOpenPaywall} />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 py-8 md:px-0 px-4">
        {INTEGRATIONS.map((integration) => (
          <IntegrationCard
            key={integration.id}
            id={integration.id}
            iconUrl={integration.iconUrl}
            title={integration.name}
            description={integration.description}
            open={openCarbon}
            setOpen={handleOpenIntegrations}
            isConnected={userIntegrations.some(
              (userConnection: any) =>
                userConnection.data_source_type === integration.carbonKey
            )}
            // @ts-ignore
            isAvailable={integration.available}
          />
        ))}
      </div>
    </div>
  );
}
