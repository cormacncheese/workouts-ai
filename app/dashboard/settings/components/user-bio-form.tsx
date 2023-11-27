'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { saveUserBio } from '@/app/actions/user';
import { useToast } from '@/components/ui/use-toast';
import useUser from '@/lib/hooks/use-user';
import UserBioSkeleton from './user-bio-skeleton';

export default function UserBioForm() {
  const { toast } = useToast();
  const { userBio } = useUser();

  const [loading, setLoading] = useState(false);
  const [previousUserBio, setPreviousUserBio] = useState<any>(null); // TODO: type this
  const [bio, setBio] = useState<any>({
    fitness_goals: '',
    workout_location: '',
    workout_frequency: '',
    workout_experience: '',
    workout_intensity: ''
  });

  useEffect(() => {
    if (userBio) {
      setBio(userBio);
      setPreviousUserBio(userBio);
    }
  }, [userBio]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await saveUserBio(bio);

      if (res) {
        toast({
          title: 'Updated workout preferences!'
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

  if (!bio || !previousUserBio) {
    <UserBioSkeleton />;
  } else {
    return (
      <>
        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="about_you">Fitness goals</Label>
            <Textarea
              value={bio?.fitness_goals}
              onChange={(e) =>
                setBio({ ...bio, fitness_goals: e.target.value })
              }
              id="fitness_goals"
            />
          </div>

          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="working_on">Where you workout</Label>
            <Textarea
              value={bio?.workout_location}
              onChange={(e) =>
                setBio({ ...bio, workout_location: e.target.value })
              }
              id="workout_location"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="goals">Workout schedule</Label>
            <Textarea
              value={bio?.workout_frequency}
              onChange={(e) =>
                setBio({ ...bio, workout_frequency: e.target.value })
              }
              id="workout_frequency"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="writing_style">Experience level</Label>
            <Textarea
              value={bio.workout_experience}
              onChange={(e) =>
                setBio({ ...bio, workout_experience: e.target.value })
              }
              id="workout_experience"
            />
          </div>
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="hobbies">Added preferences</Label>
            <Textarea
              value={bio.workout_preferences}
              onChange={(e) =>
                setBio({ ...bio, workout_preferences: e.target.value })
              }
              id="workout_preferences"
            />
          </div>
        </div>

        <div className="flex flex-row justify-end md:mt-4 md:mb-0 mb-4">
          <Button variant="default" loading={loading} onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </>
    );
  }
}
