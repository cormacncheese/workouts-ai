'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import useUser from '@/lib/hooks/use-user';
import { updateUserFullName } from '@/app/actions/user';

const profileFormSchema = z.object({
  full_name: z.string().max(160).min(2)
  // username: z
  //   .string()
  //   .min(2, {
  //     message: 'Username must be at least 2 characters.'
  //   })
  //   .max(30, {
  //     message: 'Username must not be longer than 30 characters.'
  //   }),
  // email: z
  //   .string({
  //     required_error: 'Please select an email to display.'
  //   })
  //   .email(),
  // bio: z.string().max(160).min(4),
  // urls: z
  //   .array(
  //     z.object({
  //       value: z.string().url({ message: 'Please enter a valid URL.' })
  //     })
  //   )
  //   .optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { userData, uid } = useUser();

  useEffect(() => {
    if (userData) {
      form.reset({
        full_name: userData.full_name
      });
    }
  }, [userData]);

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    full_name: userData?.full_name
    // bio: 'I own a computer.',
    // urls: [
    //   { value: 'https://shadcn.com' },
    //   { value: 'http://twitter.com/shadcn' }
    // ]
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  // const { fields, append } = useFieldArray({
  //   name: 'urls',
  //   control: form.control
  // });

  async function onSubmit(data: ProfileFormValues) {
    console;
    setIsLoading(true);

    const name = data.full_name;

    try {
      const res = await updateUserFullName(uid, name);
      if (res) {
        toast({
          title: 'Name updated'
        });
      } else {
        throw new Error('Error saving name');
      }
    } catch (e) {
      toast({
        title: 'Unable to save.'
      });
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Elon" {...field} />
              </FormControl>
              <FormDescription className="text-muted">
                This is how maia will refer to you. It can be your real name or
                a pseudonym
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{' '}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: '' })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit" loading={isLoading}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
