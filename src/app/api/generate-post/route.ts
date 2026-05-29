import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/utils/geminiClient';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' }, 
        { status: 500 }
      );
    }

    const systemPrompt = `You are a professional tech blog writer and industry journalist. Write a comprehensive, high-quality, and deeply informative general article based on the user's prompt. 

The article must follow these specific styling and structure rules:
1. STRUCTURE & HEADINGS: Use markdown headings (specifically ## for main sections) to structure the article sections and highlight key terms where needed. Do NOT use ** for bolding at all.
2. ALGORITHMS/CODE: If code, algorithms, or technical implementation details are relevant, they MUST be strictly enclosed inside markdown code blocks (e.g. \`\`\`python) with explanatory prose paragraphs before and after. Never write code or comments (starting with # or using **) outside of code blocks, as this will break page formatting.
3. PRELUDE & OUTRO: Start with a clear introduction paragraph (prelude) and end with a solid concluding paragraph (outro).
4. DYNAMIC LANGUAGE MATCHING: Automatically detect the language of the user's prompt (e.g., English, Indonesian, Spanish, French, Japanese, etc.). You MUST write the entire generated post (specifically the 'title', 'excerpt', and 'content' body fields) in that same detected language. Keep 'category' mapped to one of the English standard options ('AI & Engineering', 'Web Development', 'Cloud & Databases', 'Design Systems', 'Technology').

Ensure the article is detailed, professional, and at least 600-800 words.

You must respond with a JSON object. The JSON response must strictly match this TypeScript interface structure:

interface GeneratedBlogPost {
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string; // The full article body written following the formatting rules above.
  imagePrompt: string; // A highly detailed, descriptive prompt for generating a premium, modern cover image or digital art related to the article topic.
}

Do not include any markdown backticks or block formatting around the JSON itself. Output raw JSON only.

Generate a blog post for the prompt: "${prompt}"`;

    const { text: responseText } = await generateContentWithFallback(apiKey, systemPrompt, "application/json");
    
    // Parse the JSON response
    // Extract JSON object using brace matching to handle markdown wrapping or extra whitespace robustly
    let cleanedText = responseText;
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanedText = responseText.substring(firstBrace, lastBrace + 1);
    }
    cleanedText = cleanedText.trim();

    // Sanitize common LLM JSON formatting issues before parsing
    // 1. Fix invalid escape sequences (e.g. backslashes before regular characters like \M)
    cleanedText = cleanedText.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
    // 2. Remove trailing commas in arrays/objects (e.g. [a, b, ] -> [a, b])
    cleanedText = cleanedText.replace(/,\s*([\]}])/g, '$1');

    try {
      const generatedPost = JSON.parse(cleanedText);
      if (generatedPost && typeof generatedPost.content === 'string') {
        generatedPost.content = generatedPost.content.replace(/\*\*/g, '');
      }
      if (generatedPost && typeof generatedPost.excerpt === 'string') {
        generatedPost.excerpt = generatedPost.excerpt.replace(/\*\*/g, '');
      }
      
      // Generate cover image using Pollinations AI based on imagePrompt
      if (generatedPost && typeof generatedPost.imagePrompt === 'string') {
        generatedPost.coverImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(generatedPost.imagePrompt)}?width=1200&height=630&nologo=true`;
      } else {
        generatedPost.coverImage = `https://image.pollinations.ai/prompt/cyberpunk%20minimalist%20tech%20blog%20cover%20art?width=1200&height=630&nologo=true`;
      }

      return NextResponse.json(generatedPost);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON response:', cleanedText, parseErr);
      // Fallback in case of JSON parse errors: structure it as a manual post
      return NextResponse.json({
        title: prompt.toUpperCase(),
        category: 'AI & Engineering',
        tags: ['AI', 'Tech'],
        excerpt: ('An article generated on the topic of: ' + prompt).replace(/\*\*/g, ''),
        content: responseText.replace(/\*\*/g, ''),
        coverImage: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' high quality digital tech banner') || 'tech'}?width=1200&height=630&nologo=true`
      });
    }

  } catch (error) {
    console.error('Error generating AI blog post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to generate AI blog post', details: errorMessage }, 
      { status: 500 }
    );
  }
}
