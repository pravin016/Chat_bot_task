import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    subscription: subscriptionReducer,
  },
});