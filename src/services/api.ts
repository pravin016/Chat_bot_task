import { ENV } from '../config/env';

// Service logic for handling HTTP requests to the FastAPI backend, including automatic retry mechanisms.
type ChatRequest = {
  message: string;
};

type ChatResponse = {
  reply: string;
};

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 1000): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (res.status >= 500 && retries > 0) {
        console.warn(`[API] Server Error ${res.status}. Retrying in ${backoff}ms...`);
        await wait(backoff);
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      const text = await res.text();
      console.error(`[API Error] URL: ${url} | Status: ${res.status} | Body: ${text}`);
      throw new Error(text || `Request failed (${res.status})`);
    }
    return res;
  } catch (error) {
    if (retries > 0 && !(error instanceof Error && error.message.includes('Status:'))) {
      console.warn(`[API] Network failure. Retrying in ${backoff}ms...`, error);
      await wait(backoff);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function sendChatMessage(message: string, accessToken?: string): Promise<string> {
  if (!ENV.apiBaseUrl) {
    throw new Error('Missing EXPO_PUBLIC_API_BASE_URL');
  }

  const payload: ChatRequest = { message };
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  console.log(`[API] Sending chat request...`);
  const response = await fetchWithRetry(`${ENV.apiBaseUrl}/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ChatResponse;
  console.log(`[API] Chat response received.`);
  return data.reply;
}
