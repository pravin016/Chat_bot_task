import { useEffect, useState } from 'react';
import { checkConnectionStatus, getStatusSummary } from '../services/monitoring';

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

export const useConnectionStatus = (enablePeriodicCheck = true) => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('Checking connection...');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Initial check
    const performCheck = async () => {
      setLoading(true);
      try {
        const result = await checkConnectionStatus();
        setStatus(result);
        setSummary(getStatusSummary());
      } catch (error) {
        console.error('[Hook] Connection check error:', error);
        setSummary('Connection check failed');
      } finally {
        setLoading(false);
      }
    };

    performCheck();

    // Periodic checks if enabled
    if (enablePeriodicCheck) {
      interval = setInterval(performCheck, 30000); // Check every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [enablePeriodicCheck]);

  const isConnected =
    status?.frontendOk && status?.backendOk && status?.chatReady;

  return {
    status,
    loading,
    isConnected,
    summary,
    latency: status?.latency || 0,
    errors: status?.errors || [],
  };
};
