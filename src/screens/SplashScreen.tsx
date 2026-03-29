import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  SafeAreaView,
  StyleSheet,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../hooks/useAppTheme';

const SplashScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();
  
  // Animation values
  const scaleAnim = new Animated.Value(0.5);
  const opacityAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-100);
  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = async () => {
    // Logo scale and fade in
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Title slide in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 900,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Bouncing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after 3 seconds
    setTimeout(() => {
      router.replace('/(tabs)/chat');
    }, 3000);
  };

  const bounceTranslate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Logo with scale animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={styles.logoEmoji}>🤖</Text>
        </Animated.View>

        {/* Title with slide animation */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Chat Assistant
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.icon }]}>
            Powered by AI
          </Text>
        </Animated.View>

        {/* Bouncing dots */}
        <Animated.View
          style={[
            styles.dotsContainer,
            {
              transform: [{ translateY: bounceTranslate }],
            },
          ]}
        >
          <View style={[styles.dot, { backgroundColor: theme.colors.tint }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.tint, opacity: 0.6 }]} />
          <View style={[styles.dot, { backgroundColor: theme.colors.tint, opacity: 0.3 }]} />
        </Animated.View>

        {/* Loading text */}
        <Animated.View
          style={[
            { opacity: opacityAnim },
          ]}
        >
          <Text style={[styles.loadingText, { color: theme.colors.icon }]}>
            Initializing...
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoEmoji: {
    fontSize: 80,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  loadingText: {
    fontSize: 12,
    letterSpacing: 2,
  },
});

export default SplashScreen;
