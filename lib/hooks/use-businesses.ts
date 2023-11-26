'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { selectedBusinessIdAtom } from '@/utils/atoms';
import { getBusinessData } from '@/app/actions/business';
import { getUserBusinesses } from '@/app/actions/user';
import useSWR from 'swr';
import { mutate } from 'swr';

export default function useBusiness() {
  const [selectedBusinessId, setSelectedBusinessId] = useAtom(
    selectedBusinessIdAtom
  );
  const [businessBio, setBusinessBio] = useState<any>({});
  const [businessTodo, setBusinessTodo] = useState<any[]>([]);

  const { data: userBusinesses, error: userBusinessesError } = useSWR(
    'userBusinesses',
    getUserBusinesses
  );

  const { data: businessData } = useSWR(
    selectedBusinessId ? `business-data-${selectedBusinessId}` : null,
    () => getBusinessData({ businessId: selectedBusinessId }),
    { revalidateOnFocus: false }
  );

  // get businesses id
  useEffect(() => {
    const fetch = async () => {
      let id = selectedBusinessId;

      // determine business ID
      if (!selectedBusinessId && userBusinesses && userBusinesses?.length > 0) {
        id = userBusinesses[0].id;
      }

      if (id !== selectedBusinessId) {
        mutate(`business-data-${id}`);
      }

      setSelectedBusinessId(id);
    };

    fetch();
  }, [selectedBusinessId, userBusinesses]);

  useEffect(() => {
    if (businessData) {
      setBusinessBio(businessData.bio);
      setBusinessTodo(businessData.todo || []);
    }
  }, [businessData]);

  return {
    businessId: selectedBusinessId,
    businessData: businessData,
    businessBio: businessBio,
    businessTodo: businessTodo,
    userBusinesses: userBusinesses,
    setSelectedBusinessId: setSelectedBusinessId
  };
}
