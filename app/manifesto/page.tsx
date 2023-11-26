import ManifestoSection from './components/manifesto-section';
import SubpageLayout from '@/components/home-layout';

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://tellmaia.com'
  ),
  openGraph: {
    title: 'Zenbase manifesto',
    description:
      'We propose a new revolution, a one in which mindless unfulfilling work becomes a thing of the past. A world in which we spend more time imagining, connecting and creating.',
    images: [
      {
        url:
          'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/manifesto/maia_manifesto_opengraph.png',
        width: 800,
        height: 600
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
};

export default async function ManifestoPage() {
  return (
    <SubpageLayout>
      <ManifestoSection />
    </SubpageLayout>
  );
}
