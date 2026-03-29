export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#4F46E5', // Example purple/indigo
    secondary: '#10B981',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    primary: '#6366F1',
    secondary: '#34D399',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    error: '#F87171',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  }
};

export const typography = {
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  }
};

export const getTheme = (isDark: boolean) => ({
  colors: isDark ? colors.dark : colors.light,
  spacing,
  shadows: isDark ? shadows.dark : shadows.light,
  typography,
});
