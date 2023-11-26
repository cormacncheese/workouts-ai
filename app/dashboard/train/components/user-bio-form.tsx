'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { saveUserBio, updateWebsiteInUserBio } from '@/app/actions/user';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles } from 'lucide-react';
import InputWithPrefix from '@/components/molecules/InputWithPrefix';
import { moderateText } from '@/app/actions/moderate';
import useUser from '@/lib/hooks/use-user';
import UserBioSkeleton from './user-bio-skeleton';

export default function UserBioForm() {
  const { toast } = useToast();
  const { userBio, userData } = useUser();

  const [loading, setLoading] = useState(false);
  const [previousUserBio, setPreviousUserBio] = useState<any>(null); // TODO: type this
  const [url, setUrl] = useState<string>('');
  const [bio, setBio] = useState<any>({
    ai_learned: '',
    about_you: '',
    working_on: '',
    todo_list: '',
    goals: '',
    writing_style: '',
    hobbies: ''
  });

  useEffect(() => {
    if (userBio) {
      setBio(userBio);
      setPreviousUserBio(userBio);
    }
    if (userData) {
      setUrl(userData.website_url || '');
    }
  }, [userBio, userData]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await saveUserBio(bio);

      let websiteRes;
      if (url !== previousUserBio.website_url && res) {
        websiteRes = await handleUpdateWebsite(res.id);
      }
      if (res && websiteRes) {
        toast({
          title: 'Updated bio successfully'
        });
      } else {
        throw new Error('Error saving bio');
      }
    } catch (e) {
      toast({
        title: 'Error saving bio'
      });
    }

    setLoading(false);
  };

  const handleUpdateWebsite = async (id: string) => {
    // first moderate
    const isClean = await moderateText(url);

    if (!isClean) {
      toast({
        title: 'Website contains inappropriate content. Please try again.'
      });
      return false;
    }

    // second index the new website
    const response = await fetch('/api/embed/website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url, type: 'personal website' })
    });

    const embedRes = await response.json();

    await updateWebsiteInUserBio(url);

    if (embedRes) {
      return true;
    } else {
      return false;
    }
  };

  if (!bio || !previousUserBio) {
    <UserBioSkeleton />;
  } else {
    return (
      <>
        <div className="md:absolute right-0 -top-4 flex flex-row justify-end md:mt-4 md:mb-0 mb-4">
          <Button variant="default" loading={loading} onClick={handleSave}>
            Save changes
          </Button>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="space-y-1">
            <Label htmlFor="website">Personal website</Label>
            <InputWithPrefix
              value={url}
              setValue={setUrl}
              prefix="https://www."
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="about_you">About you</Label>
            <Textarea
              value={bio?.about_you}
              onChange={(e) => setBio({ ...bio, about_you: e.target.value })}
              id="bio"
            />
          </div>

          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="working_on">What are you working on?</Label>
            <Textarea
              value={bio?.working_on}
              onChange={(e) => setBio({ ...bio, working_on: e.target.value })}
              id="working_on"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="goals">Goals</Label>
            <Textarea
              value={bio?.goals}
              onChange={(e) => setBio({ ...bio, goals: e.target.value })}
              id="goals"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="writing_style">Writing style?</Label>
            <Textarea
              value={bio.writing_style}
              onChange={(e) =>
                setBio({ ...bio, writing_style: e.target.value })
              }
              id="writing_style"
            />
          </div>
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="hobbies">Hobbies</Label>
            <Textarea
              value={bio.hobbies}
              onChange={(e) => setBio({ ...bio, hobbies: e.target.value })}
              id="hobbies"
            />
          </div>
        </div>
      </>
    );
  }
}
