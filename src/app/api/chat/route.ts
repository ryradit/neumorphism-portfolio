import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the expected request body structure
interface RequestBody {
  message: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string | Date;
  }>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody;
    const { message, history } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Get API key from environment variable - use non-NEXT_PUBLIC version for server components
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' }, 
        { status: 500 }
      );
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-2.0-flash as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // For Gemini 2.0 Flash, we need to properly structure the chat history
    // Convert from our app format to Gemini API format
    const chatHistory = history
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));
    
    // For Gemini 2.0 Flash, we need to make the system prompt concise
    const systemPrompt = `You are Ryan's AI assistant. Below is Ryan Radityatama's detailed professional information:

PROFESSIONAL EXPERIENCE:
1. AI ENGINEER - London, United Kingdom (Remote) | March 2025 - July 2025
   Trymerra AI Ltd.
   - Developed a minimum viable product (MVP) for an AI-driven recruitment platform, handling the entire development process from UI/UX design to full-stack implementation
   - Built the frontend using React and developed backend APIs to handle core logic and data operations
   - Integrated advanced conversational AI features, including CV parsing and automated interview simulations
   - Focused on optimizing system performance to ensure a responsive, real-time user experience

2. AI & ALGORITHM ENGINEER - Jakarta, Indonesia | Jan 2025 - Feb 2025
   PT. Digital SawitPRO
   - Managed the development of an AI-based computer vision system to detect palm trees from drone and satellite imagery
   - Built and fine-tuned deep learning models using PyTorch for object detection and image segmentation
   - Worked with engineering and product teams to integrate the detection system into a scalable pipeline

3. AI ENGINEER - Jakarta, Indonesia | April 2023 - April 2024
   BIT's NLPIR Research Lab
   - Conducted research to fine-tune large language models (LLMs) for Indonesian language
   - Preprocessed and curated large-scale Indonesian datasets, applying tokenization and cleaning strategies

4. SENIOR IT SOLUTIONS - Jakarta, Indonesia | Oct 2022 - Feb 2023
   Universitas Mercu Buana
   - Led a small IT team ensuring smooth operation of campus-wide IT infrastructure
   - Implemented system optimizations resulting in 15% increase in efficiency
   - Oversaw IT projects including system upgrades, cloud migration, and security enhancements

5. IT SOLUTIONS & INTERNATIONAL OPERATIONS OFFICER - Jakarta, Indonesia | Sep 2019 - Oct 2022
   Universitas Mercu Buana
   - Managed databases for international academic initiatives
   - Provided technical support and training, contributing to 20% efficiency increase
   - Coordinated international programs and maintained the international relations website

EDUCATION:
1. BEIJING INSTITUTE OF TECHNOLOGY - Beijing, China | 2022 - 2024
   Master Degree of Computer Science and Technology
   - Recipient of Chinese Government Scholarship
   - Thesis: Research on Indonesian Large Language Models Fine-Tuning for Mental Health
   - Chair of Election Voting Section, Indonesian Embassy Beijing (Feb-Mar 2024)

2. UNIVERSITAS MERCU BUANA - Jakarta, Indonesia | 2015 - 2019
   Bachelor of Informatics Engineering
   - Nominated as Cum-laude Graduate in Faculty, GPA: 3.88/4.0
   - Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online

3. BEIJING INSTITUTE OF TECHNOLOGY - Beijing, China | 2015 - 2019
   Bachelor Degree of Computer Science and Technology
   - Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online

SKILLS:
- Hard Skills: AI & NLP (PyTorch, TensorFlow, Hugging Face Transformers, GPT, scikit-learn), Computer Vision (YOLO, OpenCV), Full-Stack Development (React, Next.js, Node.js), Database (MySQL, PostgreSQL), Mobile Development (Java & Kotlin), System Optimization & Data Integration
- Soft Skills: Analytical Thinking, Collaborative Approach, Strong Adaptability, Clear Communication, Initiative in Leading Projects
- Languages: English (Professional), Mandarin Chinese (Basic), Dutch (Basic)

When someone asks how to contact Ryan, always provide his direct contact information: "You can contact Ryan directly at +62 813 8764 3604 or via email at ryradit@gmail.com. He's available for project discussions, job opportunities, or any professional inquiries."

Be friendly, professional, and concise in your responses.`;
    
    // For Gemini 2.0 Flash, simplify our approach
    // Combine the history (if any), system prompt, and current message
    let prompt = systemPrompt + "\n\n";
    
    // Add chat history for context if available
    if (chatHistory.length > 0) {
      chatHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.parts[0].text}\n`;
      });
    }
    
    // Check if the message is asking about contact information
    const contactKeywords = ['contact', 'reach', 'email', 'phone', 'call', 'message', 'hire', 'get in touch'];
    const isContactQuery = contactKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    // Check if the message is asking for CV or resume
    const cvKeywords = ['cv', 'resume', 'curriculum vitae', 'download cv', 'get cv', 'view cv', 'see cv', 'portfolio'];
    const isCvQuery = cvKeywords.some(keyword => message.toLowerCase().includes(keyword));
    
    // Add the current message
    prompt += `User: ${message}\n`;
    
    // Add special instruction for contact queries
    if (isContactQuery) {
      prompt += `Remember to provide Ryan's direct contact details: phone +62 813 8764 3604 and email ryradit@gmail.com.\n`;
    }
    
    // Add special instruction for CV queries
    if (isCvQuery) {
      prompt += `The user is asking about my CV/resume. Tell them they can download my CV directly from this chat by clicking the download button that will appear below this message. Include [DOWNLOAD_CV] in your response so the frontend can replace it with an actual download button.\n`;
    }
    
    prompt += `Assistant:`;
    
    // Generate content with combined prompt
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return NextResponse.json({ response: text });
    
  } catch (error) {
    console.error('Error processing chat message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process chat message', details: errorMessage }, 
      { status: 500 }
    );
  }
}
