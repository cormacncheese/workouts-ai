'use client';

import { Button } from '@/components/ui/button';
import CarbonConnectFiles from '../../../assistant/components/carbon-connect-files';
import React, { useState } from 'react';
import useWorkspace from '@/lib/hooks/use-workspace';
import { getFiles } from '@/app/actions/files';
import useSWR from 'swr';
import { RotateCcw, Upload } from 'lucide-react';
import { FilesTable } from './files-table';
import { deleteFile } from '@/app/actions/files';
import { useToast } from '@/components/ui/use-toast';
import { mutate } from 'swr';

type Props = {
  uid: string | null;
};

export default function FilesList({ uid }: Props) {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isOpenCarbonFiles, setIsOpenCarbonFiles] = useState(false);

  const { data: files, error: fileError } = useSWR(
    workspaceId ? `user-files-${workspaceId}` : null,
    () => getFiles({ workspaceId }),
    { revalidateOnFocus: false }
  );

  const handleDeleteFile = async (fileId: string) => {
    const res = await deleteFile({ fileId, workspace_id: workspaceId });

    if (res) {
      toast({
        title: 'Deleted file!'
      });
      mutate(`user-files-${workspaceId}`);
    } else {
      toast({
        title: 'Error deleting file'
      });
    }
  };

  const handleRefresh = async () => {
    mutate(`user-files-${workspaceId}`);
  };

  return (
    <>
      <CarbonConnectFiles
        uid={uid || ''}
        open={isOpenCarbonFiles}
        setOpen={setIsOpenCarbonFiles}
      />

      <div className="md:absolute right-0 -top-4 flex flex-row justify-end md:mt-4 md:mb-0 mb-4">
        <div className="flex flex-row gap-2">
          <Button variant="ghost" onClick={handleRefresh}>
            <RotateCcw className="w-4 h-4" />
          </Button>
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

      <div className="flex flex-col gap-4">
        <FilesTable data={files || []} handleDeleteFile={handleDeleteFile} />
      </div>
    </>
  );
}
