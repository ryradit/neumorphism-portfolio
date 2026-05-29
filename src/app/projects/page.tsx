'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { AIChatButton } from '@/components/AIChatButton';
import Link from 'next/link';

export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // GSAP entrance staggers
    gsap.fromTo('.projects-animate', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.12, 
        ease: 'power3.out',
        delay: 0.15
      }
    );
  }, []);

  // Card Tilt Effect
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const angleX = (yc - y) / 15;
    const angleY = (x - xc) / 15;
    
    gsap.to(card, {
      rotateX: angleX,
      rotateY: angleY,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.4,
      boxShadow: isDark
        ? '8px 8px 24px rgba(0,0,0,0.5), -8px -8px 24px rgba(255,255,255,0.03)'
        : '8px 8px 24px rgba(163,177,198,0.5), -8px -8px 24px rgba(255,255,255,0.8)'
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.5,
      boxShadow: isDark
        ? '3px 3px 6px #101426, -3px -3px 6px #242b48'
        : '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff'
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <BackgroundBlobs />
      <Header />

      <div className="relative z-10 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-32">
        {/* Projects Intro Header */}
        <section className="mb-16 projects-animate">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-black/50 dark:text-white/50 uppercase mb-2 block">
                Selected Works
              </span>
              <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-black dark:text-white uppercase leading-none">
                LATEST PROJECTS
              </h1>
            </div>
            <button 
              onClick={() => window.open('https://github.com/ryradit', '_blank')}
              className="text-xs font-mono uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white border-b border-black/20 dark:border-white/20 pb-1"
            >
              View All Archives ↗
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Project 1: Tall Mechanical/AI Render (Col-span 2, Row-span 2) */}
            <div 
              className="md:col-span-2 md:row-span-2 group relative flex flex-col justify-between"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <NeuCard glass className="h-full p-6 border-t border-t-black/5 dark:border-t-white/5 relative flex flex-col justify-between">
                <div>
                  <div className="border border-black/10 dark:border-white/10 p-3 mb-6 bg-[#f0f2f5] dark:bg-[#0e1224] shadow-inner rounded-[24px] overflow-hidden group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors duration-300">
                    <div className="h-96 md:h-[450px] rounded-[16px] overflow-hidden relative border border-black/5 dark:border-white/5 bg-black/5">
                      <Image
                        src="/futurexp.png"
                        alt="Future XP - Digital Experience"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50 block mb-1">
                      Exhibit 01 // 2025 // Web Platform
                    </span>
                    <h3 className="text-2xl font-black font-heading tracking-tight text-black dark:text-white leading-tight">
                      FUTURE XP
                    </h3>
                  </div>
                  <p className="mb-6 text-xs opacity-70 leading-relaxed font-sans">
                    A next-generation interactive digital experience and web application showcasing advanced user interface designs, smooth animations, and high-fidelity user flows.
                  </p>
                </div>
                <div className="flex gap-4">
                  <NeuButton 
                    onClick={() => window.open('#', '_blank')}
                    className="text-[10px] px-6 py-2 uppercase font-bold tracking-wider"
                  >
                    View Project
                  </NeuButton>
                </div>
              </NeuCard>
            </div>

            {/* Project 2: Top Right Cube (Col-span 2, Row-span 1) */}
            <div 
              className="md:col-span-2 md:row-span-1 group relative flex flex-col justify-between"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <NeuCard glass className="h-full p-6 border-t border-t-black/5 dark:border-t-white/5 relative flex flex-col justify-between">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/2 border border-black/10 dark:border-white/10 p-3 bg-[#f0f2f5] dark:bg-[#0e1224] shadow-inner rounded-[24px] overflow-hidden group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors duration-300">
                    <div className="h-44 rounded-[16px] overflow-hidden relative border border-black/5 dark:border-white/5 bg-black/5">
                      <Image
                        src="/wonderfulindo.png"
                        alt="Wonderful Indonesia - Travel Planner"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50 block mb-1">
                      Exhibit 02 // 2025 // Web Simulation
                    </span>
                    <h3 className="text-lg font-black font-heading tracking-tight text-black dark:text-white leading-tight mb-2">
                      WONDERFUL INDONESIA AI
                    </h3>
                    <p className="text-xs opacity-70 leading-relaxed font-sans mb-4">
                      An AI-powered travel composition platform generating bespoke, curated journeys across the Indonesian archipelago.
                    </p>
                    <NeuButton 
                      onClick={() => window.open('https://wonderfulindonesia.dreamhosters.com/', '_blank')}
                      className="text-[10px] px-6 py-2 uppercase font-bold tracking-wider"
                    >
                      Explore
                    </NeuButton>
                  </div>
                </div>
              </NeuCard>
            </div>

            {/* Project 3: Bottom Middle Watch (Col-span 1, Row-span 1) */}
            <div 
              className="md:col-span-1 md:row-span-1 group relative flex flex-col justify-between"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <NeuCard glass className="h-full p-5 border-t border-t-black/5 dark:border-t-white/5 relative flex flex-col justify-between">
                <div>
                  <div className="border border-black/10 dark:border-white/10 p-2.5 mb-4 bg-[#f0f2f5] dark:bg-[#0e1224] shadow-inner rounded-[20px] overflow-hidden group-hover:border-black/30 dark:group-hover:border-white/30 transition-colors duration-300">
                    <div className="h-32 rounded-[12px] overflow-hidden relative border border-black/5 dark:border-white/5 bg-black/5">
                      <Image
                        src="/dlob.png"
                        alt="DLOB Community - Badminton Platform"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50 block mb-1">
                    Exhibit 03 // 2025
                  </span>
                  <h3 className="text-sm font-black font-heading tracking-tight text-black dark:text-white leading-tight mb-1">
                    DLOB COMMUNITY
                  </h3>
                  <p className="text-[10px] opacity-75 leading-relaxed font-sans line-clamp-2">
                    A smart badminton community platform automating attendance tracking and matching.
                  </p>
                </div>
                <NeuButton 
                  onClick={() => window.open('https://www.dlobcommunity.com/beranda', '_blank')}
                  className="text-[9px] px-4 py-1.5 uppercase font-bold tracking-wider mt-4"
                >
                  Link
                </NeuButton>
              </NeuCard>
            </div>

            {/* Project 4: Start Your Project (Col-span 1, Row-span 1) */}
            <div 
              className="md:col-span-1 md:row-span-1 group relative flex flex-col justify-between"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <Link href="/contact" className="h-full">
                <NeuCard 
                  glass 
                  className="h-full p-5 border-2 border-dashed border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 transition-colors duration-300 relative flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
                >
                  <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-xl bg-black/5 dark:bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                    ➕
                  </div>
                  <h3 className="text-xs font-black font-heading tracking-widest text-black dark:text-white uppercase mb-1">
                    START YOUR PROJECT
                  </h3>
                  <p className="text-[9px] opacity-50 max-w-[120px] leading-normal font-sans">
                    Let&apos;s architect something amazing together.
                  </p>
                </NeuCard>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
        <AIChatButton />
      </div>
    </div>
  );
}
