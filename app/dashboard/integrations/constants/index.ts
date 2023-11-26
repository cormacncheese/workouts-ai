import { Integration } from '@/types/custom';

export const INTEGRATIONS: Integration[] = [
  {
    id: 'notion',
    carbonKey: 'NOTION',
    iconUrl:
      'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/integrations/notion-icon.png',
    name: 'Notion',
    description:
      'Connect your documents and notes. Syncing documents can take up to 45 minutes.',
    available: true
  },
  {
    id: 'google_drive',
    carbonKey: 'GOOGLE_DRIVE',
    iconUrl:
      'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/integrations/google-drive-icon.png',
    name: 'Google Drive',
    description:
      'Sync your files and folders. Documents typically sync withing 60 seconds.',
    available: true
  },
  {
    id: 'intercom',
    carbonKey: 'INTERCOM',
    iconUrl:
      'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/integrations/intercom-icon.png',
    name: 'Intercom',
    description: 'Select pages from Intercom and ask questions.',
    available: true
  },
  {
    id: 'gmail',
    carbonKey: null,
    iconUrl:
      'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/integrations/gmail-icon.png',
    name: 'Gmail',
    description: 'Summarize your emails and get notified of important ones.',
    available: false
  },
  {
    id: 'google-calendar',
    carbonKey: null,
    iconUrl:
      'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/integrations/gcal-icon.png',
    name: 'Google Calendar',
    description:
      'Keep track of your schedule and get notified of upcoming events.',
    available: false
  },
  {
    id: 'github',
    carbonKey: 'GITHUB',
    iconUrl:
      'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/elements/integrations/github-icon.png',
    name: 'Github',
    description: 'Connect your codebase to improve your stack in real time.',
    available: false
  }
];
