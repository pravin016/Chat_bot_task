import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useAppSelector } from '../../store/hooks';

interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  style?: ViewStyle;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, style, borderRadius = 8 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useAppSelector((state) => state.theme);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const backgroundColor = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};
