import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const status = await Network.getNetworkStateAsync();
        if (!cancelled) {
          // In some emulators, isInternetReachable may erroneously return false.
          setIsOnline(Boolean(status.isConnected));
        }
      } catch {
        if (!cancelled) setIsOnline(true);
      }
    };

    check();
    const interval = setInterval(check, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { isOnline };
}

