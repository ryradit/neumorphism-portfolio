'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { NeuButton } from './NeuButton';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 flex flex-col items-center">
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

          {/* Mobile Menu Toggle Button (3 dots) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full flex flex-col gap-0.5 items-center justify-center bg-transparent border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all text-black dark:text-white"
            title="Toggle Menu"
          >
            <span className="w-1 h-1 rounded-full bg-current"></span>
            <span className="w-1 h-1 rounded-full bg-current"></span>
            <span className="w-1 h-1 rounded-full bg-current"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg mt-2 p-6 rounded-3xl bg-white/95 dark:bg-black/95 border border-black/10 dark:border-white/5 shadow-2xl backdrop-blur-lg flex flex-col gap-1 z-40 md:hidden"
          >
            {navItems.map((item) => {
              const isActive = item.path === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-5 rounded-2xl text-[10px] uppercase tracking-widest font-heading font-bold transition-all ${
                    isActive 
                      ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white border-l-4 border-black dark:border-white pl-6' 
                      : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
