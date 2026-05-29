'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NeuButton } from '@/components/NeuButton';
import { AIChatButton } from '@/components/AIChatButton';
import { useMagnetic } from '@/hooks/useMagnetic';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  // Magnetic elements
  const downloadCvRef = useMagnetic<HTMLButtonElement>(0.25);
  const githubRef = useMagnetic<HTMLAnchorElement>(0.35);
  const linkedinRef = useMagnetic<HTMLAnchorElement>(0.35);
  const mailRef = useMagnetic<HTMLAnchorElement>(0.35);

  useEffect(() => {
    setMounted(true);

    // Hero entrance animations
    gsap.fromTo('.hero-animate', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.12, 
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <BackgroundBlobs />
      <Header />

      <div className="relative z-10 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center gap-12 mb-20 pt-28 md:pt-36 min-h-[80vh] relative">
          <div className="w-full max-w-4xl mx-auto">
            <div className="hero-animate flex justify-center items-center gap-2 mb-6 text-[10px] font-mono tracking-[0.25em] text-black/50 dark:text-white/50 uppercase">
              <span>Architectural Designs</span>
            </div>
            
            <h1 className="hero-animate text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-[1.05] text-black dark:text-white uppercase mb-6 max-w-4xl mx-auto">
              Hi, I&apos;m Ryan — <br className="hidden md:block" /> your new AI colleague
            </h1>
            
            <p className="hero-animate mb-10 text-sm md:text-base leading-relaxed max-w-2xl mx-auto opacity-75 font-sans">
              Ryan will continuously architect intelligent models, craft highly tactile interfaces, and deploy autonomic agents that transform human-machine collaboration.
            </p>
            
            <div className="hero-animate flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Link href="/about">
                <NeuButton 
                  ref={downloadCvRef}
                  className="px-8 py-3.5 text-xs uppercase font-bold tracking-wider rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 shadow-lg"
                >
                  Explore About Ryan
                </NeuButton>
              </Link>
              
              {/* Avatar stack */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((num) => (
                    <div 
                      key={num} 
                      className="w-7 h-7 rounded-full border border-white dark:border-[#0b0f19] bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative shadow-sm"
                    >
                      <Image 
                        src={`/myphoto${num}.jpg`}
                        alt="Collaborator avatar"
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-black dark:text-white leading-tight">+540 Deployments</div>
                  <div className="text-[9px] opacity-60 leading-none">Global research & commercial systems</div>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Portrait Canvas with Floating Cards */}
          <div className="hero-animate flex flex-col justify-center items-center w-full relative max-w-sm mx-auto overflow-visible mt-[-48px] md:mt-[-120px]">
            <div className="relative w-full aspect-[3/4] overflow-visible">
              <div className="relative w-full h-full overflow-hidden">
                <Image 
                  src="/myphoto1-jukebox-bg-removed.png" 
                  alt="Ryradit - Portfolio Exhibition" 
                  fill 
                  priority
                  className="object-contain object-top scale-[2.4] origin-top translate-y-[-65%]" 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Floating Overlay Card 1 */}
              <div className="absolute top-12 left-[-110px] hidden lg:block w-[200px] p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e1224]/95 shadow-xl text-left z-20">
                <div className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-0.5">99.8% System Accuracy</div>
                <div className="text-[9px] opacity-60 mb-2">Confidence metric this week</div>
                <div className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[99.8%] h-full bg-black dark:bg-white rounded-full" />
                </div>
              </div>

              {/* Floating Overlay Card 2 */}
              <div className="absolute bottom-16 left-[-130px] hidden lg:block w-[190px] p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e1224]/95 shadow-xl text-left z-20">
                <div className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-0.5">Model Inference</div>
                <div className="text-lg font-black text-black dark:text-white leading-none">
                  0.1s latency <span className="inline-block w-1.5 h-3.5 bg-black dark:bg-white ml-1 animate-pulse" />
                </div>
              </div>

              {/* Floating Overlay Card 3 */}
              <div className="absolute top-1/4 right-[-150px] hidden lg:block w-[260px] p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0e1224]/95 shadow-xl text-left z-20">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0 relative border border-black/5">
                    <Image src="/myphoto2.jpg" alt="Daniel" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-black/50 dark:text-white/50 flex items-center gap-1 uppercase tracking-wider mb-0.5">
                      <span>↩ daniel replied</span>
                    </div>
                    <div className="text-[9px] leading-relaxed text-black dark:text-white font-sans">
                      &quot;Sounds good, let&apos;s deploy the system into production tomorrow.&quot;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links under the portrait */}
            <div className="flex gap-4 mt-8 justify-center items-center">
              {[
                { Icon: FiGithub, href: 'https://github.com/ryradit', label: 'GitHub', ref: githubRef },
                { Icon: FiLinkedin, href: 'https://linkedin.com/in/ryan-radityatama', label: 'LinkedIn', ref: linkedinRef },
                { Icon: FiMail, href: 'mailto:ryradit@gmail.com', label: 'Email', ref: mailRef },
              ].map(({Icon, href, label, ref: elRef}, index) => (
                <motion.a
                  key={index}
                  ref={elRef}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-3.5 rounded-full ${
                    isDark 
                      ? 'bg-dark-bg shadow-neu-dark hover:shadow-neu-dark-inset text-white' 
                      : 'bg-light-bg shadow-neu-light hover:shadow-neu-light-inset text-black'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic features links row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 hero-animate">
          <Link href="/projects" className="group">
            <div className="p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest opacity-50 block mb-2">Exhibits & Engineering</span>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-black dark:text-white">Selected Projects →</h3>
              <p className="text-xs opacity-70 leading-relaxed font-sans">Explore asymmetric works from AI simulations, mechanical interactions, to custom badminton club organizers.</p>
            </div>
          </Link>
          <Link href="/blog" className="group">
            <div className="p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest opacity-50 block mb-2">Thoughts & Development</span>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-black dark:text-white">Blog & Publications →</h3>
              <p className="text-xs opacity-70 leading-relaxed font-sans">Insights on autonomic agents, full-stack architecture, and clean design patterns co-authored with LLMs.</p>
            </div>
          </Link>
        </section>

        {/* Logo Ribbon */}
        <div className="w-screen relative left-1/2 right-1/2 -translate-x-1/2 bg-black py-5 overflow-hidden select-none mb-12 z-20">
          <div className="flex justify-around items-center max-w-7xl mx-auto px-6 text-white text-[10px] font-mono uppercase tracking-[0.25em] opacity-80">
            <div className="flex items-center gap-2">
              <span className="text-[8px]">●</span>
              <span>AI Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px]">▲</span>
              <span>Digital Architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px]">■</span>
              <span>Organic Fluidity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px]">◆</span>
              <span>Technical Mastery</span>
            </div>
          </div>
        </div>

        <Footer />
        <AIChatButton />
      </div>
    </div>
  );
}
