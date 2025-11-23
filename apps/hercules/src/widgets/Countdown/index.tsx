'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { CountdownSchema } from './schema';
import { cn } from '@/lib/utils';

type CountdownProps = z.infer<typeof CountdownSchema>;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = (props: { data: CountdownProps }) => {
  const { targetDate, textColor, backgroundColor, endMessage } = props.data;
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    const timer = setInterval(() => {
      const left = calculateTimeLeft();
      if (left) {
        setTimeLeft(left);
        setIsEnded(false);
      } else {
        setTimeLeft(null);
        setIsEnded(true);
        clearInterval(timer);
      }
    }, 1000);

    // Initial calculation
    const initial = calculateTimeLeft();
    if (initial) {
      setTimeLeft(initial);
    } else {
      setIsEnded(true);
    }

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) {
    return null; 
  }

  if (isEnded) {
    return (
      <div className={cn("text-center p-4 font-bold text-xl", textColor, backgroundColor)}>
        {endMessage}
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  return (
    <div className={cn("flex justify-center gap-4 p-4", backgroundColor)}>
      <TimeUnit value={timeLeft.days} label="天" color={textColor} />
      <TimeUnit value={timeLeft.hours} label="时" color={textColor} />
      <TimeUnit value={timeLeft.minutes} label="分" color={textColor} />
      <TimeUnit value={timeLeft.seconds} label="秒" color={textColor} />
    </div>
  );
};

const TimeUnit = ({ value, label, color }: { value: number, label: string, color: string }) => (
  <div className="flex flex-col items-center">
    <div className={cn("text-3xl font-bold font-mono", color)}>
      {value.toString().padStart(2, '0')}
    </div>
    <div className={cn("text-sm opacity-80", color)}>{label}</div>
  </div>
);

