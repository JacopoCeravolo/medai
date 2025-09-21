import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import reportReducer from './reportSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    report: reportReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
