import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '../../store/hooks';

interface MainContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  noPadding?: boolean;
}

export const MainContainer: React.FC<MainContainerProps> = ({ 
  children, 
  style, 
  edges = ['top', 'bottom', 'left', 'right'],
  noPadding = false 
}) => {
  const { isDarkMode } = useAppSelector((state) => state.theme);

  // Dynamic gradients (dark vs light)
  const gradientColors = (isDarkMode 
    ? ['#111827', '#1F2937', '#111827'] 
    : ['#FFFFFF', '#F5F5F5', '#E5E7EB']) as readonly [string, string, ...string[]];

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
    >
      <SafeAreaView 
        style={noPadding ? styles.noPaddingArea : styles.safeArea} 
        edges={edges}
      >
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16, // Consistent padding scaling can be applied via Utils later
  },
  noPaddingArea: {
    flex: 1,
  }
});
