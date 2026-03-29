import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initRevenueCat, checkSubscriptionStatus } from '../services/revenuecat';
import { setPlan } from '../store/subscriptionSlice';

export const useRevenueCatInit = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  const initializeRevenueCat = async () => {
    try {
      console.log('[useRevenueCatInit] Initializing RevenueCat...');
      setInitError(null);

      // Initialize RevenueCat - wait for completion
      await initRevenueCat();
      console.log('[useRevenueCatInit] RevenueCat initialized');

      // Small delay to ensure RevenueCat is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check current subscription status
      const status = await checkSubscriptionStatus();
      console.log('[useRevenueCatInit] Current status:', status);

      // Update Redux state
      dispatch(setPlan(status as 'free' | 'pro' | 'annual'));
    } catch (error) {
      console.error('[useRevenueCatInit] Error:', error);
      setInitError(String(error));
      // Set default to free on error
      dispatch(setPlan('free' as 'free' | 'pro' | 'annual'));
    } finally {
      setIsInitializing(false);
    }
  };

  return { isInitializing, initError };
};
