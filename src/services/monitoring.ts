import { apiClient } from '../api/client';
import { ENV } from '../config/env';

interface ConnectionStatus {
  frontendOk: boolean;
  backendOk: boolean;
  chatReady: boolean;
  geminiConfigured: boolean;
  supabaseConnected: boolean;
  lastChecked: number;
  latency: number;
  errors: string[];
}

let lastStatus: ConnectionStatus | null = null;

/**
 * Check frontend-backend connection status
 * Call this periodically to verify system health
 */
export const checkConnectionStatus = async (): Promise<ConnectionStatus> => {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    // Verify frontend is working
    const frontendOk = true;

    // Check backend health endpoint
    let backendOk = false;
    let chatReady = false;
    let geminiConfigured = false;
    let supabaseConnected = false;

    try {
      const healthResponse = await apiClient.get('/health');
      backendOk = healthResponse.status === 200;
      chatReady = healthResponse.data?.chat_ready || false;
      geminiConfigured = healthResponse.data?.gemini_configured || false;
      supabaseConnected = healthResponse.data?.supabase_connected || false;

      console.log('[Monitoring] Backend health:', healthResponse.data);
    } catch (error: any) {
      errors.push(`Backend health check failed: ${error.message}`);
      console.error('[Monitoring] Backend health error:', error);
    }

    // Try to verify auth endpoint as secondary check
    try {
      await apiClient.get('/auth/me');
    } catch (error: any) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        errors.push(`Auth endpoint error: ${error.message}`);
      }
    }

    const latency = Date.now() - startTime;
    const status: ConnectionStatus = {
      frontendOk,
      backendOk,
      chatReady,
      geminiConfigured,
      supabaseConnected,
      lastChecked: Date.now(),
      latency,
      errors,
    };

    lastStatus = status;

    console.log('[Monitoring] Connection Status:', {
      frontend: frontendOk ? '✓' : '✗',
      backend: backendOk ? '✓' : '✗',
      chatReady: chatReady ? '✓' : '✗',
      latency: `${latency}ms`,
      errors: errors.length,
    });

    return status;
  } catch (error: any) {
    const status: ConnectionStatus = {
      frontendOk: false,
      backendOk: false,
      chatReady: false,
      geminiConfigured: false,
      supabaseConnected: false,
      lastChecked: Date.now(),
      latency: Date.now() - startTime,
      errors: [error.message],
    };

    lastStatus = status;
    return status;
  }
};

/**
 * Get last known connection status without making a request
 */
export const getLastStatus = (): ConnectionStatus | null => lastStatus;

/**
 * Get connection status summary as string
 */
export const getStatusSummary = (): string => {
  if (!lastStatus) return 'Not checked yet';

  const { frontendOk, backendOk, chatReady, latency, errors } = lastStatus;

  if (frontendOk && backendOk && chatReady) {
    return `✓ All systems operational (${latency}ms)`;
  }

  if (!backendOk) {
    return '✗ Backend connection failed';
  }

  if (!chatReady) {
    return '⚠ Chat service not ready';
  }

  if (errors.length > 0) {
    return `⚠ ${errors.length} warning(s)`;
  }

  return 'Status unknown';
};

/**
 * Enhanced health check with detailed logging
 */
export const logConnectionDetails = async () => {
  console.log('========== FRONTEND-BACKEND CONNECTION REPORT ==========');
  console.log(`API Base URL: ${ENV.apiBaseUrl}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const status = await checkConnectionStatus();

  console.log('\n--- CONNECTION STATUS ---');
  console.log(`Frontend: ${status.frontendOk ? '✓ OK' : '✗ FAILED'}`);
  console.log(`Backend: ${status.backendOk ? '✓ OK' : '✗ FAILED'}`);
  console.log(`Chat Ready: ${status.chatReady ? '✓ YES' : '✗ NO'}`);
  console.log(`Gemini: ${status.geminiConfigured ? '✓ CONFIGURED' : '✗ NOT CONFIGURED'}`);
  console.log(`Supabase: ${status.supabaseConnected ? '✓ CONNECTED' : '✗ DISCONNECTED'}`);
  console.log(`Latency: ${status.latency}ms`);

  if (status.errors.length > 0) {
    console.log('\n--- ERRORS ---');
    status.errors.forEach((err) => console.log(`  ✗ ${err}`));
  }

  console.log('========== END REPORT ==========\n');

  return status;
};

/**
 * Setup periodic health checks
 */
export const startPeriodicHealthChecks = (intervalMs = 60000) => {
  console.log('[Monitoring] Starting periodic health checks every', intervalMs, 'ms');

  // Initial check
  checkConnectionStatus();

  // Periodic checks
  const interval = setInterval(() => {
    checkConnectionStatus();
  }, intervalMs);

  // Return stop function
  return () => {
    console.log('[Monitoring] Stopping periodic health checks');
    clearInterval(interval);
  };
};
