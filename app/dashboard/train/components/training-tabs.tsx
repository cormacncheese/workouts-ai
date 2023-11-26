'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserBioForm from './user-bio-form';
import useWorkspace from '@/lib/hooks/use-workspace';

export function TrainingTabs() {
  const { workspace } = useWorkspace();

  const defaultValue =
    workspace && workspace.type === 'business' ? 'brand_bio' : 'user_bio';

  return (
    <Tabs defaultValue={defaultValue} className="w-full relative">
      <TabsList>
        {workspace && workspace.type === 'personal' && (
          <TabsTrigger value="user_bio">Your Info</TabsTrigger>
        )}
        {workspace && workspace.type === 'business' && (
          <TabsTrigger value="brand_bio">Business Info</TabsTrigger>
        )}
        <TabsTrigger value="system_instructions">Instructions</TabsTrigger>
      </TabsList>
      <TabsContent value="user_bio" className="py-3">
        <UserBioForm />
      </TabsContent>
    </Tabs>
  );
}
