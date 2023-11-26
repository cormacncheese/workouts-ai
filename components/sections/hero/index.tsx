'use client';

import Image from 'next/image';
import Particles from '../../utils/particles';
import Illustration from '@/public/images/glow-bottom.svg';
import LearnMoreButton from './components/LearnMoreButton';
import GetStartedButton from '@/components/molecules/GetStartedButton';
import AnimatedHeroText from './animated-hero-text';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import Typography from '@/components/molecules/Typography';

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section id="hero">
      <div className="relative w-full mx-auto overflow-hidden h-full ">
        {/* Particles animation */}
        <Particles className="absolute inset-0 -z-10" />

        {/* Illustration */}
        <div
          className="absolute inset-0 -z-10 -mx-28 rounded-b-[3rem] pointer-events-none s"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 -z-10 opacity-20">
            <Image
              src={Illustration}
              className="max-w-none"
              width={2146}
              priority
              alt="Hero Illustration"
            />
          </div>
        </div>

        <div className="flex md:grid grid-cols-2 flex-col justify-center items-center md:px-8 px-4 md:min-h-[70vh] min-h-[80vh]  md:mt-0 mt-24">
          {/* Hero content */}
          <div className="flex md:justify-center flex-col md:text-left justify-center col-span-1 md:pr-20 md:pl-4 md:px-0 px-2 pt-10">
            <AnimatedHeroText />

            <Typography
              size="base"
              fontWeight="normal"
              className="!text-secondaryMuted mb-6"
            >
              The universal app that keeps track of everything for you and
              unlocks hidden insights.
            </Typography>

            <div className="flex md:flex-row flex-col-reverse md:items-start md:justify-start justify-center items-center w-full gap-4 mt-6 md:pr-20">
              <LearnMoreButton />

              <GetStartedButton />
            </div>
          </div>

          <div className="flex justify-center w-full md:mt-0 mt-8 col-span-1 p-4">
            <ReactPlayer
              url="https://www.youtube.com/embed/gdAmszW8ljM?si=susKx3TGzuu3hPx4"
              controls={false}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
