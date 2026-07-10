import { GoogleGenAI } from "@google/genai";

let aiClient = null;

export function getGeminiClient() {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "limna-ai-js-app",
      },
    },
  });

  return aiClient;
}
