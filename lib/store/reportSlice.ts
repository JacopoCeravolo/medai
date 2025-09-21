import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ReportType = "REFERTO" | "NOTA" | "CHIRURGIA";

export interface Report {
  id: string;
  title: string;
  content?: string;
  blobUrl: string;
  reportType: ReportType;
  docName: string;
  informazioni: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ReportListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportState {
  currentReport: Report | null;
  currentReportId: string | null;
  reports: ReportListItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  currentReport: null,
  currentReportId: null,
  reports: [],
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setCurrentReport: (state, action: PayloadAction<Report>) => {
      state.currentReport = action.payload;
      state.currentReportId = action.payload.id;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentReportId: (state, action: PayloadAction<string | null>) => {
      state.currentReportId = action.payload;
    },
    setReports: (state, action: PayloadAction<ReportListItem[]>) => {
      state.reports = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addReport: (state, action: PayloadAction<ReportListItem>) => {
      state.reports.unshift(action.payload);
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
      state.currentReportId = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentReport,
  setCurrentReportId,
  setReports,
  addReport,
  clearCurrentReport,
  clearError,
} = reportSlice.actions;

export default reportSlice.reducer;
