import { CarbonConnect } from 'carbon-connect';
import { tokenFetcher } from '@/app/actions/carbon';
import useWorkspace from '@/lib/hooks/use-workspace';
import { useToast } from '@/components/ui/use-toast';
import { updateLinks } from '@/app/actions/links';
import { mutate } from 'swr';

type Props = {
  uid: string;
  open: boolean;
  setOpen: any;
};

export default function CarbonConnectUrl({ uid, open, setOpen }: Props) {
  const { workspaceId, workspace } = useWorkspace();
  const { toast } = useToast();

  const handleLinkUploadSuccess = async (data: any) => {
    const links = data.data.files;

    try {
      const res = await updateLinks({
        uploadedBy: uid,
        workspaceId: workspaceId,
        links: links,
        workspace_type: workspace?.type || 'unknown'
      });

      if (res) {
        toast({
          title: 'Updated links!'
        });
        mutate(`user-links-${workspaceId}`);
      } else {
        throw new Error('Error updating links');
      }
    } catch (e) {
      console.log('Error updating links: ', e);
      toast({
        title: 'Error updating links'
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
          id: 'WEB_SCRAPER',
          chunkSize: 1500,
          overlapSize: 20
        }
      ]}
      onSuccess={handleLinkUploadSuccess}
      onError={(error) => console.log('Data on Error: ', error)}
      allowMultipleFiles={true}
      chunkSize={1500}
      overlapSize={20}
      classsName="!bg-background"
      // entryPoint="LOCAL_FILES"
    />
  );
}
