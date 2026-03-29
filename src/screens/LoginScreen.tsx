import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { setUser } from '../store/authSlice';
import { useAppTheme } from '../hooks/useAppTheme';

const LoginScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        console.log('[Auth] User already logged in:', data.session.user.email);
        dispatch(setUser(data.session.user));
        router.replace('/(tabs)/chat');
      }
    } catch (error) {
      console.warn('[Auth] Check status error:', error);
    }
  };

  const validateInputs = (): boolean => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      console.log('[Auth] Attempting login:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('[Auth] Login error:', error.message);
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Login Failed', 'Invalid email or password. Please check and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          Alert.alert('Email Not Confirmed', 'Please verify your email first.');
        } else {
          Alert.alert('Login Failed', error.message);
        }
        return;
      }

      if (data?.user) {
        console.log('[Auth] Login successful:', data.user.email);
        dispatch(setUser(data.user));
        Alert.alert('Success', 'Logged in successfully! 👋');
        router.replace('/(tabs)/chat');
      }
    } catch (error) {
      console.error('[Auth] Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      console.log('[Auth] Attempting signup:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: undefined, // No email redirect needed for mobile
        },
      });

      if (error) {
        console.error('[Auth] Signup error:', error.message);
        if (error.message.includes('already registered')) {
          Alert.alert('Account Exists', 'This email is already registered. Please login instead.');
        } else {
          Alert.alert('Signup Failed', error.message);
        }
        return;
      }

      if (data?.user) {
        console.log('[Auth] Signup successful:', data.user.email);
        Alert.alert(
          'Account Created',
          'Your account has been created! You can now log in.',
          [{ text: 'OK', onPress: () => setIsSignUp(false) }]
        );
        // Clear form but stay on signup mode for them to login
        setPassword('');
      }
    } catch (error) {
      console.error('[Auth] Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    console.log('[Auth] Continuing as guest');
    dispatch(setUser({ id: 'guest', email: 'guest@anonymous.local' }));
    router.replace('/(tabs)/chat');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={[styles.logo, { color: theme.colors.text }]}>🤖</Text>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Chat Assistant
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.icon }]}>
              {isSignUp ? 'Create your account' : 'Welcome back!'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: email ? theme.colors.primary : '#ddd',
                    backgroundColor: theme.colors.card,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="your@email.com"
                  placeholderTextColor={theme.colors.icon}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: password ? theme.colors.primary : '#ddd',
                    backgroundColor: theme.colors.card,
                  },
                ]}
              >
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.icon}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Minimum length hint */}
            <Text style={[styles.hint, { color: theme.colors.icon }]}>
              Password must be at least 6 characters
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonSection}>
            {/* Primary Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: theme.colors.primary, opacity: isLoading ? 0.5 : 1 },
              ]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignUp ? 'Create Account' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Sign Up / Login */}
            <View style={styles.toggleSection}>
              <Text style={[styles.toggleText, { color: theme.colors.icon }]}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setPassword(''); // Clear password when switching
                }}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.toggleButton,
                    { color: theme.colors.primary, opacity: isLoading ? 0.5 : 1 },
                  ]}
                >
                  {isSignUp ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Guest Button */}
            <TouchableOpacity
              style={[styles.guestButton, { borderColor: theme.colors.icon }]}
              onPress={handleContinueAsGuest}
              disabled={isLoading}
            >
              <Text style={[styles.guestButtonText, { color: theme.colors.text }]}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footerSection}>
            <Text style={[styles.footerText, { color: theme.colors.icon }]} numberOfLines={2}>
              By signing up, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  inputIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeIcon: {
    fontSize: 18,
    padding: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  buttonSection: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  toggleButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerSection: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LoginScreen;
