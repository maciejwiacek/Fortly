import type { ChatMessage } from './types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function getApiKey(): string {
  return process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
}

// In-memory cache for insight requests
const insightCache = new Map<string, { text: string; fetchedAt: number }>();
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Send a chat conversation to Gemini with financial context.
 * Returns the AI response text, or null on error.
 */
export async function chatWithAI(
  messages: ChatMessage[],
  financialContext: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const contents = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const body = {
      systemInstruction: {
        parts: [{ text: financialContext }],
      },
      contents,
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

/**
 * Generate a single daily financial insight.
 * Results are cached for 15 minutes to avoid duplicate calls.
 */
export async function generateInsight(
  financialContext: string
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  // Check cache
  const today = new Date().toISOString().slice(0, 10);
  const cached = insightCache.get(today);
  if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION_MS) {
    return cached.text;
  }

  try {
    const body = {
      systemInstruction: {
        parts: [{ text: financialContext }],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Na podstawie moich danych finansowych, daj mi jedną krótką, konkretną poradę finansową na dziś (max 2-3 zdania). Bądź konkretny - podawaj kwoty i nazwy kategorii. Nie używaj nagłówków ani list.',
            },
          ],
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    if (text) {
      insightCache.set(today, { text, fetchedAt: Date.now() });
    }

    return text;
  } catch {
    return null;
  }
}
