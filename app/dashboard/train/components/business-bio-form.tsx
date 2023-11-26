'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getUserBusinesses } from '@/app/actions/user';
import {
  saveBusinessBio,
  updateWebsiteInBusinessBio,
  updateBusinessName
} from '@/app/actions/business';
import { useToast } from '@/components/ui/use-toast';
import InputWithPrefix from '@/components/molecules/InputWithPrefix';
import { moderateText } from '@/app/actions/moderate';
import Typography from '@/components/molecules/Typography';
import { AddBusinessForm } from './new-business-form';
import { selectedBusinessIdAtom } from '@/utils/atoms';
import { useAtom } from 'jotai';
import useBusiness from '@/lib/hooks/use-businesses';
import { Input } from '@/components/ui/input';

export default function BrandForm() {
  const { toast } = useToast();
  const { businessData } = useBusiness();

  const [loading, setLoading] = useState(false);
  const [previousBusinessBio, setPreviousBusinessBio] = useState<any>(null); // TODO: type this
  const [url, setUrl] = useState<string>('');
  const [businesses, setBusinesses] = useState<any>([]); // TODO: type this
  const [selectedBusinessId, setSelectedBusinessId] = useAtom(
    selectedBusinessIdAtom
  );
  const [businessName, setBusinessName] = useState<string>('');
  const [businessBio, setBusinessBio] = useState<any>({
    ai_learned: '',
    business_summary: '',
    value_prop: '',
    brand_voice: '',
    seo_keywords: '',
    target_customer: ''
  });

  useEffect(() => {
    handleGetUserBusinesses();

    if (businessData) {
      setBusinessBio(businessData.bio);
      setPreviousBusinessBio(businessData.bio);
      setUrl(businessData.website_url || '');
      setBusinessName(businessData.name);
    }
  }, [businessData]);

  const handleSave = async () => {
    if (!selectedBusinessId) return;

    setLoading(true);

    try {
      const res = await saveBusinessBio(selectedBusinessId, businessBio);

      if (businessName) {
        await updateBusinessName(selectedBusinessId, businessName);
      }

      let websiteRes;
      if (url !== previousBusinessBio.website_url && res && url?.length > 1) {
        websiteRes = await handleUpdateWebsite(res.id);
      }

      if (res) {
        toast({
          title: 'Updated information successfully'
        });
      } else {
        throw new Error('Error saving bio');
      }
    } catch (e) {
      console.error('Error saving bio', e);
      toast({
        title: 'Error saving bio'
      });
    }

    setLoading(false);
  };

  const handleUpdateWebsite = async (id: string) => {
    if (!selectedBusinessId) return;

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
      body: JSON.stringify({
        url: url,
        businessId: selectedBusinessId,
        type: 'business website'
      })
    });

    const embedRes = await response.json();

    await updateWebsiteInBusinessBio(selectedBusinessId, url);

    if (embedRes) {
      return true;
    } else {
      return false;
    }
  };

  const handleGetUserBusinesses = async () => {
    const res = await getUserBusinesses();
    if (res) {
      setBusinesses(res);
    }
  };

  const handleAddNewBusiness = async () => {
    const existingBusinesses = await getUserBusinesses();

    if (existingBusinesses && existingBusinesses.length > 0) {
      toast({
        title: 'You have created the maximum number of businesses.',
        description: 'If you need more please reach out to support'
      });
    }
  };

  if (!businesses.length) {
    return (
      <div className="flex w-full flex-col justify-center py-4 max-w-xl gap-4">
        <div className="flex flex-col gap-2">
          <Typography size="lg" fontWeight="bold">
            Looks like you don't have any businesses yet.
          </Typography>
          <Typography size="base" fontWeight="normal">
            Add a business to get started.
          </Typography>
        </div>
        <AddBusinessForm />
      </div>
    );
  } else {
    return (
      <>
        <div className="md:absolute right-0 -top-4 flex flex-row justify-end md:mt-4 md:mb-0 mb-4">
          <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={handleAddNewBusiness}>
              Add new business
            </Button>
            <Button variant="default" loading={loading} onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="space-y-1">
            <Label htmlFor="business name">Business name</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="website">Business website</Label>
            <InputWithPrefix
              value={url}
              setValue={setUrl}
              prefix="https://www."
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="summary">Business summary</Label>
            <Textarea
              value={businessBio?.business_summary}
              onChange={(e) =>
                setBusinessBio({
                  ...businessBio,
                  business_summary: e.target.value
                })
              }
              id="summary"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="value_prop">Value prop</Label>
            <Textarea
              value={businessBio?.value_prop}
              onChange={(e) =>
                setBusinessBio({ ...businessBio, value_prop: e.target.value })
              }
              id="value_prop"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="writing_style">Brand voice</Label>
            <Textarea
              value={businessBio?.brand_voice}
              onChange={(e) =>
                setBusinessBio({ ...businessBio, brand_voice: e.target.value })
              }
              id="brand_voice"
            />
          </div>
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="keywords">SEO keywords</Label>
            <Textarea
              value={businessBio?.seo_keywords}
              onChange={(e) =>
                setBusinessBio({ ...businessBio, seo_keywords: e.target.value })
              }
              id="keywords"
            />
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-8 py-2">
          <div className="grid w-full gap-1.5 py-2">
            <Label htmlFor="target_customer">Target customer</Label>
            <Textarea
              value={businessBio?.target_customer}
              onChange={(e) =>
                setBusinessBio({
                  ...businessBio,
                  target_customer: e.target.value
                })
              }
              id="target_customer"
            />
          </div>
        </div>
      </>
    );
  }
}
