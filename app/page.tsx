import Pricing from '@/components/molecules/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import Hero from '@/components/sections/hero';
import Clients from '@/components/sections/clients';
import Features01 from '@/components/sections/features-01';
import Features02 from '@/components/sections/features-02';
import Features03 from '@/components/sections/features-03';
import Features04 from '@/components/sections/features-04';
import Features05 from '@/components/sections/features-06';
import Features06 from '@/components/sections/features-05';
import Testimonials from '@/components/sections/testimonials';
import Cta from '@/components/sections/cta';
import Footer from '@/components/sections/footer';
import Navbar from '@/components/molecules/HomeNavbar';

import '@/styles/global.css';

export default async function HomePage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <>
      <Navbar />
      <Hero />
      <Clients />
      <Features01 />
      <Features02 />
      <Features03 />
      <Features04 />
      <Features05 />
      <Features06 />
      <Pricing
        session={session}
        user={session?.user}
        products={products}
        subscription={subscription}
      />
      <Testimonials />
      <Cta />
      <Footer />
    </>
  );
}
