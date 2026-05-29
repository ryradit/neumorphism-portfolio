'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { Header } from '@/components/Header';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  date: string;
  coverImage?: string;
}

const CATEGORIES = ['All', 'AI & Engineering', 'Web Development', 'Cloud & Databases', 'Design Systems'];

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <BackgroundBlobs />
      <Header />

      <div className="relative z-10 py-12 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-32">

        {/* Hero title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50 block mb-2">
            Insights & Developments
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tight text-black dark:text-white uppercase leading-none mb-6">
            THE AI JOURNAL
          </h1>
          <p className="text-sm opacity-70 leading-relaxed font-sans">
            Exploring artificial intelligence, modern frontends, and automated workflows. Written by Ryan and co-authored by generative AI.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Search bar */}
          <div className="w-full md:max-w-xs">
            <NeuCard inset className="px-4 py-2 border-0 flex items-center bg-[#f0f2f5] dark:bg-[#0e1224] rounded-full">
              <span className="opacity-50 mr-2 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white"
              />
            </NeuCard>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none justify-start md:justify-end">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-heading uppercase tracking-wider transition-all duration-300 font-semibold ${
                  selectedCategory === category
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog grid */}
        {loading ? (
          <div className="text-center py-20 opacity-50 font-mono text-sm">Loading articles...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold opacity-60 mb-2">No articles found</h3>
            <p className="text-xs opacity-50">Try broadening your search criteria or checking back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full"
              >
                <NeuCard glass className="p-6 h-full flex flex-col justify-between border-t border-t-black/5 dark:border-t-white/5 group hover:border-black/20 dark:hover:border-white/15 transition-all duration-300">
                  <div>
                    {post.coverImage && (
                      <Link href={`/blog/${post.slug}`} className="block w-full aspect-video rounded-xl overflow-hidden mb-4 relative border border-black/5 dark:border-white/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </Link>
                    )}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50">
                        {post.category}
                      </span>
                      <span className="text-[9px] font-mono text-black/40 dark:text-white/40">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block group-hover:translate-x-1 transition-transform duration-300">
                      <h2 className="text-xl font-black font-heading tracking-tight text-black dark:text-white mb-3 line-clamp-2 uppercase">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs opacity-70 leading-relaxed mb-6 line-clamp-3 font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-widest font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full opacity-60">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <NeuButton className="text-[9px] py-1.5 px-4 uppercase tracking-wider font-bold w-full text-center block">
                        Read Article
                      </NeuButton>
                    </Link>
                  </div>
                </NeuCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
