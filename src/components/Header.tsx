'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { NeuButton } from './NeuButton';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 flex justify-center">
      <div className={`flex justify-between items-center transition-all duration-300 w-full max-w-4xl px-8 backdrop-blur-md ${
        isScrolled 
          ? 'py-3 rounded-full bg-white/80 dark:bg-black/85 shadow-lg border border-black/10 dark:border-white/5' 
          : 'py-4 rounded-full bg-white/40 dark:bg-black/45 border border-black/5 dark:border-white/5 shadow-sm'
      }`}>
        {/* Brand Name */}
        <Link 
          href="/" 
          className="text-sm font-black font-heading tracking-widest text-black dark:text-white cursor-pointer select-none uppercase"
        >
          RYRADIT
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex gap-6 justify-center items-center">
          {navItems.map((item) => {
            const isActive = item.path === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`transition-colors font-heading text-[10px] uppercase tracking-wider font-semibold cursor-pointer relative py-1.5 ${
                  isActive 
                    ? 'text-black dark:text-white' 
                    : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.span 
                    className={`absolute -bottom-0.5 left-0 w-full h-0.5 rounded-full ${
                      isDark ? 'bg-white' : 'bg-black'
                    }`}
                    layoutId="activeNavIndicatorGlobal"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Actions Menu */}
        <div className="flex items-center gap-3">
          <Link href="/contact">
            <NeuButton 
              className="hidden sm:block text-[9px] uppercase font-bold tracking-wider px-3.5 py-1.5 rounded-full"
            >
              Get In Touch
            </NeuButton>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
