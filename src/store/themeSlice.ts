import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppTheme = 'matcha' | 'obsidian' | 'ocean' | 'sunset' | 'sakura';
export type AppThemeMode = 'light' | 'dark' | 'adaptive';

interface ThemeState {
  theme: AppTheme;
  mode: AppThemeMode;
}

const initialState: ThemeState = {
  theme: 'matcha',
  mode: 'adaptive',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<AppTheme>) {
      state.theme = action.payload;
    },
    setMode(state, action: PayloadAction<AppThemeMode>) {
      state.mode = action.payload;
    },
  },
});

export const { setTheme, setMode } = themeSlice.actions;
export default themeSlice.reducer;
