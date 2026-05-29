'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/utils/supabaseClient';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Check if session is already active
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during authentication.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex items-center justify-center py-12 px-6">
      <BackgroundBlobs />

      {/* Floating absolute theme selector */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xs font-mono uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>
          <h1 className="text-3xl font-black font-heading text-black dark:text-white uppercase tracking-tight mt-4">
            ADMIN ACCESS
          </h1>
          <p className="text-xs opacity-60 mt-1">
            Manage your AI Blog and view incoming CRM leads
          </p>
        </div>

        <NeuCard glass className="p-8 border border-black/5 dark:border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2.5 px-4 rounded-xl text-center font-mono">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-black/60 dark:text-white/60">
                Email Address
              </label>
              <NeuCard inset className="px-4 py-2.5 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-2xl">
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white font-mono"
                />
              </NeuCard>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider font-heading font-bold text-black/60 dark:text-white/60">
                Password
              </label>
              <NeuCard inset className="px-4 py-2.5 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-2xl">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white font-mono"
                />
              </NeuCard>
            </div>

            <NeuButton
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs uppercase tracking-widest font-bold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </NeuButton>
          </form>
        </NeuCard>

        <div className="text-center mt-6">
          <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">
            RYRADIT ADMIN PANEL v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
