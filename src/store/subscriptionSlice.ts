import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionState {
  isPro: boolean;
  plan: 'free' | 'pro' | 'annual';
  messageCount: number;
  dayResetTime: number | null;
}

const initialState: SubscriptionState = {
  isPro: false,
  plan: 'free',
  messageCount: 0,
  dayResetTime: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPro: (state, action: PayloadAction<boolean>) => {
      state.isPro = action.payload;
    },
    setPlan: (state, action: PayloadAction<'free' | 'pro' | 'annual'>) => {
      state.plan = action.payload;
      state.isPro = action.payload !== 'free';
    },
    incrementMessageCount: (state) => {
      state.messageCount += 1;
    },
    resetMessageCount: (state) => {
      state.messageCount = 0;
      state.dayResetTime = Date.now() + 24 * 60 * 60 * 1000; // Reset in 24 hours
    },
    checkAndResetIfNeeded: (state) => {
      if (state.dayResetTime && Date.now() > state.dayResetTime) {
        state.messageCount = 0;
        state.dayResetTime = Date.now() + 24 * 60 * 60 * 1000;
      }
    },
  },
});

export const {
  setPro,
  setPlan,
  incrementMessageCount,
  resetMessageCount,
  checkAndResetIfNeeded,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
