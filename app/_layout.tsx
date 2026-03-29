import { Stack, useRouter } from 'expo-router';
import * as SplashScreenModule from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { initRevenueCat } from '../src/services/revenuecat';
import { store } from '../src/store';

// Keep the splash screen visible while we fetch resources
SplashScreenModule.preventAutoHideAsync();

function RootLayoutContent() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    async function initializeApp() {
      try {
        console.log('[App] Initializing...');

        // Initialize RevenueCat
        await initRevenueCat().catch(err => {
          console.warn('[App] RevenueCat init failed:', err);
        });

        // Hide splash after initialization
        await SplashScreenModule.hideAsync();

        // Go directly to chat (no login required)
        setTimeout(() => {
          router.replace('/(tabs)/chat');
        }, 300);
      } catch (error) {
        console.error('[App] Initialization error:', error);
        await SplashScreenModule.hideAsync();
        router.replace('/(tabs)/chat');
      }
    }

    initializeApp();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ animationEnabled: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}