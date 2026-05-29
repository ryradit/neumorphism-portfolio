import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3-flash',
  'gemini-3-flash-lite'
];

interface GenerationResult {
  text: string;
  model: string;
}

/**
 * Attempts to generate content using the primary model (gemini-2.5-flash)
 * and falls back to gemini-2.5-flash-lite, gemini-3-flash, and gemini-3-flash-lite in sequence.
 */
export async function generateContentWithFallback(
  apiKey: string,
  prompt: string,
  responseMimeType?: string
): Promise<GenerationResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Gemini client] Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: responseMimeType ? { responseMimeType } : undefined
      });
      const result = await model.generateContent(prompt);
      
      if (result?.response) {
        const text = result.response.text();
        if (text !== undefined && text !== null) {
          return { text, model: modelName };
        }
      }
    } catch (error) {
      console.warn(`[Gemini client] Failed generation with model ${modelName}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('All Gemini model generation attempts failed.');
}
