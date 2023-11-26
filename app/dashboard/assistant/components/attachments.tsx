'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { buttonVariants } from '@/components/ui/button';
import {
  Check,
  Link,
  FileText,
  Upload,
  FolderClosed,
  Paperclip,
  ChevronLeft,
  Link2Off
} from 'lucide-react';
import cn from 'classnames';
import React from 'react';
import { Button } from '@/components/ui/button';
import { getFiles } from '@/app/actions/files';
import useSWR from 'swr';
import Typography from '@/components/molecules/Typography';
import CarbonConnectUrl from './carbon-connect-url';
import CarbonConnectFiles from './carbon-connect-files';
import { getLinks } from '@/app/actions/links';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PaywallDialog from '@/app/dashboard/components/paywall-dialog';
import useSubscription from '@/lib/hooks/use-subscription';

type Props = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
  uid: string;
  workspaceId: string;
  selectedFileId: string | null;
  setSelectedFileId: (id: string) => void;
  selectedLinkId: string | null;
  setSelectedLinkId: (id: string) => void;
  isLiveSearch: boolean;
  setIsLiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Attachments({
  isOpen,
  setIsOpen,
  uid,
  workspaceId,
  selectedFileId,
  setSelectedFileId,
  selectedLinkId,
  setSelectedLinkId,
  isLiveSearch,
  setIsLiveSearch
}: Props) {
  const { subscription } = useSubscription();

  const [popOverContent, setPopOverContent] = React.useState('Choices');
  const [isOpenCarbonUrl, setIsOpenCarbonUrl] = React.useState(false);
  const [isOpenCarbonFiles, setIsOpenCarbonFiles] = React.useState(false);
  const [isOpenPaywall, setIsOpenPaywall] = React.useState(false);

  const { data: files, error: fileError } = useSWR(
    workspaceId ? `user-files-${workspaceId}` : null,
    () => getFiles({ workspaceId }),
    { revalidateOnFocus: false }
  );

  const { data: links, error: linkError } = useSWR(
    workspaceId ? `user-links-${workspaceId}` : null,
    () => getLinks({ workspaceId }),
    { revalidateOnFocus: false }
  );

  if (linkError || fileError) {
    // return null;
  }

  const handleSearchToggleClick = () => {
    if (!subscription || subscription?.status !== 'active') {
      setIsOpen(true);
      return;
    }

    setIsLiveSearch(!isLiveSearch);
  };

  return (
    <>
      <PaywallDialog isOpen={isOpenPaywall} setIsOpen={setIsOpenPaywall} />

      <CarbonConnectUrl
        uid={uid || ''}
        open={isOpenCarbonUrl}
        setOpen={setIsOpenCarbonUrl}
      />

      <CarbonConnectFiles
        uid={uid || ''}
        open={isOpenCarbonFiles}
        setOpen={setIsOpenCarbonFiles}
      />

      <Popover
        open={isOpen}
        onOpenChange={() => {
          setPopOverContent('Choices');
          if (isOpen) {
            setIsOpen(false);
          }
        }}
      >
        <PopoverTrigger
          onClick={() => {
            setIsOpen(true);
          }}
          className={cn(
            buttonVariants({ size: 'sm', variant: 'ghost' }),
            'h-10 w-10 rounded-full p-0 sm:left-4'
          )}
        >
          <Paperclip className="w-10 h-10" />
        </PopoverTrigger>
        <PopoverContent align="start">
          {popOverContent === 'Choices' && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Attachments</h4>
                <p className="text-sm text-muted-foreground">
                  Select files and websites to attach to the prompt.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex flex-row  w-full  py-2 items-center gap-4">
                  <Switch
                    id="isLiveSearch"
                    checked={isLiveSearch}
                    onCheckedChange={() => {
                      handleSearchToggleClick();
                    }}
                  />
                  <Label htmlFor="isLiveSearch">Live Search</Label>
                </div>
                <div className="items-center gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setPopOverContent('Files')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Select files
                  </Button>
                </div>
                <div className="items-center gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setPopOverContent('Links')}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Select links
                  </Button>
                </div>
              </div>
            </div>
          )}

          {popOverContent === 'Files' && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex flex-row items-center">
                  <Button
                    variant="ghost"
                    onClick={() => setPopOverContent('Choices')}
                    className="p-0"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                  <h4 className="font-medium leading-none">Files</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select or upload a file.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="items-center gap-4">
                  <div className="flex flex-col">
                    {files && files.length > 0 ? (
                      <div className="flex flex-col mb-4 gap-2">
                        {files.map((file: any) => (
                          <div
                            className="flex flex-row items-center justify-between hover:cursor-pointer hover:opacity-80"
                            onClick={() => {
                              setSelectedFileId(file.id);
                            }}
                          >
                            <div className="flex flex-row items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              <Typography
                                size="base"
                                fontWeight="normal"
                                className="text-sm"
                              >
                                {file.carbon_metadata.name}{' '}
                              </Typography>
                            </div>
                            {selectedFileId === file.id && (
                              <Check className="w-4 h-4 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-row items-center">
                        <FolderClosed className="w-4 h-4 mr-2" />
                        <Typography
                          size="base"
                          fontWeight="normal"
                          className="text-sm"
                        >
                          You don't have any files yet.
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" items-center gap-4">
                  <Button
                    onClick={() => setIsOpenCarbonFiles(true)}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload new file
                  </Button>
                </div>
              </div>
            </div>
          )}

          {popOverContent === 'Links' && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex flex-row items-center">
                  <Button
                    variant="ghost"
                    onClick={() => setPopOverContent('Choices')}
                    className="p-0"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                  <h4 className="font-medium leading-none">Links</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select or input a url.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="items-center gap-4 mb-4">
                  <div className="flex flex-col">
                    {links && links.length > 0 ? (
                      <div className="flex flex-col mb-4 gap-2">
                        {links.map((link: any) => (
                          <div
                            className="flex flex-row items-center justify-between hover:cursor-pointer hover:opacity-80"
                            onClick={() => {
                              setSelectedLinkId(link.id);
                            }}
                          >
                            <div className="flex flex-row items-center ">
                              <Link className="w-4 h-4 mr-2" />
                              <Typography
                                size="base"
                                fontWeight="normal"
                                className="text-sm overflow-hidden overflow-ellipsis w-48 "
                              >
                                {link.carbon_metadata.external_url}{' '}
                              </Typography>
                            </div>
                            {selectedLinkId === link.id && (
                              <Check className="w-4 h-4 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-row items-center">
                        <Link2Off className="w-4 h-4 mr-2" />
                        <Typography
                          size="base"
                          fontWeight="normal"
                          className="text-sm"
                        >
                          You don't have any links yet.
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" items-center gap-4">
                  <Button
                    onClick={() => setIsOpenCarbonUrl(true)}
                    className="w-full"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Attach new link
                  </Button>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
