import { createOpenAI } from "@ai-sdk/openai";

/**
 * AI provider configured via environment variables.
 *
 * Defaults to Groq (free, OpenAI-compatible).
 * Swap OPENAI_BASE_URL + OPENAI_API_KEY to use any OpenAI-compatible provider:
 *   Groq:      https://api.groq.com/openai/v1
 *   OpenAI:    https://api.openai.com/v1
 *   Together:  https://api.together.xyz/v1
 *   DeepSeek:  https://api.deepseek.com/v1
 */
export const provider = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL ?? "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

/** Model for structured data extraction (needs tool-calling support). */
export const EXTRACT_MODEL = process.env.OPENAI_MODEL ?? "llama-3.3-70b-versatile";

/** Model for conversational AI mentor. */
export const MENTOR_MODEL = process.env.OPENAI_MODEL ?? "llama-3.3-70b-versatile";
