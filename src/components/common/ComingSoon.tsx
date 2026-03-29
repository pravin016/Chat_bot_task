import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown, withRepeat, withTiming, useAnimatedStyle, useSharedValue, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Fonts } from '../../../constants/theme';
import { RFValue } from '../../utils/responsive';

export const ComingSoon: React.FC<{ title?: string }> = ({ title = 'Coming Soon!' }) => {
  const theme = useAppTheme();
  
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    marginBottom: 20
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.content}>
        <Animated.View style={[styles.iconWrapper, { backgroundColor: theme.colors.tint + '1A' }, animatedStyle]}>
          <Ionicons name={'hammer-outline'} size={RFValue(60)} color={theme.colors.tint} />
        </Animated.View>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: Fonts.bold }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.icon, fontFamily: Fonts.regular }]}>
          We are busy crafting an amazing experience for this section. Check back soon for updates!
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: RFValue(24),
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFValue(15),
    textAlign: 'center',
    lineHeight: RFValue(22),
  },
});
