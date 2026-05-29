'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { NeuralNetworkGraph } from '@/components/NeuralNetworkGraph';
import { AIChatButton } from '@/components/AIChatButton';
import Link from 'next/link';
import { 
  SiPytorch, SiHuggingface, SiScikitlearn,
  SiNextdotjs, SiTypescript, SiJavascript,
  SiHtml5, SiTailwindcss, SiNodedotjs,
  SiPhp, SiPostgresql, SiMysql, SiSupabase,
  SiPython, SiOpenai, SiFastapi, SiDocker, SiJupyter, SiPandas, SiGit
} from 'react-icons/si';
import { FiCpu } from 'react-icons/fi';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const techCategories = [
  {
    title: "AI / Machine Learning (LLM, NLP, OCR)",
    skills: [
      { name: 'Python', icon: SiPython },
      { name: 'PyTorch', icon: SiPytorch },
      { name: 'Hugging Face', icon: SiHuggingface },
      { name: 'LangChain', icon: FiCpu },
      { name: 'LlamaIndex', icon: FiCpu },
      { name: 'OpenAI / Gemini', icon: SiOpenai },
      { name: 'EasyOCR / OCR', icon: FiCpu },
      { name: 'scikit-learn', icon: SiScikitlearn },
      { name: 'Pandas & NumPy', icon: SiPandas },
      { name: 'Jupyter Notebooks', icon: SiJupyter }
    ]
  },
  {
    title: "Full-Stack Development",
    skills: [
      { name: 'React & Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'FastAPI & Flask', icon: SiFastapi },
      { name: 'PHP', icon: SiPhp },
      { name: 'TailwindCSS', icon: SiTailwindcss },
      { name: 'HTML5 & CSS3', icon: SiHtml5 }
    ]
  },
  {
    title: "Databases & DevOps",
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MySQL', icon: SiMysql },
      { name: 'Supabase', icon: SiSupabase },
      { name: 'Docker', icon: SiDocker },
      { name: 'Git & GitHub', icon: SiGit }
    ]
  }
];

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // GSAP entrance staggers
    gsap.fromTo('.about-animate', 
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

      <div className="relative z-10 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-32">
        
        {/* Intro Section */}
        <section className="mb-24">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Column: Vision & Philosophy */}
            <div className="w-full lg:w-5/12 text-left about-animate">
              <span className="text-[10px] font-mono tracking-[0.25em] text-black/50 dark:text-white/50 uppercase mb-4 block">
                Vision & Engineering
              </span>
              
              <h1 className="text-3xl md:text-5xl font-black font-heading text-black dark:text-white tracking-tight leading-tight mb-6 uppercase">
                Redefining digital landscapes
              </h1>
              
              <p className="text-sm md:text-base leading-relaxed opacity-80 mb-8 max-w-md">
                Based on the cutting edge of digital design, we architect intelligent web systems that move beyond the screen. Our philosophy merges AI computational power with highly responsive user interfaces.
              </p>

              <Link href="/projects">
                <NeuButton className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl group flex items-center gap-2">
                  View Selected Works <span className="group-hover:translate-x-1 transition-transform">→</span>
                </NeuButton>
              </Link>
            </div>
            
            {/* Right Column: Dynamic Stacked Feature Cards */}
            <div className="w-full lg:w-7/12 flex flex-col gap-6 about-animate">
              {[
                {
                  title: "Digital Architecture",
                  description: "Mapping the flow of information into relative visual masterpieces.",
                  icon: "📐"
                },
                {
                  title: "Organic Fluidity",
                  description: "Transitions that feel natural, powered by advanced motion engines.",
                  icon: "🧪"
                },
                {
                  title: "Technical Mastery",
                  description: "Robust codebases that support high-end visual fidelity without compromise.",
                  icon: "⚙️"
                }
              ].map((item, index) => (
                <div key={index} className="group">
                  <NeuCard glass className="p-6 flex items-start gap-6 border-t border-t-black/5 dark:border-t-white/5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-heading text-black dark:text-white mb-1.5 uppercase tracking-wider">
                        {item.title}
                      </h3>
                      <p className="text-xs opacity-70 leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                    </div>
                  </NeuCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What I Do Section */}
        <section className="mb-24 about-animate">
          <h3 className="text-3xl font-bold mb-12 font-heading text-center uppercase tracking-tight">
            What I <span className="gradient-text font-black">Do</span>
          </h3>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Side: Services grid */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              {[
                {
                  title: "AI & Machine Learning",
                  description: "I develop intelligent systems using deep learning and NLP, creating AI solutions that can understand and generate human language for real-world applications.",
                  icon: "💡"
                },
                {
                  title: "Web Development",
                  description: "I build responsive and performant web applications with modern frameworks like React and Next.js, focusing on clean code and exceptional user experiences.",
                  icon: "🌐"
                },
                {
                  title: "Backend Engineering",
                  description: "I create robust backend systems and APIs that power seamless experiences, using Node.js and database technologies to build scalable architectures.",
                  icon: "⚙️"
                }
              ].map((service, index) => (
                <div key={index}>
                  <NeuCard glass className="border-l-4 border-l-black/30 dark:border-l-white/30 flex items-start gap-5 p-6">
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white shadow-inner`}>
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-heading font-semibold mb-2">{service.title}</h4>
                      <p className="text-sm opacity-80 leading-relaxed">{service.description}</p>
                    </div>
                  </NeuCard>
                </div>
              ))}
            </div>

            {/* Right Side: Interactive neural network visualizer */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="w-full max-w-lg p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-[#f0f2f5] dark:bg-[#0e1224] shadow-2xl relative">
                <div className="absolute top-4 right-6 font-mono text-[9px] uppercase tracking-widest opacity-40">AI Simulator</div>
                <NeuralNetworkGraph />
              </div>
            </div>
          </div>
        </section>
        
        {/* Tech Stack Container */}
        <section className="mb-12 about-animate">
          <h3 className="text-2xl font-black mb-12 font-heading text-center uppercase tracking-tight">Technologies & Frameworks</h3>
          
          <div className="flex flex-col gap-10">
            {techCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider text-black/60 dark:text-white/60 font-heading">
                  {category.title}
                </h4>
                <NeuCard inset className="p-8 bg-light-bg dark:bg-dark-bg">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {category.skills.map((skill, index) => {
                      const Icon = skill.icon;
                      return (
                        <motion.div 
                          key={index}
                          className="flex flex-col items-center"
                          whileHover={{ 
                            scale: 1.12,
                            y: -6,
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                          }}
                        >
                          <div 
                            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${
                              isDark 
                                ? 'bg-dark-bg shadow-neu-dark hover:shadow-neu-dark-inset text-white hover:text-white/80' 
                                : 'bg-light-bg shadow-neu-light hover:shadow-neu-light-inset text-black hover:text-black/80'
                            } border border-white/10 dark:border-white/5 transition-all duration-300`}
                          >
                            {Icon && <Icon className="text-2xl" />}
                          </div>
                          <span className="text-xs font-medium text-center opacity-80">{skill.name}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </NeuCard>
              </div>
            ))}
          </div>
        </section>

        <Footer />
        <AIChatButton />
      </div>
    </div>
  );
}
