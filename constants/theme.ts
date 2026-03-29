/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1E1F21',
    background: '#FCFAF4',
    tint: '#4CB77B',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#4CB77B',
    card: '#FFFFFF',
    border: '#E5E7EB',
    error: '#DC2626',
    success: '#39A873',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: '#6FCDB3',
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#6FCDB3',
    card: '#1F2937',
    border: '#374151',
    error: '#EF4444',
    success: '#10B981',
  },
};

export const Fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};
