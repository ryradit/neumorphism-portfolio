'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { 
  SiPytorch, 
  SiHuggingface, 
  SiScikitlearn, 
  SiNumpy,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiSupabase
} from 'react-icons/si';
import { NeuCard } from './NeuCard';

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

interface SkillCardProps {
  title: string;
  skills: string[];
}

export function SkillCard({ title, skills }: SkillCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <NeuCard>
      <h3 className="text-xl font-semibold mb-5">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, index) => {
          const Icon = skillIconMap[skill as keyof typeof skillIconMap];
          return (
            <motion.div 
              key={index}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div 
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  isDark 
                    ? 'bg-dark-shadow-light shadow-neu-dark' 
                    : 'bg-light-shadow-dark/10 shadow-neu-light'
                }`}
              >
                {Icon && <Icon className={`text-2xl ${isDark ? 'text-dark-accent' : 'text-light-accent'}`} />}
              </div>
              <span className="text-sm text-center">{skill}</span>
            </motion.div>
          );
        })}
      </div>
    </NeuCard>
  );
}
