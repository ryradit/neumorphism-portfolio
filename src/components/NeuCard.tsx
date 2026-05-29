// src/components/NeuCard.tsx
'use client';

import { useTheme } from 'next-themes';
import { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

interface NeuCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  inset?: boolean;
  glass?: boolean;
}

export function NeuCard({ 
  children, 
  className, 
  inset = false,
  glass = false,
  ...props 
}: NeuCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={classNames(
        'neu-card',
        glass 
          ? (isDark ? 'neu-card-glass-dark' : 'neu-card-glass-light')
          : (isDark ? 'neu-card-dark' : 'neu-card-light'),
        inset && (isDark ? 'shadow-neu-dark-inset' : 'shadow-neu-light-inset'),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
