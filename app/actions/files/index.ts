'use server';

import { supabase } from '@/utils/supabase';

export async function getFiles({ workspaceId }: { workspaceId: string }) {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error fetching files: ', error);
    return null;
  }

  return data;
}

export async function updateFiles({
  uploadedBy,
  workspaceId,
  workspace_type,
  files
}: {
  uploadedBy: string;
  workspaceId: string;
  workspace_type: string;
  files: any[];
}) {
  try {
    let updatedData;

    for (const file of files) {
      const { data: existingFile, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', file.id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (existingFile) {
        const { data, error: updateError } = await supabase
          .from('files')
          .update({ carbon_metadata: file })
          .eq('id', file.id)
          .select();

        if (updateError) {
          throw new Error(updateError.message);
        }

        updatedData = data[0];
      } else {
        const { data, error: insertError } = await supabase
          .from('files')
          .insert([
            {
              id: file.id,
              carbon_metadata: file,
              workspace_id: workspaceId,
              workspace_type: workspace_type,
              uploaded_by: uploadedBy
            }
          ])
          .select();

        if (insertError) {
          throw new Error(insertError.message);
        }

        updatedData = data[0];
      }
    }

    if (updatedData) {
      return updatedData;
    } else {
      throw new Error('No files were updated.');
    }
  } catch (e) {
    console.error('Error updating user files: ', e);
    return false;
  }
}

export async function deleteFile({
  fileId,
  workspace_id
}: {
  fileId: string;
  workspace_id: string;
}) {
  if (!fileId) {
    throw new Error('No file id provided.');
  }

  try {
    // remove from Carbon
    const deleteFromCarbonRes = await fetch(
      `https://api.carbon.ai/delete_files`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.CARBON_API_KEY,
          'customer-id': workspace_id
        },
        body: JSON.stringify({
          file_ids: [fileId]
        })
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error('Error deleting file from Carbon: ', err);
        return false;
      });

    // if (deleteFromCarbonRes.success !== true) {
    //   throw new Error('Error deleting file from Carbon.');
    // }

    // remove from supabase
    const { error } = await supabase.from('files').delete().eq('id', fileId);

    if (error) {
      throw new Error(error.message);
    } else {
      return true;
    }
  } catch (e) {
    console.error('Error deleting file: ', e);
    return false;
  }
}
