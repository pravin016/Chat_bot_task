import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
  isDarkMode: boolean;
  activeTheme: 'light' | 'dark' | 'system';
}

const initialState: ThemeState = {
  isDarkMode: false,
  activeTheme: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.activeTheme = state.isDarkMode ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.activeTheme = action.payload;
      if (action.payload !== 'system') {
        state.isDarkMode = action.payload === 'dark';
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    }
  },
});

export const { toggleTheme, setTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
