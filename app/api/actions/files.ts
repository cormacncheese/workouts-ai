import { supabase } from '@/app/api/utils/supabase-server-client';

export async function updateFileLinkStatus({
  fileId,
  status
}: {
  fileId: number;
  status: string;
}) {
  try {
    let existingData;

    console.log('updateFileLinkStatus:: ', fileId, status);

    // get existing file data
    const {
      data: existingFileData,
      error: existingFilError
    } = await supabase.from('files').select('carbon_metadata').eq('id', fileId); // replace 'some-id' with the actual id

    // get existing link data
    const {
      data: existingLinkData,
      error: existingLinkError
    } = await supabase.from('links').select('carbon_metadata').eq('id', fileId); // replace 'some-id' with the actual id

    existingData = existingFileData || existingLinkData;

    // console.log('existingData:: ', existingData);

    if (!existingData) {
      throw new Error('No data found');
    }

    const updatedCarbonMetadata = existingData[0].carbon_metadata;

    updatedCarbonMetadata.sync_status = status;

    console.log('updatedCarbonMetadata:: ', updatedCarbonMetadata);

    if (updatedCarbonMetadata) {
      let updatedData;
      let updatedError;
      if (existingFileData) {
        const { data, error } = await supabase
          .from('files')
          .update({ carbon_metadata: updatedCarbonMetadata })
          .eq('id', fileId)
          .select();

        updatedError = error;
        updatedData = data && data[0];
      } else if (existingLinkData) {
        const { data, error } = await supabase
          .from('links')
          .update({ carbon_metadata: updatedCarbonMetadata })
          .eq('id', fileId)
          .select();

        updatedError = error;
        updatedData = data && data[0];
      }

      console.log('updatedData:: ', updatedData);

      if (updatedError) {
        throw new Error(updatedError.message);
      }

      return updatedData;
    } else {
      throw new Error('No data found');
    }
  } catch (e) {
    console.log('Error updating file link status:: ', e);
    return false;
  }
}
