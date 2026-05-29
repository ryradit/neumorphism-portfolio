'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function BackgroundBlobs() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Purple/Violet */}
      <motion.div
        className={`absolute top-[10%] left-[5%] w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-[80px] sm:blur-[120px] opacity-25 dark:opacity-30 ${
          isDark ? 'bg-violet-600' : 'bg-purple-300'
        }`}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2 - Cyan/Teal */}
      <motion.div
        className={`absolute bottom-[20%] right-[10%] w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full blur-[90px] sm:blur-[140px] opacity-20 dark:opacity-25 ${
          isDark ? 'bg-cyan-500' : 'bg-teal-200'
        }`}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -40, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />

      {/* Blob 3 - Pink/Fuchsia */}
      <motion.div
        className={`absolute top-[40%] right-[30%] w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-[80px] sm:blur-[110px] opacity-15 dark:opacity-20 ${
          isDark ? 'bg-fuchsia-600' : 'bg-pink-300'
        }`}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 60, -30, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
