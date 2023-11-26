import { CarbonConnect } from 'carbon-connect';
import { tokenFetcher } from '@/app/actions/carbon';
import useWorkspace from '@/lib/hooks/use-workspace';
import { useToast } from '@/components/ui/use-toast';
import { updateFiles } from '@/app/actions/files';
import { mutate } from 'swr';

type Props = {
  uid: string;
  open: boolean;
  setOpen: any;
};

export default function CarbonConnectFiles({ uid, open, setOpen }: Props) {
  const { workspaceId, workspace } = useWorkspace();
  const { toast } = useToast();

  const handleFileUploadSuccess = async (data: any) => {
    const files = data.data.files;

    try {
      const res = await updateFiles({
        uploadedBy: uid,
        workspaceId: workspaceId,
        files: files,
        workspace_type: workspace?.type || 'unknown'
      });

      if (res) {
        toast({
          title: 'Updated files!'
        });

        mutate(`user-files-${workspaceId}`);
      } else {
        throw new Error('Error updating files in person');
      }
    } catch (e) {
      console.log('Error updating files: ', e);
      toast({
        title: 'Error updating files'
      });
    }

    return;
  };

  return (
    <CarbonConnect
      open={open}
      setOpen={setOpen}
      orgName="Zenbase"
      brandIcon="https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/logo/zenbase_pfp_small.jpg"
      tokenFetcher={() => tokenFetcher(workspaceId) || ''}
      tags={{
        uid: uid
      }}
      maxFileSize={10000000}
      enabledIntegrations={[
        {
          // @ts-ignore
          id: 'LOCAL_FILES',
          chunkSize: 100,
          overlapSize: 10,
          maxFileSize: 20000000,
          allowMultipleFiles: true,
          maxFilesCount: 5,
          allowedFileTypes: [
            {
              extension: 'csv',
              chunkSize: 1200,
              overlapSize: 120
            },
            {
              extension: 'txt',
              chunkSize: 1599,
              overlapSize: 210
            },
            {
              extension: 'pdf'
            }
          ]
        }
      ]}
      onSuccess={handleFileUploadSuccess}
      onError={(error) => {
        toast({
          title: 'Failed to process file. Please try another.'
        });
      }}
      allowMultipleFiles={true}
      chunkSize={1500}
      overlapSize={20}
      classsName="!bg-background"
      // entryPoint="LOCAL_FILES"
    />
  );
}
