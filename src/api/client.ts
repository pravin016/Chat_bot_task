import axios from 'axios';
import { ENV } from '../config/env';

export const apiClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: 10000,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    (config as any).requestId = requestId;
    (config as any).startTime = Date.now();

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url} (${requestId})`);

    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as any;
    const duration = Date.now() - config.startTime;

    console.log(
      `[API] ✓ ${response.status} ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`
    );

    return response;
  },
  (error) => {
    const config = error.config as any;
    const duration = config?.startTime ? Date.now() - config.startTime : 0;

    console.error(
      `[API] ✗ ${error.response?.status || 'ERROR'} ${config?.method?.toUpperCase()} ${config?.url} (${duration}ms)`,
      error.message
    );

    return Promise.reject(error);
  }
)