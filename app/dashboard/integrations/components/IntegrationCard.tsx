'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import Typography from '@/components/molecules/Typography';
import { Check } from 'lucide-react';

type Props = {
  title: string;
  id: string;
  iconUrl: string;
  description: string;
  open: boolean;
  isAvailable: boolean;
  isConnected: boolean;
  setOpen: () => void;
};

export default function IntegrationCard({
  id,
  iconUrl,
  title,
  description,
  isAvailable,
  isConnected,
  open,
  setOpen
}: Props) {
  return (
    <Card
      className="transform transition duration-500 ease-in-out hover:-translate-y-1 hover:cursor-pointer"
      onClick={setOpen}
    >
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="relative w-8 h-8 mb-2">
            <Image src={iconUrl} alt="title" width={50} height={50} />
          </div>
          {!isAvailable && !isConnected && (
            <Typography
              size="xs"
              fontWeight="normal"
              className="!text-muted-foreground italic"
            >
              coming soon
            </Typography>
          )}

          {isConnected && (
            <div className="flex flex-row gap-2 items-center">
              <Typography
                size="xs"
                fontWeight="normal"
                className="!text-muted-foreground italic"
              >
                <Check className="h-4 w-4 mr-1" />
              </Typography>
              {/* <Button
                variant="outline"
                className="italic"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResync();
                }}
              >
                Resync
              </Button> */}
            </div>
          )}
        </div>

        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {/* <CardFooter>Status</CardFooter> */}
    </Card>
    // </Link>
  );
}
