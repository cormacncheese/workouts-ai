import React from 'react';
import { useLottie } from 'lottie-react';
import groovyWalkAnimation from '@/public/animations/pulse-circle.json';

type Props = {
  height?: string;
  width?: string;
};

export default function PulseLoader({ height, width }: Props) {
  const options = {
    animationData: groovyWalkAnimation,
    loop: true
  };

  const { View } = useLottie(options);

  return <div className={`${height} ${width}`}>{View}</div>;
}
