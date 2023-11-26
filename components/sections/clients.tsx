import Image from 'next/image';
import Particles from '../utils/particles';
import HorizontalAutoScroll from '@/components/molecules/HorizontalAutoScroll';
import Typography from '@/components/molecules/Typography';

const Client01 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-01.png';
const Client02 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-02.png';
const Client03 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-03.png';
const Client04 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-04.png';
const Client05 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-05.png';
const Client06 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-06.png';
const Client07 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-07.png';
const Client08 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-08.png';
const Client09 =
  'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/landing/client-09.png';

export default function Clients() {
  return (
    <section>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 ">
        {/* Particles animation */}
        <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-6">
          <Particles className="absolute inset-0 -z-10" quantity={5} />
        </div>

        <div className="py-12 md:pb-10 md:pt-6">
          <Typography
            size="sm"
            fontWeight="normal"
            className="text-center dark:text-muted mb-6"
          >
            Integrations
          </Typography>
          <HorizontalAutoScroll>
            {[
              Client01,
              Client09,
              Client04,
              Client05,
              Client06,
              Client03,
              Client07,
              Client08,
              Client02
            ].map((client, index) => (
              <div key={index} className="relative h-8">
                <Image
                  src={client}
                  alt={`Client ${index + 1}`}
                  className="w-auto px-10 h-6 fade-in"
                  width={180}
                  height={30}
                  quality={70}
                  blurDataURL={client}
                  placeholder="blur"
                />
              </div>
            ))}
          </HorizontalAutoScroll>
        </div>
      </div>
    </section>
  );
}
