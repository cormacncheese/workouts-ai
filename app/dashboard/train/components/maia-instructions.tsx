'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { updateSystemInstructions } from '@/app/actions/user';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';
import InputWithPrefix from '@/components/molecules/InputWithPrefix';
import { moderateText } from '@/app/actions/moderate';
import useUser from '@/lib/hooks/use-user';

export default function MaiaInstructionsForm() {
  const { toast } = useToast();
  const { uid, userData } = useUser();

  const [loading, setLoading] = useState(false);
  const [systemInstructions, setMaiaInstructions] = useState<any>();

  useEffect(() => {
    if (userData) {
      setMaiaInstructions(userData.system_instructions || '');
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const moderateRes = await moderateText(systemInstructions);

      if (!moderateRes) {
        toast({
          title: 'Error updating instructions'
        });
      }

      const res = await updateSystemInstructions(uid, systemInstructions);

      if (res) {
        toast({
          title: 'Updated instructions successfully'
        });
      } else {
        throw new Error('Error updating instructions');
      }
    } catch (e) {
      toast({
        title: 'Error updating instructions'
      });
    }

    setLoading(false);
  };

  return (
    <>
      <div className="absolute right-0 -top-6 flex flex-row justify-end mt-4">
        <Button variant="default" loading={loading} onClick={handleSave}>
          Save changes
        </Button>
      </div>

      <div className="flex md:flex-row flex-col gap-8 py-2">
        <div className="grid w-full gap-1.5 py-2">
          <Label htmlFor="about_you">Maia instructions</Label>
          <Textarea
            value={systemInstructions}
            onChange={(e) => setMaiaInstructions(e.target.value)}
            id="system_instructions"
          />
          <p className="text-xs text-muted">
            Tells maia how to respond and act.
          </p>
        </div>
      </div>
    </>
  );
}
