import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Fonts } from '../../../constants/theme';
import { RFValue } from '../../utils/responsive';

interface ComingSoonProps {
  title?: string;
  icon?: any;
}

export const ComingSoonFallback = ({ title = 'Feature in Works', icon = 'hammer-outline' }: ComingSoonProps) => {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.content}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.tint + '1A' }]}>
          <Ionicons name={icon} size={RFValue(60)} color={theme.colors.tint} />
        </View>
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
    marginBottom: 24,
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
