import { ENV } from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CachedMessage {
  query: string;
  reply: string;
  timestamp: number;
}

const CACHE_KEY = 'chat_message_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class ChatService {
  private wsConnection: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private cache: Map<string, CachedMessage> = new Map();

  async initialize() {
    console.log('[ChatService] Initializing...');
    await this.loadCache();
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    try {
      const wsUrl = ENV.apiBaseUrl.replace('http', 'ws');
      const wsEndpoint = `${wsUrl}/ws/chat`;

      console.log('[ChatService] Connecting to WebSocket:', wsEndpoint);

      this.wsConnection = new WebSocket(wsEndpoint);

      this.wsConnection.onopen = () => {
        console.log('[ChatService] WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.wsConnection.onerror = (error) => {
        console.error('[ChatService] WebSocket error:', error);
      };

      this.wsConnection.onclose = () => {
        console.log('[ChatService] WebSocket disconnected');
        this.isConnected = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('[ChatService] WebSocket initialization error:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log('[ChatService] Reconnecting in', delay, 'ms...');
      setTimeout(() => this.initializeWebSocket(), delay);
    }
  }

  private async loadCache() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache = new Map(Object.entries(data));
        console.log('[ChatService] Cache loaded:', this.cache.size, 'items');
      }
    } catch (error) {
      console.warn('[ChatService] Cache load error:', error);
    }
  }

  private async saveCache() {
    try {
      const data = Object.fromEntries(this.cache);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('[ChatService] Cache save error:', error);
    }
  }

  private getCacheKey(query: string): string {
    return query.toLowerCase().trim().substring(0, 100);
  }

  private getCachedReply(query: string): string | null {
    const key = this.getCacheKey(query);
    const cached = this.cache.get(key);

    if (cached) {
      const now = Date.now();
      if (now - cached.timestamp < CACHE_DURATION) {
        console.log('[ChatService] Cache hit for:', key);
        return cached.reply;
      } else {
        this.cache.delete(key);
        this.saveCache();
      }
    }

    return null;
  }

  private setCachedReply(query: string, reply: string) {
    const key = this.getCacheKey(query);
    this.cache.set(key, {
      query,
      reply,
      timestamp: Date.now(),
    });
    this.saveCache();
  }

  async sendMessage(
    message: string,
    onStreamChunk?: (chunk: string) => void
  ): Promise<string> {
    console.log('[ChatService] Sending message:', message.substring(0, 50));

    // Check cache first
    const cached = this.getCachedReply(message);
    if (cached) {
      return cached;
    }

    // Try WebSocket first (faster, streaming)
    if (this.isConnected && this.wsConnection) {
      return this.sendViaWebSocket(message, onStreamChunk);
    }

    // Fallback to HTTP
    console.log('[ChatService] Using HTTP fallback');
    return this.sendViaHTTP(message);
  }

  private sendViaWebSocket(
    message: string,
    onStreamChunk?: (chunk: string) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket timeout'));
        }, 30000); // 30 second timeout

        if (!this.wsConnection) {
          clearTimeout(timeout);
          reject(new Error('WebSocket not connected'));
          return;
        }

        this.wsConnection.onmessage = (event) => {
          clearTimeout(timeout);
          const response = JSON.parse(event.data);
          const reply = response.reply || '';

          if (reply) {
            onStreamChunk?.(reply);
            this.setCachedReply(message, reply);
            resolve(reply);
          } else {
            reject(new Error('Empty response'));
          }
        };

        // Send message
        this.wsConnection.send(JSON.stringify({ message }));
        console.log('[ChatService] Message sent via WebSocket');
      } catch (error) {
        reject(error);
      }
    });
  }

  private async sendViaHTTP(message: string): Promise<string> {
    try {
      const url = `${ENV.apiBaseUrl}/chat`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || '';

      if (reply) {
        this.setCachedReply(message, reply);
      }

      return reply;
    } catch (error) {
      console.error('[ChatService] HTTP error:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  clearCache() {
    this.cache.clear();
    AsyncStorage.removeItem(CACHE_KEY);
  }
}

export const chatService = new ChatService();
