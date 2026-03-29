import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function LoginOldRoute() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new auth login route
    router.replace('/(auth)/login');
  }, []);

  return null;
}

