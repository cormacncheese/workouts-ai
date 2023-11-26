'use client';

import useSWR from 'swr';
import { getUserSaved } from '@/app/actions/user';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function SavedForm() {
  const { data } = useSWR('user-saved', getUserSaved);

  const { toast } = useToast();

  return (
    <>
      {data && data.length > 0 ? (
        <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
          {data.map((item) => (
            <Card>
              <CardHeader>
                <CardTitle>{item.label || 'no label'}</CardTitle>
                <CardDescription className="max-h-20 overflow-hidden">
                  {item.content}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(item.content);
                    toast({
                      title: 'Copied!'
                    });
                  }}
                >
                  Copy
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
