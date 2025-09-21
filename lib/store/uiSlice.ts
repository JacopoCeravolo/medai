import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isHistoryVisible: boolean;
}

const initialState: UIState = {
  isHistoryVisible: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsHistoryVisible: (state, action: PayloadAction<boolean>) => {
      state.isHistoryVisible = action.payload;
    },
  },
});

export const { setIsHistoryVisible } = uiSlice.actions;
export default uiSlice.reducer;
