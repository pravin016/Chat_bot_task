import { Platform } from 'react-native';
import { ENV } from '../config/env';

let Purchases: any = null;
let PurchasesError: any = null;
let PurchasesPackage: any = null;
let CustomerInfo: any = null;

let configured = false;
let initPromise: Promise<void> | null = null;

// Try to import Purchases library
try {
  const purchasesModule = require('react-native-purchases');
  Purchases = purchasesModule.default || purchasesModule;
  PurchasesError = purchasesModule.PurchasesError;
  PurchasesPackage = purchasesModule.PurchasesPackage;
  CustomerInfo = purchasesModule.CustomerInfo;
} catch (importError) {
  console.warn('[RevenueCat] react-native-purchases not available:', importError);
}

// Try to import LogLevel, but handle if not available
let LogLevel: any = {
  Debug: 6,
  Info: 5,
  Warn: 4,
  Error: 3,
};

try {
  const imported = require('react-native-purchases');
  if (imported?.LogLevel) {
    LogLevel = imported.LogLevel;
  }
} catch (e) {
  console.warn('[RevenueCat] LogLevel not available, using defaults');
}

// Check if Purchases is available
function isPurchasesAvailable(): boolean {
  if (!Purchases) {
    console.warn('[RevenueCat] Purchases library not available');
    return false;
  }
  return true;
}

export async function initRevenueCat(userId?: string) {
  // Return existing initialization promise if already started
  if (initPromise) return initPromise;
  if (configured) return;

  initPromise = (async () => {
    try {
      if (!isPurchasesAvailable()) {
        console.warn('[RevenueCat] Purchases not available, skipping init');
        configured = false;
        return;
      }

      const apiKey =
        Platform.OS === 'ios'
          ? ENV.revenuecatIosApiKey
          : ENV.revenuecatAndroidApiKey;

      if (!apiKey) {
        console.warn('[RevenueCat] API key missing. Purchases are disabled.');
        configured = false;
        return;
      }

      console.log('[RevenueCat] Configuring with user:', userId || 'anonymous');

      // Skip log level setting - not essential and causes issues in browser mode
      // try {
      //   if (Purchases?.setLogLevel) {
      //     await Purchases.setLogLevel(LogLevel.Debug);
      //   }
      // } catch (logError) {
      //   console.warn('[RevenueCat] Could not set log level:', logError);
      // }

      if (Purchases?.configure) {
        await Purchases.configure({
          apiKey,
          appUserID: userId,
        });
        configured = true;
        console.log('[RevenueCat] Configured successfully');
      } else {
        console.warn('[RevenueCat] Purchases.configure not available');
        configured = false;
      }
    } catch (error) {
      console.error('[RevenueCat] Configuration error:', error);
      configured = false;
      throw error;
    }
  })();

  return initPromise;
}

async function waitForInit(maxRetries = 3, timeout = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    if (configured) return true;
    
    try {
      // Try to initialize if not already done
      if (initPromise) {
        await initPromise;
      } else {
        await initRevenueCat();
      }
      
      if (configured) return true;
    } catch (error) {
      console.log(`[RevenueCat] Init attempt ${i + 1} failed, retrying...`);
    }
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, timeout / maxRetries));
  }
  
  return configured;
}

export async function getOfferings() {
  try {
    if (!isPurchasesAvailable()) return null;

    // Wait for initialization before calling getOfferings
    const isReady = await waitForInit();
    if (!isReady) {
      console.warn('[RevenueCat] Not initialized, returning null');
      return null;
    }

    if (!Purchases?.getOfferings) {
      console.warn('[RevenueCat] getOfferings not available');
      return null;
    }

    const offerings = await Purchases.getOfferings();
    console.log('[RevenueCat] Got offerings successfully');
    return offerings;
  } catch (error) {
    console.error('[RevenueCat] Error getting offerings:', error);
    return null;
  }
}

export async function purchasePackage(
  pkg: any
): Promise<{ success: boolean; customerInfo?: any }> {
  try {
    if (!isPurchasesAvailable()) return { success: false };

    console.log('[RevenueCat] Purchasing:', pkg.identifier);
    if (!Purchases?.purchasePackage) {
      console.warn('[RevenueCat] purchasePackage not available');
      return { success: false };
    }

    const customerInfo = await Purchases.purchasePackage(pkg);
    console.log('[RevenueCat] Purchase successful!');
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error?.userCancelled) {
      console.log('[RevenueCat] User cancelled');
    } else {
      console.error('[RevenueCat] Purchase failed:', error?.message);
    }
    return { success: false };
  }
}

export async function getCustomerInfo(): Promise<any | null> {
  try {
    if (!isPurchasesAvailable()) return null;

    if (!Purchases?.getCustomerInfo) {
      console.warn('[RevenueCat] getCustomerInfo not available');
      return null;
    }

    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.error('[RevenueCat] Error getting customer info:', error);
    return null;
  }
}

export async function checkSubscriptionStatus(): Promise<'free' | 'pro' | 'annual'> {
  try {
    // Wait for initialization before checking status
    const isReady = await waitForInit();
    if (!isReady) {
      console.warn('[RevenueCat] Not initialized, returning free');
      return 'free';
    }

    const customerInfo = await getCustomerInfo();
    if (!customerInfo) return 'free';

    const entitlements = customerInfo.accessLevelsByIdentifier;

    // Check for active entitlements
    const hasProAccess = Object.values(entitlements).some(
      (ent) => ent.isActive && (ent.identifier === 'pro' || ent.identifier === 'pro_access')
    );

    if (!hasProAccess) return 'free';

    // Check if it's annual or monthly
    const activeSubscriptions = customerInfo.activeSubscriptions;
    const isAnnual = activeSubscriptions.some((sub) => sub.includes('annual'));

    return isAnnual ? 'annual' : 'pro';
  } catch (error) {
    console.error('[RevenueCat] Error checking status:', error);
    return 'free';
  }
}

export async function restoreTransactions(): Promise<{ success: boolean; customerInfo?: any }> {
  try {
    if (!isPurchasesAvailable()) return { success: false };

    if (!Purchases?.restoreTransactions) {
      console.warn('[RevenueCat] restoreTransactions not available');
      return { success: false };
    }

    const customerInfo = await Purchases.restoreTransactions();
    console.log('[RevenueCat] Transactions restored');
    return { success: true, customerInfo };
  } catch (error) {
    console.error('[RevenueCat] Restore error:', error);
    return { success: false };
  }
}

export { CustomerInfo, Purchases, PurchasesError, PurchasesPackage };

