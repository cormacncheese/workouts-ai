'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Props = {
  className?: string;
};

export default function GetStartedButton({ className }: Props) {
  return (
    <div className={className}>
      <Link href="/auth/signin" legacyBehavior passHref>
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.5 }}>
          <Button className={className}>Get Started</Button>
        </motion.div>
      </Link>
    </div>
  );
}
