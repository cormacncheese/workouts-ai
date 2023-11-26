'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import useBusiness from '@/lib/hooks/use-businesses';
import useUser from '@/lib/hooks/use-user';
import useWorkspace from '@/lib/hooks/use-workspace';
import { buttonVariants } from '@/components/ui/button';
import cn from 'classnames';
import { Workspace } from '@/types/custom';
import { User2, Building } from 'lucide-react';
import { AddBusinessForm } from '@/app/dashboard/train/components/new-business-form';
import useDevice from '@/lib/hooks/use-device';

export default function WorkspaceDropdown() {
  const { userBusinesses, setSelectedBusinessId } = useBusiness();
  const { uid } = useUser();
  const { isMobile, isTablet } = useDevice();
  const { setWorkspace, workspaceId, workspace } = useWorkspace();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    if (userBusinesses || uid) {
      getWorkspaces();
    }
  }, [uid, userBusinesses]);

  const getWorkspaces = async () => {
    let workspaces = [
      {
        id: uid,
        name: 'Personal',
        type: 'personal'
      }
    ];

    if (userBusinesses) {
      userBusinesses.forEach((business) => {
        workspaces.push({
          id: business.id,
          name: business.name,
          type: 'business'
        });
      });
    }

    setWorkspaces(workspaces);
  };

  const handleClick = (item: any) => {
    setWorkspace(item);
    setSelectedBusinessId(item.id);
    // mutate(`business-data-${item.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'flex flex-row gap-2'
        )}
      >
        {workspace && workspace.type === 'personal' ? (
          <User2 className="h-4 w-4" />
        ) : (
          <Building className="h-4 w-4" />
        )}
        {!isMobile && !isTablet && <>{workspace && workspace.name}</>}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>

        {workspaces.map((item) => (
          <DropdownMenuCheckboxItem
            key={item.id}
            checked={item.id === workspaceId}
            onCheckedChange={() => {
              handleClick(item);
            }}
            className="flex flex-row gap-2 hover:cursor-pointer"
          >
            {item && item.type === 'personal' ? (
              <User2 className="h-4 w-4" />
            ) : (
              <Building className="h-4 w-4" />
            )}
            {item.name}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <AddBusinessForm />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
