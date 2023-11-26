'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Typography from '@/components/molecules/Typography';

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function AnimatedHeroText() {
  const words = [
    'Notion',
    'PDFs',
    'Google Docs',
    'Spreadsheets',
    'Intercom',
    'Websites',
    'CSVs'
  ];

  shuffleArray(words); // Shuffle the words array

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change words every 2 seconds

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <Typography
        fontWeight="semibold"
        className="dark:text-primary md:text-6xl text-5xl mb-2 md:text-left"
      >
        Chat with your data
        {/* <AnimatePresence mode="wait">
          {words.map(
            (word, i) =>
              i === index && (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-brand underline"
                >
                  {' '}
                  {word}
                </motion.span>
              )
          )}
        </AnimatePresence> */}
      </Typography>
    </div>
  );
}
