'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
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

// Simple local Markdown parser to avoid external dependency issues
function renderMarkdown(md: string) {
  if (!md) return null;

  const lines = md.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = '';
  let keyIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        inCodeBlock = false;
        renderedElements.push(
          <pre key={`code-${keyIndex++}`} className="bg-black/5 dark:bg-black/60 p-4 rounded-xl font-mono text-xs overflow-x-auto my-6 border border-black/5 dark:border-white/5 text-black dark:text-gray-300">
            <code className={codeLang}>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      renderedElements.push(
        <h1 key={`h1-${keyIndex++}`} className="text-3xl md:text-4xl font-black font-heading mt-8 mb-4 uppercase text-black dark:text-white">
          {line.substring(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      renderedElements.push(
        <h2 key={`h2-${keyIndex++}`} className="text-2xl md:text-3xl font-black font-heading mt-8 mb-4 uppercase text-black dark:text-white border-b border-black/5 dark:border-white/5 pb-2">
          {line.substring(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h3 key={`h3-${keyIndex++}`} className="text-xl md:text-2xl font-black font-heading mt-6 mb-3 uppercase text-black dark:text-white">
          {line.substring(4)}
        </h3>
      );
      continue;
    }

    // List items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const cleanLine = line.trim().substring(2);
      renderedElements.push(
        <ul key={`ul-${keyIndex++}`} className="list-disc pl-6 my-2 text-sm opacity-80 leading-relaxed font-sans text-black dark:text-white">
          <li>{parseInlineFormatting(cleanLine)}</li>
        </ul>
      );
      continue;
    }

    // Numbered lists
    const numListMatch = line.trim().match(/^(\d+)\.\s(.*)/);
    if (numListMatch) {
      renderedElements.push(
        <ol key={`ol-${keyIndex++}`} className="list-decimal pl-6 my-2 text-sm opacity-80 leading-relaxed font-sans text-black dark:text-white">
          <li>{parseInlineFormatting(numListMatch[2])}</li>
        </ol>
      );
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={`bq-${keyIndex++}`} className="border-l-4 border-black/30 dark:border-white/30 pl-4 py-1 my-4 italic opacity-75 text-sm bg-black/5 dark:bg-white/5 pr-4 rounded-r-md">
          {parseInlineFormatting(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Empty space
    if (line.trim() === '') {
      continue;
    }

    // Regular paragraphs
    renderedElements.push(
      <p key={`p-${keyIndex++}`} className="text-sm md:text-base opacity-80 leading-relaxed font-sans my-4 text-black dark:text-white">
        {parseInlineFormatting(line)}
      </p>
    );
  }

  return <div className="prose dark:prose-invert max-w-none">{renderedElements}</div>;
}

// Simple parser for **bold** and `code` inside lines
function parseInlineFormatting(text: string) {
  const parts: React.ReactNode[] = [];
  let remainingText = text;
  let key = 0;

  while (remainingText.length > 0) {
    const boldIndex = remainingText.indexOf('**');
    const codeIndex = remainingText.indexOf('`');

    // If both bold and code patterns are present, determine which occurs first
    if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
      // Add text before the bold tag
      if (boldIndex > 0) {
        parts.push(remainingText.substring(0, boldIndex));
      }
      
      const nextBold = remainingText.indexOf('**', boldIndex + 2);
      if (nextBold !== -1) {
        parts.push(
          <strong key={`b-${key++}`} className="font-extrabold text-black dark:text-white">
            {remainingText.substring(boldIndex + 2, nextBold)}
          </strong>
        );
        remainingText = remainingText.substring(nextBold + 2);
      } else {
        parts.push(remainingText.substring(boldIndex));
        remainingText = '';
      }
    } else if (codeIndex !== -1) {
      // Add text before code backtick
      if (codeIndex > 0) {
        parts.push(remainingText.substring(0, codeIndex));
      }

      const nextCode = remainingText.indexOf('`', codeIndex + 1);
      if (nextCode !== -1) {
        parts.push(
          <code key={`code-${key++}`} className="bg-black/5 dark:bg-black/40 px-1.5 py-0.5 rounded font-mono text-[85%] text-black dark:text-gray-300">
            {remainingText.substring(codeIndex + 1, nextCode)}
          </code>
        );
        remainingText = remainingText.substring(nextCode + 1);
      } else {
        parts.push(remainingText.substring(codeIndex));
        remainingText = '';
      }
    } else {
      parts.push(remainingText);
      remainingText = '';
    }
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p: BlogPost) => p.slug === slug);
          setPost(found || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching blog post:', err);
        setLoading(false);
      });
  }, [slug]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <BackgroundBlobs />
      <Header />

      <div className="relative z-10 py-12 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto pt-32">

        {loading ? (
          <div className="text-center py-20 opacity-50 font-mono text-sm">Loading article content...</div>
        ) : !post ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold opacity-60 mb-2">Article Not Found</h3>
            <p className="text-xs opacity-50 mb-6">The article you are searching for might have been deleted or archived.</p>
            <Link href="/blog">
              <NeuButton className="text-[10px] px-6 py-2 uppercase font-bold tracking-wider">
                Back to Blog
              </NeuButton>
            </Link>
          </div>
        ) : (
          <div>
            {/* Back button */}
            <div className="mb-8">
              <Link href="/blog" className="text-[10px] font-mono uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
                ← Back to Listing
              </Link>
            </div>

            {/* Post Header Card */}
            <NeuCard glass className="p-8 md:p-12 mb-10 border-t border-t-black/5 dark:border-t-white/5">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full mr-3">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-mono text-black/50 dark:text-white/50">
                    Published: {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-black dark:text-white uppercase leading-tight mb-6">
                {post.title}
              </h1>

              <p className="text-sm md:text-base opacity-75 font-sans italic leading-relaxed border-l-2 border-black/20 dark:border-white/20 pl-4 py-1 mb-8">
                {post.excerpt}
              </p>

              {post.coverImage && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 relative border border-black/5 dark:border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Parsed body content */}
              <div className="article-body-content mt-12 leading-relaxed">
                {renderMarkdown(post.content)}
              </div>

              {/* Tags */}
              <div className="border-t border-black/5 dark:border-white/5 mt-12 pt-6 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[9px] uppercase tracking-widest font-mono bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-black/60 dark:text-white/60">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share Article */}
              <div className="border-t border-black/5 dark:border-white/5 mt-8 pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50">
                  Share Article:
                </span>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => {
                      const shareUrl = encodeURIComponent(window.location.href);
                      const shareText = encodeURIComponent(`Check out this article: "${post.title}"`);
                      window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0e1224] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 shadow-sm text-xs font-bold transition-all hover:scale-105 text-black dark:text-white"
                    title="Share on Twitter / X"
                  >
                    𝕏
                  </button>
                  <button
                    onClick={() => {
                      const shareUrl = encodeURIComponent(window.location.href);
                      const shareTitle = encodeURIComponent(post.title);
                      const shareSummary = encodeURIComponent(post.excerpt);
                      window.open(`https://www.linkedin.com/shareArticle?url=${shareUrl}&title=${shareTitle}&summary=${shareSummary}`, '_blank');
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0e1224] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 shadow-sm text-xs font-bold transition-all hover:scale-105 text-black dark:text-white"
                    title="Share on LinkedIn"
                  >
                    in
                  </button>
                  <button
                    onClick={() => {
                      const shareUrl = encodeURIComponent(window.location.href);
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0e1224] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 shadow-sm text-xs font-bold transition-all hover:scale-105 text-black dark:text-white"
                    title="Share on Facebook"
                  >
                    f
                  </button>
                  <button
                    onClick={() => {
                      const shareUrl = encodeURIComponent(window.location.href);
                      const shareText = encodeURIComponent(`Read "${post.title}": ${window.location.href}`);
                      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0e1224] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 shadow-sm text-xs font-bold transition-all hover:scale-105 text-black dark:text-white"
                    title="Share on WhatsApp"
                  >
                    💬
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch (err) {
                        console.error('Clipboard copy failed:', err);
                      }
                    }}
                    className="px-3 h-8 rounded-full flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0e1224] border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 shadow-sm text-[9px] uppercase tracking-wider font-mono font-bold text-black/70 dark:text-white/70 transition-all hover:scale-105"
                    title="Copy Link"
                  >
                    {copied ? 'Copied! ✓' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </NeuCard>

            {/* Sign off and footer */}
            <div className="flex justify-between items-center px-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40">
                Author: Ryan Radityatama
              </span>
              <Link href="/blog" className="text-[9px] font-mono uppercase tracking-widest text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors border-b border-black/20 dark:border-white/20 pb-0.5">
                Explore More Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
