import { createOpenAI } from "@ai-sdk/openai";

export const provider = createOpenAI({
  baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const EXTRACT_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

export const MENTOR_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
