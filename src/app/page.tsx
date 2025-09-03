'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { ContactForm } from '@/components/ContactForm';
import { AIChatButton } from '@/components/AIChatButton';
import { useTheme } from 'next-themes';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { 
  SiPytorch, SiHuggingface, SiScikitlearn, SiNumpy,
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiHtml5, SiCss3, SiTailwindcss, SiNodedotjs,
  SiPhp, SiPostgresql, SiMysql, SiFirebase, SiSupabase
} from 'react-icons/si';

// Map skill names to their corresponding icons
const skillIconMap = {
  'PyTorch': SiPytorch,
  'Hugging Face': SiHuggingface,
  'scikit-learn': SiScikitlearn,
  'NumPy': SiNumpy,
  'Matplotlib': SiNumpy, // Using NumPy icon as a fallback for Matplotlib
  'React': SiReact,
  'Next.js': SiNextdotjs,
  'TypeScript': SiTypescript,
  'JavaScript': SiJavascript,
  'HTML5': SiHtml5,
  'CSS3': SiCss3,
  'Tailwind': SiTailwindcss,
  'Node.js': SiNodedotjs,
  'PHP': SiPhp,
  'PostgreSQL': SiPostgresql,
  'MySQL': SiMysql,
  'Firebase': SiFirebase,
  'Supabase': SiSupabase
};

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Function to scroll to section with offset
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Calculate offset (header height + some padding)
      const offset = 100;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: sectionTop - offset,
        behavior: 'smooth'
      });
      
      // Set active section
      setActiveSection(sectionId);
    }
  };
  
  // Add scroll event listener and check active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const sections = ['home', 'about', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Consider a section active when its top part is in the viewport
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      {/* Header */}
      <header className={`flex justify-center items-center mb-12 relative py-6 px-6 md:px-12 lg:px-24 w-full z-50 transition-all duration-300 ${
        isScrolled ? `fixed top-0 left-0 right-0 ${isDark ? 'bg-dark-bg/90 shadow-md backdrop-blur-sm' : 'bg-light-bg/90 shadow-md backdrop-blur-sm'}` : ''
      }`}>
        {/* Portfolio text removed from top left */}
        
        <nav className="hidden md:flex gap-8 justify-center">
          {['Home', 'About', 'Projects', 'Contact'].map((item, index) => {
            const sectionId = item.toLowerCase();
            const isActive = activeSection === sectionId;
            
            return (
              <motion.button
                key={item}
                onClick={() => scrollToSection(sectionId)}
                className={`transition-colors font-heading text-sm font-light cursor-pointer relative ${
                  isActive 
                    ? isDark ? 'text-dark-accent font-normal' : 'text-light-accent font-normal' 
                    : 'hover:' + (isDark ? 'text-dark-accent' : 'text-light-accent')
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item === 'Projects' ? 'Work' : item}
                {isActive && (
                  <motion.span 
                    className={`absolute -bottom-2 left-0 w-full h-0.5 ${isDark ? 'bg-dark-accent' : 'bg-light-accent'}`}
                    layoutId="activeNavIndicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute right-6 md:right-12 lg:right-24"
        >
          <ThemeToggle />
        </motion.div>
      </header>
      
      {/* Spacer for fixed header when scrolled */}
      {isScrolled && <div className="h-24" />}

      {/* Hero Section */}
      <section id="home" className="flex flex-col items-center text-center mb-24 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 font-heading tracking-tight">
            Hi, I'm <span className={isDark ? 'text-dark-accent' : 'text-light-accent'}>Ryan Radityatama</span>
          </h1>
          <h2 className="text-lg md:text-xl mb-8 font-heading font-light tracking-wide">AI & Software Engineer</h2>
          <p className="mb-10 text-sm max-w-xl mx-auto leading-relaxed">
            I blend AI with human-centered software solutions, turning complex challenges into elegant, user-friendly applications.
          </p>
          <div className="flex gap-6 justify-center">
            <NeuButton onClick={() => window.open('https://www.ryradit.my.id/Ryan%20Radityatama%20-%20Software%20Engineer.pdf', '_blank')}>
              Download CV
            </NeuButton>
            <NeuButton 
              variant="secondary" 
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </NeuButton>
          </div>
          <div className="flex mt-10 gap-6 justify-center">
            {[
              { Icon: FiGithub, href: 'https://github.com/ryradit' },
              { Icon: FiLinkedin, href: 'https://linkedin.com/in/ryan-radityatama' },
              { Icon: FiMail, href: 'mailto:ryradit@gmail.com' },
            ].map(({Icon, href}, index) => (
              <motion.a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full ${isDark ? 'bg-dark-bg shadow-neu-dark hover:shadow-neu-dark-inset' : 'bg-light-bg shadow-neu-light hover:shadow-neu-light-inset'}`}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="mb-24 py-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-light-shadow-light to-light-shadow-dark dark:from-dark-shadow-light dark:to-dark-shadow-dark rounded-full blur-xl opacity-30"></div>
              <motion.div
                initial={{ borderRadius: '40% 60% 70% 30% / 40% 40% 60% 50%' }}
                animate={{ borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%' }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: 'reverse', 
                  duration: 8,
                  ease: 'easeInOut'
                }}
                className="relative overflow-hidden aspect-square w-full max-w-lg mx-auto"
              >
                <Image
                  src="/myphoto1.jpg"
                  alt="Ryan Radityatama"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-normal mb-6 font-heading">
                About <span className={isDark ? 'text-dark-accent' : 'text-light-accent'}>Me</span>
              </h2>
              
              <p className="mb-4 text-sm leading-relaxed">
                I'm a Software Engineer who loves turning complex challenges into elegant, user-friendly solutions. 
                My journey in tech has been driven by a passion for creating applications that make a real difference in people's lives.
              </p>
              
              <p className="mb-4 text-sm leading-relaxed">
                Through my experience with modern tools like React and Node.js, I've had the privilege of building applications 
                that bridge the gap between advanced AI and everyday users. My Master's degree from Beijing Institute of Technology 
                allowed me to dive deep into how AI can make a positive impact.
              </p>
              
              <p className="text-sm leading-relaxed">
                What excites me most is the opportunity to collaborate on projects that push boundaries. Whether it's optimizing system performance, 
                leading development teams, or innovating with AI, I believe in creating technology that's not just powerful, 
                but also accessible and meaningful to its users.
              </p>
              
              <div className="mt-10 mb-2 flex justify-end">
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0.7 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-current to-transparent"
                    style={{ color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <span className={`font-signature text-4xl italic signature-text ${isDark ? 'text-dark-accent' : 'text-light-accent'}`} 
                          style={{ 
                            transform: 'rotate(-1deg)', 
                            display: 'inline-block',
                            textShadow: isDark ? '0 0 1px rgba(255,255,255,0.1)' : '0 0 1px rgba(0,0,0,0.1)'
                          }}>
                      Ryan  
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* What I Do Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-normal mb-10 font-heading text-center">
            What I <span className={isDark ? 'text-dark-accent' : 'text-light-accent'}>Do</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <NeuCard className="h-full">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h4 className="text-lg font-heading font-normal mb-3">{service.title}</h4>
                  <p className="text-sm">{service.description}</p>
                </NeuCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-xl font-light mb-8 font-heading text-center">Some technologies that I have worked with</h3>
          <NeuCard className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {[
                'PyTorch', 'Hugging Face', 'scikit-learn', 'NumPy', 'Matplotlib',
                'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind',
                'Node.js', 'PHP', 'PostgreSQL', 'MySQL', 'Firebase', 'Supabase'
              ].map((skill, index) => {
                const Icon = skillIconMap[skill as keyof typeof skillIconMap];
                return (
                  <motion.div 
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.1,
                      y: -5,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <div 
                      className={`w-14 h-14 rounded-lg flex items-center justify-center mb-3 ${
                        isDark 
                          ? 'bg-dark-shadow-light shadow-neu-dark' 
                          : 'bg-light-shadow-dark/10 shadow-neu-light'
                      }`}
                    >
                      {Icon && <Icon className={`text-2xl ${isDark ? 'text-dark-accent' : 'text-light-accent'}`} />}
                    </div>
                    <span className="text-xs text-center">{skill}</span>
                  </motion.div>
                );
              })}
            </div>
          </NeuCard>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="mb-16 pt-8">
        <h2 className="text-2xl font-normal mb-10 font-heading text-center">
          What I <span className={isDark ? 'text-dark-accent' : 'text-light-accent'}>have done</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Merra.ai - AI Interview Co-Pilot",
              description: "Developed Merra AI as AI Software Engineer, an AI-powered co-pilot for interviewers that assists with question generation, real-time response analysis, and provides post-interview insights.",
              tags: ["AI", "SaaS", "Next.js"],
              projectLink: "https://www.trymerra.ai/",
              imageUrl: "https://www.ryradit.my.id/imagess/merra.png"
            },
            {
              title: "Seido Mitra Abadi - Company Website",
              description: "Developed a modern company website for Seido Mitra Abadi featuring professional design, responsive layout, and dynamic content management. Built with Next.js and TailwindCSS for optimal performance.",
              tags: ["Next.js", "React", "TailwindCSS"],
              projectLink: "https://seidomitraabadi.vercel.app/",
              imageUrl: "https://www.ryradit.my.id/imagess/seido.png"
            },
            {
              title: "AI-Powered Barbershop Website",
              description: "Developed an AI-enhanced website for 'King Barbershop', featuring intelligent functionalities. View the live site or browse the code on GitHub.",
              tags: ["AI", "Web Development", "Next.js"],
              projectLink: "https://king-barbershop.vercel.app/",
              sourceLink: "https://github.com/ryradit/King-Barbershop",
              imageUrl: "https://www.ryradit.my.id/imagess/kingbarber.png"
            },
            {
              title: "LLM Research for Mental Health",
              description: "Focused research on Indonesian Large Language Models (LLMs) for mental health applications, aiming to build empathetic and supportive conversational AI systems using NLP techniques.",
              tags: ["LLMs", "NLP", "Python"],
              projectLink: "https://medium.com/@ryradit/idmentalbert-for-enhancing-conversational-intelligence-in-indonesian-e26862f260a2",
              imageUrl: "https://www.ryradit.my.id/imagess/mentalhealth.png"
            },
          ].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <NeuCard>
                <div className={`h-48 mb-4 rounded-lg overflow-hidden ${isDark ? 'bg-dark-shadow-light' : 'bg-light-shadow-dark'} relative`}>
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🚀</span>
                    </div>
                  )}
                </div>
                <h3 className="text-base font-normal mb-2 font-heading">{project.title}</h3>
                <p className="mb-4 text-xs">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className={`text-xs px-2 py-1 rounded ${
                        isDark 
                          ? 'bg-dark-shadow-light text-dark-text' 
                          : 'bg-light-shadow-dark/20 text-light-text'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.projectLink && (
                    <NeuButton onClick={() => window.open(project.projectLink, '_blank')}>
                      View Project
                    </NeuButton>
                  )}
                  {project.sourceLink && (
                    <NeuButton variant="secondary" onClick={() => window.open(project.sourceLink, '_blank')}>
                      Source Code
                    </NeuButton>
                  )}
                </div>
              </NeuCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="mb-16 pt-8">
        <h2 className="text-2xl font-normal mb-10 font-heading text-center">
          Get In <span className={isDark ? 'text-dark-accent' : 'text-light-accent'}>Touch</span>
        </h2>
        
        <NeuCard>
          <ContactForm isDark={isDark} />
        </NeuCard>
      </section>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-xs">&copy; {new Date().getFullYear()} Ryan Radityatama. All rights reserved.</p>
      </footer>
      
      {/* AI Chat Button */}
      <AIChatButton />
    </div>
  );
}
