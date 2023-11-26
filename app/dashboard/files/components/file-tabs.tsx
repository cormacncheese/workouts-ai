'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useUser from '@/lib/hooks/use-user';
import FilesList from './files';
import LinksList from './links';

export function FileTabs() {
  const { uid } = useUser();

  return (
    <Tabs defaultValue="files" className="w-full relative">
      <TabsList>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="links">Links</TabsTrigger>
      </TabsList>
      <TabsContent value="files" className="py-3">
        <FilesList uid={uid} />
      </TabsContent>
      <TabsContent value="links" className="py-3">
        <LinksList uid={uid} />
      </TabsContent>
    </Tabs>
  );
}
