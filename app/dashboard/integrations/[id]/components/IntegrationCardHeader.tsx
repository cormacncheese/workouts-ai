'use client';

import { Integration } from '@/types/custom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type Props = {
  integration: Integration;
  clientId: string | null;
};

export default function IntegrationCardHeader({
  integration,
  clientId
}: Props) {
  const handleConnect = async () => {
    let response;
    try {
      response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ integrationId: integration.id })
      });
    } catch (err) {
      console.log('err: ', err);
      return; // return early if an error occurs
    }

    const data = await response.json();

    const authUrl = data.authUrl;

    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <Card className="w-full border-b border-x-0 border-t-0 rounded-none bg-transparent">
      <CardHeader>
        <div className="relative w-12 h-12 mb-2">
          <Image src={integration.iconUrl} alt="title" width={50} height={50} />
        </div>
        <CardTitle>{integration.name}</CardTitle>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>

      {/* <CardFooter>
        {!clientId && <Button onClick={handleConnect}>Connect</Button>}
      </CardFooter> */}
    </Card>
  );
}
