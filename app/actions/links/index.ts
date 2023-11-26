'use server';

import { supabase } from '@/utils/supabase';

export async function getLinks({ workspaceId }: { workspaceId: string }) {
  console.log('workspaceId:: ', workspaceId);
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error fetching links: ', error);
    return null;
  }

  return data;
}

export async function updateLinks({
  uploadedBy,
  workspaceId,
  workspace_type,
  links
}: {
  uploadedBy: string;
  workspaceId: string;
  workspace_type: string;
  links: any[];
}) {
  try {
    let updatedData;

    for (const link of links) {
      const { data: existingLink, error } = await supabase
        .from('links')
        .select('*')
        .eq('id', link.id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (existingLink) {
        const { data, error: updateError } = await supabase
          .from('links')
          .update({ carbon_metadata: link })
          .eq('id', link.id)
          .select();

        if (updateError) {
          throw new Error(updateError.message);
        }

        updatedData = data[0];
      } else {
        const { data, error: insertError } = await supabase
          .from('links')
          .insert([
            {
              id: link.id,
              carbon_metadata: link,
              workspace_id: workspaceId,
              uploaded_by: uploadedBy,
              workspace_type: workspace_type
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
      throw new Error('No links were updated.');
    }
  } catch (e) {
    console.error('Error updating user links: ', e);
    return false;
  }
}

export async function deletelink({
  linkId,
  workspace_id
}: {
  linkId: string;
  workspace_id: string;
}) {
  if (!linkId) {
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
          file_ids: [linkId]
        })
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error('Error deleting link from Carbon: ', err);
        return false;
      });

    if (deleteFromCarbonRes.success !== true) {
      throw new Error('Error deleting link from Carbon.');
    }

    // remove from supabase
    const { error } = await supabase.from('links').delete().eq('id', linkId);

    if (error) {
      throw new Error(error.message);
    } else {
      return true;
    }
  } catch (e) {
    console.error('Error deleting link: ', e);
    return false;
  }
}
