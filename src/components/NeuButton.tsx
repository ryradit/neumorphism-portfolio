// src/components/NeuButton.tsx
'use client';

import { useTheme } from 'next-themes';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

interface NeuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function NeuButton({ 
  children, 
  className, 
  variant = 'primary',
  disabled,
  ...props 
}: NeuButtonProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className={classNames(
        'neu-btn',
        isDark ? 'neu-btn-dark' : 'neu-btn-light',
        variant === 'primary' && (isDark ? 'text-dark-accent' : 'text-light-accent'),
        disabled && 'opacity-70 cursor-not-allowed hover:shadow-none',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
