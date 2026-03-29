import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useSelector } from 'react-redux';
import { getTheme } from '../theme';

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export default function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
  const { isDarkMode } = useSelector((state: any) => state.theme);
  const theme = getTheme(isDarkMode);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Reveal the custom splash immediately after the native one hides
    opacity.value = withSequence(
      withTiming(1, { duration: 600 }),
      withDelay(
        2000,
        withTiming(0, { duration: 500 }, (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        })
      )
    );

    scale.value = withSequence(
      withSpring(1, { damping: 12, mass: 1, stiffness: 120 }),
      withDelay(2000, withTiming(1.2, { duration: 500 }))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <MaterialCommunityIcons name="pine-tree" size={100} color="#4CB77B" />
        <Text style={[styles.title, { color: theme.colors.text }]}>Helper Cane</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: '700',
  },
});
