'use client';

import { motion } from 'framer-motion';
import GetStartedButton from '@/components/molecules/GetStartedButton';

const meta = {
  title: 'Zenbase manifesto',
  description:
    'We propose a new revolution, a one in which mindless unfulfilling work becomes a thing of the past. A world in which we spend more time imagining, connecting and creating.',
  cardImage:
    'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/twitter_open_graph.png'
};

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://zenbase.dev/'
  ),
  openGraph: {
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: meta.cardImage,
        width: 800,
        height: 600
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
    creator: '@tellmaia_to',
    images: [meta.cardImage]
  }
};

export default function ManifestoSection() {
  return (
    <>
      <motion.div
        className="text-white p-20 min-h-screen flex justify-center items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl">
          Humans are designed for creativity, we are not machines
        </h1>
      </motion.div>

      {/* Blurred shape */}
      <div
        className="absolute bottom-0 -mb-20 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none"
        aria-hidden="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
          <defs>
            <linearGradient
              id="bs2-a"
              x1="19.609%"
              x2="50%"
              y1="14.544%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bs2-a)"
            fillRule="evenodd"
            d="m346 898 461 369-284 58z"
            transform="translate(-346 -898)"
          />
        </svg>
      </div>

      <div className=" text-white p-20 min-h-screen">
        <h1 className="text-5xl ">
          Since the dawn of humanity humans have labored in fields, alongside
          conveyer belts and behind desks, breaking their backs – victims to the
          clock to earn an everyday living.{' '}
        </h1>
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <h1 className="text-5xl text-right">
          But this isn’t what we were made for.{' '}
        </h1>
        {/* <p className="text-xl">This is a description for section 3.</p> */}

        {/* Blurred shape */}
        <div className="absolute right-0 top-0 blur-2xl" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="342" height="393">
            <defs>
              <linearGradient
                id="bs-a"
                x1="19.609%"
                x2="50%"
                y1="14.544%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs-a)"
              fillRule="evenodd"
              d="m104 .827 461 369-284 58z"
              transform="translate(0 -112.827)"
              opacity=".7"
            />
          </svg>
        </div>
      </div>

      <div className="text-white p-20 min-h-screen">
        <h1 className="text-5xl italic">
          The best of humanity lives in the world of collaboration, creativity,
          exploration and discovery. We have spent so much of our time doing
          manual labor we have forgotten what it means to be human.
        </h1>
        {/* <p className="text-xl">This is a description for section 3.</p> */}
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <p className="text-xl">
          Progress and computers have not damaged our quality of life. On the
          contrary personal computers and the last decades have brought society
          tremendous freedom and improvements of life. The personal computer
          allowed anyone to connect with and access any information from
          anywhere in the world. With each revolution comes more personal
          freedom.
        </p>

        {/* Blurred shape */}
        <div
          className="absolute top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
            <defs>
              <linearGradient
                id="bs3-a"
                x1="19.609%"
                x2="50%"
                y1="14.544%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs3-a)"
              fillRule="evenodd"
              d="m410 0 461 369-284 58z"
              transform="matrix(1 0 0 -1 -410 427)"
            />
          </svg>
        </div>
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <h1 className="text-5xl ">
          We are proposing a new revolution, a one in which mindless
          unfulfilling work becomes a thing of the past. A world in which we
          spend more time imagining, connecting and creating.
        </h1>
        <p className="text-xl mt-6">
          The more you use it the better you become
        </p>

        {/* Blurred shape */}
        <div
          className="absolute top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 blur-2xl opacity-50 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
            <defs>
              <linearGradient
                id="bs3-a"
                x1="19.609%"
                x2="50%"
                y1="14.544%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs3-a)"
              fillRule="evenodd"
              d="m410 0 461 369-284 58z"
              transform="matrix(1 0 0 -1 -410 427)"
            />
          </svg>
        </div>
      </div>

      <div className=" text-white p-20 min-h-screen relative">
        <h1 className="text-5xl text-center">
          We do not settle for mediocrity, instead we rally around and support
          the best of human achievement because we know this is what improves
          the world for us all.
        </h1>

        {/* Blurred shape */}
        <div
          className="absolute top-0 -mt-24 left-0 -ml-16 blur-2xl opacity-70 pointer-events-none -z-10"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="434" height="427">
            <defs>
              <linearGradient
                id="bs4-a"
                x1="19.609%"
                x2="50%"
                y1="14.544%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#bs4-a)"
              fillRule="evenodd"
              d="m0 0 461 369-284 58z"
              transform="matrix(1 0 0 -1 0 427)"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-center mb-60 ">
        <div className="w-40">
          <GetStartedButton />
        </div>
      </div>
    </>
  );
}
