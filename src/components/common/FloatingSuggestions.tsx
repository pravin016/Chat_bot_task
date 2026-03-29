import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { getTheme, typography } from '../../theme';
import { Skeleton } from './Skeleton';

interface FloatingSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  style?: ViewStyle;
  isLoading?: boolean;
}

export const FloatingSuggestions: React.FC<FloatingSuggestionsProps> = ({ suggestions, onSelect, style, isLoading = false }) => {
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const theme = getTheme(isDarkMode);

  // Staggered enter animation + flip
  const animValues = useRef(suggestions.map(() => new Animated.Value(0))).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset animations when suggestions change
    animValues.forEach(anim => anim.setValue(0));
    flipAnim.setValue(0);

    // Flip entrance effect
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Staggered entrance
    const animations = animValues.map((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );
    Animated.stagger(150, animations).start();

    // Infinite Float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();

  }, [suggestions, animValues, flipAnim, floatAnim]);

  const translateYFloat = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  // Flip rotation interpolation
  const flipRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '0deg']
  });

  const skeletonCount = 3;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [
            { translateY: translateYFloat },
            { rotateX: flipRotate }
          ],
          perspective: 1000
        }, 
        style
      ]}
    >
      {isLoading ? (
        // Skeleton Loading State
        [...Array(skeletonCount)].map((_, index) => (
          <Animated.View 
            key={`skeleton-${index}`}
            style={{ 
              marginBottom: theme.spacing.md,
            }}
          >
            <Skeleton 
              width="100%" 
              height={44} 
              borderRadius={24}
            />
          </Animated.View>
        ))
      ) : (
        // Actual Suggestions
        suggestions.map((item, index) => {
          const translateY = animValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          });
          const opacity = animValues[index];
          const scale = animValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });

          return (
            <Animated.View 
              key={index} 
              style={{ 
                opacity, 
                transform: [
                  { translateY },
                  { scale }
                ], 
                marginBottom: theme.spacing.md 
              }}
            >
              <TouchableOpacity 
                style={[
                  styles.bubble, 
                  { 
                    backgroundColor: isDarkMode ? theme.colors.surface : theme.colors.surface, 
                    borderColor: theme.colors.primary,
                    borderWidth: 1
                  }
                ]} 
                activeOpacity={0.7}
                onPress={() => onSelect(item)}
              >
                <Text style={[styles.text, { color: theme.colors.text }]}>{item}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
  }
});
