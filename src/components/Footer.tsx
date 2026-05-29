'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-black/5 dark:border-white/5 w-full mt-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left mb-16">
        {/* Column 1: Info */}
        <div className="md:col-span-2">
          <div className="text-lg font-black tracking-widest font-heading mb-4 text-black dark:text-white uppercase">
            RYRADIT
          </div>
          <p className="text-xs opacity-75 max-w-sm leading-relaxed mb-6 font-sans">
            &copy; {new Date().getFullYear()} RYRADIT. ARCHITECTING DIGITAL FLUIDITY. All rights reserved. Our work is the bridge between human interaction and machine precision.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/ryradit" target="_blank" rel="noopener noreferrer" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white text-xs font-mono uppercase tracking-wider">GitHub</a>
            <a href="https://linkedin.com/in/ryan-radityatama" target="_blank" rel="noopener noreferrer" className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white text-xs font-mono uppercase tracking-wider">LinkedIn</a>
          </div>
        </div>
        
        {/* Column 2: Directory */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 font-heading text-black dark:text-white">Directory</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li><Link href="/" className="opacity-70 hover:opacity-100 transition-opacity">Home</Link></li>
            <li><Link href="/about" className="opacity-70 hover:opacity-100 transition-opacity">About</Link></li>
            <li><Link href="/projects" className="opacity-70 hover:opacity-100 transition-opacity">Projects</Link></li>
            <li><Link href="/blog" className="opacity-70 hover:opacity-100 transition-opacity">Blog</Link></li>
            <li><Link href="/contact" className="opacity-70 hover:opacity-100 transition-opacity">Contact</Link></li>
          </ul>
        </div>
        
        {/* Column 3: Legal */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-4 font-heading text-black dark:text-white">Legal</h4>
          <ul className="flex flex-col gap-2.5 text-xs opacity-70">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Legal</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      {/* Footer Bottom Label */}
      <div className="flex justify-between items-center pt-8 border-t border-black/5 dark:border-white/5 text-[9px] font-mono uppercase tracking-widest opacity-40">
        <span>Fluidity Study</span>
        <span>Oct. 2026</span>
      </div>
    </footer>
  );
}
