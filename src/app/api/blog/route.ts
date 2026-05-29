import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/utils/supabaseClient';

const getDbPath = () => path.join(process.cwd(), 'src', 'data', 'blog.json');

const getCrmDbPath = () => path.join(process.cwd(), 'src', 'data', 'crm.json');

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
  updatedAt?: string;
  coverImage?: string;
}

interface DbPostRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  status: string | null;
  date: string | null;
  created_at: string | null;
  updated_at: string | null;
  cover_image: string | null;
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

// Read posts helper
const readPosts = (): BlogPost[] => {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) return [];
  try {
    const fileData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(fileData || '[]');
  } catch {
    return [];
  }
};

// Write posts helper
const writePosts = (posts: BlogPost[]) => {
  try {
    const dbPath = getDbPath();
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(posts, null, 2), 'utf8');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn('[Storage API] Failed to write local posts backup (likely read-only filesystem in production):', errMsg);
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get('admin') === 'true';
    const crm = searchParams.get('crm') === 'true';

    // If fetching CRM contact data (for CRM dashboard tab)
    if (crm) {
      const crmPath = getCrmDbPath();
      if (!fs.existsSync(crmPath)) return NextResponse.json([]);
      const crmData = fs.readFileSync(crmPath, 'utf8');
      const leads = (JSON.parse(crmData || '[]')) as Lead[];
      // Sort by date descending
      leads.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return NextResponse.json(leads);
    }

    let posts: BlogPost[] = [];
    const { data: dbData, error: dbError } = await supabase
      .from('posts')
      .select('*');

    if (dbError) {
      console.warn('[Supabase API] Failed to fetch posts from database, falling back to local file:', dbError.message);
      posts = readPosts();
    } else {
      posts = (dbData as unknown as DbPostRow[] || []).map((row: DbPostRow) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        excerpt: row.excerpt || '',
        category: row.category || 'Technology',
        tags: Array.isArray(row.tags) ? row.tags : [],
        status: row.status as 'draft' | 'published',
        date: row.date || row.created_at || undefined,
        updatedAt: row.updated_at || undefined,
        coverImage: row.cover_image || undefined
      }));
    }
    
    // Sort posts by date descending
    posts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    if (admin) {
      // Admin sees everything
      return NextResponse.json(posts);
    } else {
      // Public only sees published posts
      return NextResponse.json(posts.filter((post) => post.status === 'published'));
    }
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json({ error: 'Failed to retrieve blog posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, slug, content, excerpt, category, tags, status, isCrmUpdate, leadId, leadStatus, coverImage } = body;

    // Handle CRM Lead status update (e.g. mark contacted or delete lead)
    if (isCrmUpdate && leadId) {
      const crmPath = getCrmDbPath();
      if (fs.existsSync(crmPath)) {
        let leads = (JSON.parse(fs.readFileSync(crmPath, 'utf8') || '[]')) as Lead[];
        if (leadStatus === 'delete') {
          leads = leads.filter((l) => l.id !== leadId);
        } else {
          leads = leads.map((l) => l.id === leadId ? { ...l, status: leadStatus as 'new' | 'contacted' } : l);
        }
        try {
          fs.writeFileSync(crmPath, JSON.stringify(leads, null, 2), 'utf8');
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.warn('[Storage API] Failed to write local CRM leads backup (likely read-only filesystem in production):', errMsg);
        }
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'CRM data store not found' }, { status: 404 });
    }

    // Otherwise, handle Blog post save/update
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const posts = readPosts();
    let updatedPost: BlogPost;

    if (id) {
      // Update existing post
      const index = posts.findIndex((post) => post.id === id);
      const existingPost = index !== -1 ? posts[index] : null;

      updatedPost = {
        id,
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-'),
        content,
        excerpt: excerpt || content.substring(0, 150).replace(/[#*`\n]/g, '') + '...',
        category: category || 'Technology',
        tags: Array.isArray(tags) ? tags : [],
        status: status || 'draft',
        date: existingPost?.date || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImage: coverImage || existingPost?.coverImage || undefined
      };

      if (index !== -1) {
        posts[index] = updatedPost;
      } else {
        posts.push(updatedPost);
      }
    } else {
      // Create new post
      // Check for slug duplication
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-');
      const slugExists = posts.some((post) => post.slug === cleanSlug);
      const uniqueSlug = slugExists ? `${cleanSlug}-${Date.now().toString().slice(-4)}` : cleanSlug;

      updatedPost = {
        id: Date.now().toString(),
        title,
        slug: uniqueSlug,
        content,
        excerpt: excerpt || content.substring(0, 150).replace(/[#*`\n]/g, '') + '...',
        category: category || 'Technology',
        tags: Array.isArray(tags) ? tags : [],
        status: status || 'draft',
        date: new Date().toISOString(),
        coverImage: coverImage || undefined
      };

      posts.push(updatedPost);
    }

    // Try to save to Supabase
    const dbRow = {
      id: updatedPost.id,
      title: updatedPost.title,
      slug: updatedPost.slug,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt,
      category: updatedPost.category,
      tags: updatedPost.tags,
      status: updatedPost.status,
      date: updatedPost.date,
      updated_at: updatedPost.updatedAt || new Date().toISOString(),
      cover_image: updatedPost.coverImage || null
    };

    const { error: upsertError } = await supabase
      .from('posts')
      .upsert(dbRow);

    if (upsertError) {
      console.warn('[Supabase API] Failed to save post to database, falling back to local file:', upsertError.message);
    }

    writePosts(posts);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Try to delete from Supabase
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.warn('[Supabase API] Failed to delete post from database, falling back to local file:', deleteError.message);
    }

    const posts = readPosts();
    const filteredPosts = posts.filter((post) => post.id !== id);

    if (posts.length === filteredPosts.length && deleteError) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    writePosts(filteredPosts);
    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
