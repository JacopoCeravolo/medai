import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isHistoryVisible: boolean;
  isAiGenerating: boolean;
}

const initialState: UIState = {
  isHistoryVisible: true,
  isAiGenerating: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setIsHistoryVisible: (state, action: PayloadAction<boolean>) => {
      state.isHistoryVisible = action.payload;
    },
    setIsAiGenerating: (state, action: PayloadAction<boolean>) => {
      state.isAiGenerating = action.payload;
    },
  },
});

export const { setIsHistoryVisible, setIsAiGenerating } = uiSlice.actions;
export default uiSlice.reducer;
