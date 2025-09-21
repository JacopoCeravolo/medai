import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { Report, ReportListItem } from '../store/reportSlice';

// Query Keys
export const QUERY_KEYS = {
  reports: ['reports'] as const,
  report: (id: string) => ['reports', id] as const,
};

// API Functions
const fetchReports = async (): Promise<ReportListItem[]> => {
  const response = await api.get('/api/report');
  return response.reports;
};

const fetchReport = async (id: string): Promise<Report> => {
  const response = await api.get(`/api/report/${id}`);
  return response.report;
};

const createReport = async (reportData: { 
  title: string; 
  content: string;
  reportType: string;
  docName: string;
  informazioni: string;
  note: string;
}): Promise<Report> => {
  const response = await api.post('/api/report', reportData);
  return response.report;
};

const updateReportContent = async ({ id, content }: { id: string; content: string }): Promise<{ id: string; blobUrl: string; updatedAt: Date }> => {
  const response = await api.put(`/api/report/${id}`, { content });
  return response.report;
};

const updateReport = async ({ id, ...data }: { id: string; title?: string; content?: string }): Promise<Report> => {
  const response = await api.put(`/api/report/${id}`, data);
  return response.report;
};

const deleteReport = async (id: string): Promise<void> => {
  await api.delete(`/api/report/${id}`);
};

// React Query Hooks
export const useReports = () => {
  return useQuery({
    queryKey: QUERY_KEYS.reports,
    queryFn: fetchReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.report(id),
    queryFn: () => fetchReport(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReport,
    onSuccess: (newReport) => {
      // Invalidate and refetch reports list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
      // Invalidate the specific report cache to force refetch with content
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.report(newReport.id) });
      // Pre-fetch the full report data to populate cache immediately
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.report(newReport.id),
        queryFn: () => fetchReport(newReport.id),
      });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateReport,
    onSuccess: (updatedReport) => {
      // Update the specific report in cache
      queryClient.setQueryData(QUERY_KEYS.report(updatedReport.id), updatedReport);
      // Invalidate reports list to update the list view
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    },
  });
};

export const useUpdateReportContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReportContent,
    onSuccess: (updatedReport, { id }) => {
      // When the mutation succeeds, invalidate the specific report query to refetch its content
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.report(id) });
      // Also invalidate the reports list to update the `updatedAt` timestamp
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: (_, deletedId) => {
      // Remove from reports list cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports });
      // Remove the specific report from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.report(deletedId as string) });
    },
  });
};
