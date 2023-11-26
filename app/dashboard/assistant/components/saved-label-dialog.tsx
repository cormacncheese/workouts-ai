import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface Props {
  isSaved: boolean;
  isSaving: boolean;
  isLabelOpen: boolean;
  setIsLabelOpen: (value: boolean) => void;
  handleSave: () => void;
  setLabel: (value: string) => void;
  label: string;
}

export function SavedLabelDialog({
  isSaved,
  isSaving,
  isLabelOpen,
  setIsLabelOpen,
  handleSave,
  setLabel,
  label
}: Props) {
  return (
    <Dialog
      open={isLabelOpen}
      onOpenChange={() => {
        setIsLabelOpen(!isLabelOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsLabelOpen(true);
          }}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className=" w-4 h-4text-muted" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a label to remember</DialogTitle>
          <DialogDescription>
            Make it description. Example: "Dinner idea – Lentil Soup"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Label
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            loading={isSaving}
            onClick={() => {
              if (label && label.length > 1) {
                handleSave();
              }
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
