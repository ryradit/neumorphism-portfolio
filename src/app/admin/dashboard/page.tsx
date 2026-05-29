'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { NeuCard } from '@/components/NeuCard';
import { NeuButton } from '@/components/NeuButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { supabase } from '@/utils/supabaseClient';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  date?: string;
  coverImage?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'contacted';
}

const CATEGORIES = ['AI & Engineering', 'Web Development', 'Cloud & Databases', 'Design Systems'];

// Simple markdown preview parser
function previewMarkdown(md: string) {
  if (!md) return <p className="opacity-40 italic text-xs">No content written yet.</p>;

  const lines = md.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let keyIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        renderedElements.push(
          <pre key={`code-${keyIndex++}`} className="bg-black/10 dark:bg-black/60 p-3 rounded-lg font-mono text-[10px] overflow-x-auto my-3 text-black dark:text-gray-300">
            <code>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    if (line.startsWith('# ')) {
      renderedElements.push(
        <h1 key={`h1-${keyIndex++}`} className="text-xl font-bold mt-4 mb-2 text-black dark:text-white uppercase">
          {line.substring(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      renderedElements.push(
        <h2 key={`h2-${keyIndex++}`} className="text-lg font-bold mt-4 mb-2 text-black dark:text-white uppercase border-b border-black/5 pb-1">
          {line.substring(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      renderedElements.push(
        <ul key={`ul-${keyIndex++}`} className="list-disc pl-4 text-xs opacity-80 my-1 text-black dark:text-white">
          <li>{line.substring(2)}</li>
        </ul>
      );
      continue;
    }
    if (line.trim() === '') continue;

    renderedElements.push(
      <p key={`p-${keyIndex++}`} className="text-xs opacity-75 leading-relaxed my-2 text-black dark:text-white">
        {line}
      </p>
    );
  }

  return <div className="prose dark:prose-invert max-w-none">{renderedElements}</div>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'creator' | 'posts' | 'crm'>('creator');
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // AI Generator state
  const [generatorPrompt, setGeneratorPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  // Editor states
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('AI & Engineering');
  const [tagsInput, setTagsInput] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Lists data states
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [actionStatus, setActionStatus] = useState({ success: false, message: '', error: false });

  // Load configuration & Auth verification
  useEffect(() => {
    setMounted(true);
    const checkUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setAuthorized(true);
        fetchBlogPosts();
        fetchCRMLeads();
      }
    };
    checkUserSession();
  }, [router]);

  // Fetch blogs helper
  const fetchBlogPosts = () => {
    fetch('/api/blog?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch((err) => console.error('Error fetching blogs:', err));
  };

  // Fetch leads helper
  const fetchCRMLeads = () => {
    fetch('/api/blog?crm=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch((err) => console.error('Error fetching CRM:', err));
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!postId) {
      const cleanSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(cleanSlug);
    }
  }, [title, postId]);

  // AI generation execution
  const handleGenerateAI = async () => {
    if (!generatorPrompt) return;
    setGenerating(true);
    setActionStatus({ success: false, message: '', error: false });

    try {
      const res = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: generatorPrompt })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title || '');
        setCategory(data.category || 'AI & Engineering');
        setTagsInput(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setCoverImage(data.coverImage || '');
        setActionStatus({ success: true, message: 'AI post generated successfully! Check details below.', error: false });
      } else {
        setActionStatus({ success: false, message: data.error || 'Failed to generate content.', error: true });
      }
    } catch (err) {
      console.error(err);
      setActionStatus({ success: false, message: 'Error calling AI generation API.', error: true });
    } finally {
      setGenerating(false);
    }
  };

  // Saving post handler (Draft vs Publish)
  const handleSavePost = async (status: 'draft' | 'published') => {
    if (!title || !slug || !content) {
      setActionStatus({ success: false, message: 'Title, slug, and content are required.', error: true });
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-');
    const finalId = postId || Date.now().toString();

    // 1. Try to save directly to Supabase using browser authentication credentials
    const dbRow = {
      id: finalId,
      title,
      slug: cleanSlug,
      content,
      excerpt: excerpt || content.substring(0, 150).replace(/[#*`\n]/g, '') + '...',
      category,
      tags,
      status,
      date: posts.find((p) => p.id === postId)?.date || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cover_image: coverImage || null
    };

    try {
      setActionStatus({ success: false, message: 'Saving post to database...', error: false });
      
      const { error: dbError } = await supabase
        .from('posts')
        .upsert(dbRow);

      if (dbError) {
        console.error('Supabase write error:', dbError);
        setActionStatus({
          success: false,
          message: `Failed to save to Supabase: ${dbError.message}. Make sure you created the 'posts' table with the provided SQL query!`,
          error: true
        });
        return;
      }

      // 2. Sync to local JSON fallback database
      const postPayload: BlogPost = {
        id: finalId,
        title,
        slug: cleanSlug,
        content,
        excerpt: dbRow.excerpt,
        category,
        tags,
        status,
        date: dbRow.date,
        coverImage: dbRow.cover_image || undefined
      };

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });
      
      if (res.ok) {
        setActionStatus({
          success: true,
          message: status === 'published' ? 'Article published successfully to Supabase!' : 'Draft saved successfully to Supabase.',
          error: false
        });
        
        // Refresh listings
        fetchBlogPosts();
        
        // Set active editor ID
        setPostId(finalId);
      } else {
        const savedPost = await res.json();
        setActionStatus({ success: false, message: savedPost.error || 'Failed to sync post fallback.', error: true });
      }
    } catch (err) {
      console.error(err);
      setActionStatus({ success: false, message: 'Error contacting backend service.', error: true });
    }
  };

  // Edit action
  const loadPostForEdit = (post: BlogPost) => {
    setPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setTagsInput(post.tags.join(', '));
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.coverImage || '');
    setActiveTab('creator');
    setActionStatus({ success: false, message: '', error: false });
  };

  // Delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      // 1. Delete from Supabase first using client-side auth context
      const { error: dbError } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Supabase delete error:', dbError);
        alert(`Failed to delete from Supabase: ${dbError.message}`);
        return;
      }

      // 2. Delete from local backup file
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlogPosts();
        if (postId === id) {
          clearEditor();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CRM status updates
  const handleUpdateLeadStatus = async (leadId: string, status: 'contacted' | 'delete') => {
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCrmUpdate: true, leadId, leadStatus: status })
      });
      if (res.ok) {
        fetchCRMLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Clear Form
  const clearEditor = () => {
    setPostId(undefined);
    setTitle('');
    setSlug('');
    setCategory('AI & Engineering');
    setTagsInput('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setGeneratorPrompt('');
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (!mounted || !authorized) return null;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      <BackgroundBlobs />

      <div className="relative z-10 py-12 px-6 md:px-12 max-w-7xl mx-auto pt-24">
        {/* Admin Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-black/50 dark:text-white/50 block">
              Ryan Radityatama Portfolio
            </span>
            <h1 className="text-2xl font-black font-heading text-black dark:text-white uppercase tracking-tight">
              CONTROL CENTRE
            </h1>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/blog" target="_blank" className="text-[10px] font-mono uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white border-b border-black/20 pb-0.5">
              Open Public Blog ↗
            </Link>
            <ThemeToggle />
            <button onClick={handleLogout} className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-red-500 text-[10px] uppercase font-mono px-4 py-1.5 rounded-full font-semibold transition-all">
              Log Out
            </button>
          </div>
        </header>

        {/* Tab Selection Row */}
        <div className="flex gap-3 border-b border-black/10 dark:border-white/5 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-5 py-2 rounded-full text-[10px] font-heading uppercase tracking-wider font-semibold transition-all duration-300 ${
              activeTab === 'creator'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            ✍️ AI Blog Creator
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-5 py-2 rounded-full text-[10px] font-heading uppercase tracking-wider font-semibold transition-all duration-300 ${
              activeTab === 'posts'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            📋 Manage Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-5 py-2 rounded-full text-[10px] font-heading uppercase tracking-wider font-semibold transition-all duration-300 relative ${
              activeTab === 'crm'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            📊 CRM Contacts ({leads.length})
            {leads.some(l => l.status === 'new') && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        {actionStatus.message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-mono text-center border ${
            actionStatus.error
              ? 'bg-red-500/10 border-red-500/20 text-red-500'
              : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            {actionStatus.message}
          </div>
        )}

        {/* 1. BLOG CREATOR */}
        {activeTab === 'creator' && (
          <div className="space-y-8">
            {/* AI Generator Box */}
            <NeuCard glass className="p-6 border border-black/5 dark:border-white/5">
              <h2 className="text-xs uppercase font-heading font-black tracking-widest mb-4 text-black dark:text-white">
                💡 Single Prompt AI Article Writer
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <NeuCard inset className="px-4 py-2.5 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-2xl">
                    <input
                      type="text"
                      disabled={generating}
                      placeholder="e.g. Write a comprehensive guide on building lightweight, zero-dependency Markdown components in React"
                      value={generatorPrompt}
                      onChange={(e) => setGeneratorPrompt(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white"
                    />
                  </NeuCard>
                </div>
                <NeuButton
                  onClick={handleGenerateAI}
                  disabled={generating || !generatorPrompt}
                  className="sm:w-48 py-2.5 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap"
                >
                  {generating ? '✨ Writing...' : '✨ Generate Article'}
                </NeuButton>
              </div>
            </NeuCard>

            {/* Split View Editor & Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Form Input Pane */}
              <NeuCard glass className="p-6 border border-black/5 dark:border-white/5 space-y-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs uppercase font-heading font-black tracking-widest text-black dark:text-white">
                    {postId ? '📝 Edit Article Details' : '📝 Write Article details'}
                  </h2>
                  <button onClick={clearEditor} className="text-[9px] font-mono uppercase tracking-wider text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                    Clear Form
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                    Article Title
                  </label>
                  <NeuCard inset className="px-3 py-2 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-xl">
                    <input
                      type="text"
                      placeholder="Title of your post"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white font-bold"
                    />
                  </NeuCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                      Slug URL path
                    </label>
                    <NeuCard inset className="px-3 py-2 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-xl">
                      <input
                        type="text"
                        placeholder="my-post-url-path"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white font-mono"
                      />
                    </NeuCard>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#f0f2f5] dark:bg-[#0e1224] text-xs text-black dark:text-white border-0 outline-none rounded-xl px-3 py-2.5 appearance-none shadow-inner"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                    Tags (Comma separated)
                  </label>
                  <NeuCard inset className="px-3 py-2 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-xl">
                    <input
                      type="text"
                      placeholder="e.g. AI, Next.js, Web Development"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white"
                    />
                  </NeuCard>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                    Cover Image URL (AI Generated automatically)
                  </label>
                  <NeuCard inset className="px-3 py-2 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-xl">
                    <input
                      type="text"
                      placeholder="https://image.pollinations.ai/... or custom URL"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white font-mono"
                    />
                  </NeuCard>
                  {coverImage && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden mt-2 relative border border-black/5 dark:border-white/5 bg-[#f0f2f5] dark:bg-[#0e1224]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImage}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                    Excerpt / Brief description
                  </label>
                  <NeuCard inset className="px-3 py-2 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-xl">
                    <textarea
                      rows={2}
                      placeholder="Short summary for the listing page..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white resize-none font-sans"
                    />
                  </NeuCard>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-heading font-bold text-black/50 dark:text-white/50">
                    Content (Markdown allowed)
                  </label>
                  <NeuCard inset className="px-3 py-3 border-0 bg-[#f0f2f5] dark:bg-[#0e1224] rounded-xl">
                    <textarea
                      rows={14}
                      placeholder="Write your article in markdown here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-transparent border-none outline-none w-full text-xs text-black dark:text-white resize-y font-mono"
                    />
                  </NeuCard>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => handleSavePost('draft')}
                    className="flex-grow py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest text-black dark:text-white transition-all shadow-md"
                  >
                    💾 Save Draft
                  </button>
                  <NeuButton
                    onClick={() => handleSavePost('published')}
                    className="flex-grow py-3 text-[10px] uppercase font-bold tracking-widest"
                  >
                    🚀 Publish Live
                  </NeuButton>
                </div>
              </NeuCard>

              {/* Preview Scene Pane */}
              <NeuCard glass className="p-6 border border-black/5 dark:border-white/5 h-full max-h-[780px] flex flex-col justify-between">
                <div className="overflow-y-auto max-h-[700px] pr-2">
                  <div className="flex justify-between items-center mb-4 border-b border-black/5 dark:border-white/5 pb-4">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50">
                      📺 Live Preview Scene
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full text-black/60">
                      {category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black font-heading text-black dark:text-white uppercase leading-tight mb-4">
                    {title || 'Untranslated Title'}
                  </h2>

                  {excerpt && (
                    <p className="text-xs font-sans opacity-70 italic border-l-2 border-black/20 dark:border-white/20 pl-3 py-0.5 mb-6">
                      {excerpt}
                    </p>
                  )}

                  {coverImage && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 relative border border-black/5 dark:border-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImage}
                        alt="Preview Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="border-t border-black/5 dark:border-white/5 pt-4">
                    {previewMarkdown(content)}
                  </div>
                </div>

                {tagsInput && (
                  <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-4 flex flex-wrap gap-1">
                    {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="text-[8px] uppercase tracking-widest font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full opacity-60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </NeuCard>
            </div>
          </div>
        )}

        {/* 2. MANAGE POSTS */}
        {activeTab === 'posts' && (
          <NeuCard glass className="p-6 border border-black/5 dark:border-white/5">
            <h2 className="text-xs uppercase font-heading font-black tracking-widest mb-6 text-black dark:text-white">
              📋 All Blog Articles
            </h2>

            {posts.length === 0 ? (
              <div className="text-center py-12 opacity-50 font-mono text-xs">No articles available. Generate one above to begin.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-[9px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50">
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                        <td className="py-4 font-bold max-w-xs truncate text-black dark:text-white">{post.title}</td>
                        <td className="py-4 opacity-75">{post.category}</td>
                        <td className="py-4 opacity-50 font-mono">
                          {post.date ? new Date(post.date).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                            post.status === 'published'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => loadPostForEdit(post)}
                            className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white px-3 py-1 rounded-md text-[9px] uppercase font-mono transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => post.id && handleDeletePost(post.id)}
                            className="bg-red-500/5 hover:bg-red-500/10 text-red-500 px-3 py-1 rounded-md text-[9px] uppercase font-mono transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </NeuCard>
        )}

        {/* 3. CRM LEADS */}
        {activeTab === 'crm' && (
          <NeuCard glass className="p-6 border border-black/5 dark:border-white/5">
            <h2 className="text-xs uppercase font-heading font-black tracking-widest mb-6 text-black dark:text-white">
              📊 Contact Form leads (CRM)
            </h2>

            {leads.length === 0 ? (
              <div className="text-center py-12 opacity-50 font-mono text-xs">No leads recorded. Submissions on the contact form will show up here.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-[9px] uppercase tracking-widest font-mono text-black/50 dark:text-white/50">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Subject</th>
                      <th className="pb-3">Message</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                        <td className="py-4 opacity-50 font-mono whitespace-nowrap">
                          {new Date(lead.date).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4">
                          <div className="font-bold text-black dark:text-white">{lead.name}</div>
                          <div className="text-[10px] opacity-50 font-mono">{lead.email}</div>
                        </td>
                        <td className="py-4 font-semibold text-black dark:text-white max-w-xs truncate">{lead.subject}</td>
                        <td className="py-4 opacity-80 max-w-sm truncate" title={lead.message}>
                          {lead.message}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                            lead.status === 'contacted'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-red-500/10 text-red-500 animate-pulse'
                          }`}>
                            {lead.status || 'new'}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2 whitespace-nowrap">
                          {lead.status !== 'contacted' && (
                            <button
                              onClick={() => handleUpdateLeadStatus(lead.id, 'contacted')}
                              className="bg-green-500/5 hover:bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-md text-[9px] uppercase font-mono transition-all"
                            >
                              ✓ Contacted
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateLeadStatus(lead.id, 'delete')}
                            className="bg-red-500/5 hover:bg-red-500/10 text-red-500 px-2 py-1 rounded-md text-[9px] uppercase font-mono transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </NeuCard>
        )}
      </div>
    </div>
  );
}
