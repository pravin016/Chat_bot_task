import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useAppTheme } from '../../hooks/useAppTheme';

const { width, height } = Dimensions.get('window');

// Number of orbs to render
const ORBS = 3;

export const LiveBackground: React.FC = () => {
  const theme = useAppTheme();

  // Orb 1 animation values
  const orb1Tx = useSharedValue(0);
  const orb1Ty = useSharedValue(0);
  const orb1Scale = useSharedValue(1);

  // Orb 2 animation values
  const orb2Tx = useSharedValue(0);
  const orb2Ty = useSharedValue(0);
  const orb2Scale = useSharedValue(1);

  // Orb 3 animation values
  const orb3Tx = useSharedValue(0);
  const orb3Ty = useSharedValue(0);
  const orb3Scale = useSharedValue(1);

  useEffect(() => {
    const config = { duration: 12000, easing: Easing.inOut(Easing.sin) };
    const configFast = { duration: 8000, easing: Easing.inOut(Easing.sin) };

    // Orb 1: Upper left, moving dynamically
    orb1Tx.value = withRepeat(withSequence(withTiming(40, config), withTiming(-40, config)), -1, true);
    orb1Ty.value = withRepeat(withSequence(withTiming(60, config), withTiming(-60, config)), -1, true);
    orb1Scale.value = withRepeat(withSequence(withTiming(1.2, config), withTiming(0.9, config)), -1, true);

    // Orb 2: Bottom right, moving gracefully
    orb2Tx.value = withRepeat(withSequence(withTiming(-50, configFast), withTiming(50, configFast)), -1, true);
    orb2Ty.value = withRepeat(withSequence(withTiming(-70, configFast), withTiming(70, configFast)), -1, true);
    orb2Scale.value = withRepeat(withSequence(withTiming(1.1, configFast), withTiming(0.8, configFast)), -1, true);

    // Orb 3: Center stretching
    orb3Tx.value = withRepeat(withSequence(withTiming(30, config), withTiming(-30, configFast)), -1, true);
    orb3Ty.value = withRepeat(withSequence(withTiming(-40, configFast), withTiming(40, config)), -1, true);
    orb3Scale.value = withRepeat(withSequence(withTiming(1.3, config), withTiming(0.7, configFast)), -1, true);
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb1Tx.value },
      { translateY: orb1Ty.value },
      { scale: orb1Scale.value },
    ],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb2Tx.value },
      { translateY: orb2Ty.value },
      { scale: orb2Scale.value },
    ],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: orb3Tx.value },
      { translateY: orb3Ty.value },
      { scale: orb3Scale.value },
    ],
  }));

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.background, overflow: 'hidden' }]}>
      <Animated.View style={[
        styles.orb, 
        styles.orb1, 
        { backgroundColor: theme.colors.tint, opacity: theme.isDark ? 0.15 : 0.08 }, 
        orb1Style
      ]} />
      <Animated.View style={[
        styles.orb, 
        styles.orb2, 
        { backgroundColor: theme.colors.tint, opacity: theme.isDark ? 0.12 : 0.06 }, 
        orb2Style
      ]} />
      <Animated.View style={[
        styles.orb, 
        styles.orb3, 
        { backgroundColor: '#6FCDB3', opacity: theme.isDark ? 0.1 : 0.05 }, 
        orb3Style
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: width,
    width: width * 1.5,
    height: width * 1.5,
  },
  orb1: {
    top: -width * 0.5,
    left: -width * 0.4,
  },
  orb2: {
    bottom: -width * 0.6,
    right: -width * 0.3,
  },
  orb3: {
    top: height * 0.3,
    left: width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
  },
});
