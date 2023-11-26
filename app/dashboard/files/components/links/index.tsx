'use client';

import { Button } from '@/components/ui/button';
import CarbonConnectUrl from '@/app/dashboard/assistant/components/carbon-connect-url';
import React, { useState } from 'react';
import useWorkspace from '@/lib/hooks/use-workspace';
import useSWR from 'swr';
import { Plus, RotateCcw } from 'lucide-react';
import { LinksTable } from './links-table';
import { deletelink } from '@/app/actions/links';
import { useToast } from '@/components/ui/use-toast';
import { mutate } from 'swr';
import { getLinks } from '@/app/actions/links';

type Props = {
  uid: string | null;
};

export default function LinksList({ uid }: Props) {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isOpenCarbonUrl, setIsOpenCarbonUrl] = useState(false);

  const { data: links, error: linksError } = useSWR(
    workspaceId ? `user-links-${workspaceId}` : null,
    () => getLinks({ workspaceId }),
    { revalidateOnFocus: false }
  );

  const handleDeleteLink = async (linkId: string) => {
    const res = await deletelink({ linkId, workspace_id: workspaceId });

    if (res) {
      toast({
        title: 'Deleted Link!'
      });
      mutate(`user-links-${workspaceId}`);
    } else {
      toast({
        title: 'Error deleting link'
      });
    }
  };

  const handleRefresh = async () => {
    mutate(`user-files-${workspaceId}`);
  };

  return (
    <>
      <CarbonConnectUrl
        uid={uid || ''}
        open={isOpenCarbonUrl}
        setOpen={setIsOpenCarbonUrl}
      />

      <div className="md:absolute right-0 -top-4 flex flex-row justify-end md:mt-4 md:mb-0 mb-4">
        <div className="flex flex-row gap-2">
          <Button variant="ghost" onClick={handleRefresh}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="default"
            loading={loading}
            onClick={() => setIsOpenCarbonUrl(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new link
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <LinksTable data={links || []} handleDeleteLink={handleDeleteLink} />
      </div>
    </>
  );
}
