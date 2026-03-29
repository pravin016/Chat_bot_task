import { useSelector } from 'react-redux';
import { Colors } from '../../constants/theme';
import { RootState } from '../store';
import { useColorScheme } from 'react-native';

export function useAppTheme() {
  const { isDarkMode, activeTheme } = useSelector((state: RootState) => state.theme);
  const systemScheme = useColorScheme();
  
  const isDark = activeTheme === 'system' 
    ? systemScheme === 'dark' 
    : isDarkMode;
    
  return {
    isDark,
    colors: isDark ? Colors.dark : Colors.light,
  };
}
