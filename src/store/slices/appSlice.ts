import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  isSubscribed: boolean;
  freeChatCount: number;
  userName: string;
  userAvatar: string;
  isFirstLaunch: boolean;
}

const initialState: AppState = {
  isSubscribed: false,
  freeChatCount: 0,
  userName: 'User',
  userAvatar: 'tree',
  isFirstLaunch: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.isSubscribed = action.payload;
    },
    setSubscription: (state, action: PayloadAction<boolean>) => {
      state.isSubscribed = action.payload;
    },
    toggleSubscription: (state) => {
      state.isSubscribed = !state.isSubscribed;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserAvatar: (state, action: PayloadAction<string>) => {
      state.userAvatar = action.payload; // Could be 'tree', 'cat', 'robot', etc.
    },
    incrementChatCount: (state) => {
      state.freeChatCount += 1;
    },
    resetChatCount: (state) => {
      state.freeChatCount = 0;
    },
    setIsFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    }
  },
});

export const { 
  setSubscribed,
  setSubscription,
  toggleSubscription,
  setUserName,
  setUserAvatar,
  incrementChatCount, 
  resetChatCount,
  setIsFirstLaunch
} = appSlice.actions;
export default appSlice.reducer;
