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

export default function CarbonConnectWrapper({ uid, open, setOpen }: Props) {
  const { workspaceId, workspace } = useWorkspace();

  const { toast } = useToast();

  const handleFileUploadSuccess = async (data: any) => {
    // console.log('Carbon connect files on Success: ', data);

    const files = data.data.files;

    if (!files) return;

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
          id: 'NOTION',
          chunkSize: 1500,
          overlapSize: 20
        },
        {
          // @ts-ignore
          id: 'GOOGLE_DRIVE',
          chunkSize: 1000,
          overlapSize: 20
        },
        {
          // @ts-ignore
          id: 'INTERCOM',
          chunkSize: 1000,
          overlapSize: 20
        },
        {
          // @ts-ignore
          id: 'DROPBOX',
          chunkSize: 1000,
          overlapSize: 20
        }
      ]}
      onSuccess={handleFileUploadSuccess}
      onError={(error) => console.log('Data on Error: ', error)}
      primaryBackgroundColor="#000000"
      primaryTextColor="#ffffff"
      secondaryBackgroundColor="#000000"
      secondaryTextColor="#ffffff"
      allowMultipleFiles={true}
      chunkSize={1500}
      overlapSize={20}
      classsName="!bg-background"
      // entryPoint="LOCAL_FILES"
    />
  );
}
