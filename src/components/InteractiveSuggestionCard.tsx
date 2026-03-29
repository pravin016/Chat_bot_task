import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useAppSelector } from '../store/hooks';
import { getTheme, typography } from '../theme';
import { Skeleton } from './common/Skeleton';

interface InteractiveSuggestionCardProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  style?: ViewStyle;
  isLoading?: boolean;
}

export const InteractiveSuggestionCard: React.FC<InteractiveSuggestionCardProps> = ({
  suggestions,
  onSelect,
  style,
  isLoading = false,
}) => {
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const theme = getTheme(isDarkMode);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale in animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Float animation
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
        }),
      ])
    ).start();
  }, [scaleAnim, floatAnim]);

  const handleNextSuggestion = () => {
    // Flip animation
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const handlePrevSuggestion = () => {
    // Flip animation
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: -1,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  const handleSelectCurrent = () => {
    if (suggestions.length > 0) {
      onSelect(suggestions[currentIndex]);
    }
  };

  const translateYFloat = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotationX = flipAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-90deg', '0deg', '90deg'],
  });

  const opacity = flipAnim.interpolate({
    inputRange: [-0.5, 0, 0.5],
    outputRange: [0.5, 1, 0.5],
  });

  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <Skeleton width={280} height={280} borderRadius={28} />
      </View>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: translateYFloat },
            { scale },
          ],
          perspective: 1000,
        },
        style,
      ]}
    >
      {/* Main Card */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? theme.colors.surface : '#FFFFFF',
            borderColor: theme.colors.primary,
            transform: [{ rotateX: rotationX }],
            opacity,
            shadowColor: theme.colors.primary,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSelectCurrent}
          style={styles.cardContent}
        >
          <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
            {suggestions[currentIndex]}
          </Text>
          <View style={styles.tapHint}>
            <Text style={[styles.tapHintText, { color: theme.colors.primary }]}>
              Tap to Select
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.navButton, { borderColor: theme.colors.primary }]}
          onPress={handlePrevSuggestion}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.primary }]}>
            ← Prev
          </Text>
        </TouchableOpacity>

        <View style={styles.indicatorContainer}>
          {suggestions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === currentIndex
                      ? theme.colors.primary
                      : `${theme.colors.primary}40`,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navButton, { borderColor: theme.colors.primary }]}
          onPress={handleNextSuggestion}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.primary }]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: 280,
    height: 280,
    borderRadius: 28,
    borderWidth: 2,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  suggestionText: {
    fontSize: 20,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
  },
  tapHint: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 200, 100, 0.1)',
  },
  tapHintText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    minWidth: 80,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
