'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { ContactForm } from '@/components/ContactForm';
import { AIChatButton } from '@/components/AIChatButton';
import { gsap } from 'gsap';

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // GSAP entrance staggers
    gsap.fromTo('.contact-animate', 
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <BackgroundBlobs />
      <Header />

      <div className="relative z-10 py-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-32">
        {/* Title */}
        <div className="text-center mb-16 contact-animate">
          <span className="text-[10px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50 block mb-2">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-black dark:text-white uppercase leading-none">
            COLLABORATE WITH RYAN
          </h1>
        </div>

        {/* Contact Section & Big CTA Banner */}
        <section className="mb-12 contact-animate">
          <div className="w-full relative bg-black text-white rounded-3xl p-10 md:p-14 text-center overflow-hidden shadow-2xl mb-16">
            <h2 className="text-2xl md:text-4xl font-black font-heading leading-tight mb-4 tracking-tight uppercase max-w-xl mx-auto text-white">
              Ready to enter the <br className="hidden md:block" /> new digital universe?
            </h2>
            
            <p className="text-xs text-white/70 max-w-sm mx-auto mb-8 font-sans leading-relaxed">
              We are currently accepting new high-impact projects for Q4 2026. Let&apos;s build something that echoes the future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NeuButton 
                onClick={() => window.open('mailto:ryradit@gmail.com?subject=Project%20Inquiry', '_blank')}
                className="px-8 py-3 text-xs uppercase font-bold tracking-wider rounded-xl bg-white text-black hover:bg-white/90 shadow-md w-full sm:w-auto"
              >
                Send a Brief
              </NeuButton>
              <NeuButton 
                onClick={() => window.open('mailto:ryradit@gmail.com', '_blank')}
                className="px-8 py-3 text-xs uppercase font-bold tracking-wider rounded-xl bg-transparent text-white border border-white/20 hover:bg-white/5 shadow-md w-full sm:w-auto"
              >
                Send an Email
              </NeuButton>
            </div>
          </div>

          {/* Contact Form Container */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs opacity-50 mb-6 uppercase tracking-widest font-mono">Or leave a message directly</p>
            <NeuCard glass className="p-8">
              <ContactForm isDark={isDark} />
            </NeuCard>
          </div>
        </section>

        <Footer />
        <AIChatButton />
      </div>
    </div>
  );
}
