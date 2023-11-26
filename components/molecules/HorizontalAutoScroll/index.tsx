'use client';

import { ReactNode } from 'react';
import Marquee from 'react-fast-marquee';

interface Props {
  children: ReactNode[];
}

export default function HorizontalAutoScroll({ children }: Props) {
  return <Marquee>{children}</Marquee>;
}
