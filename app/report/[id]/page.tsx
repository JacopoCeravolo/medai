"use client";

import { useRouter, useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { setIsHistoryVisible } from "@/lib/store/uiSlice";
import { setCurrentReport, setCurrentReportId } from "@/lib/store/reportSlice";
import { useReport } from "@/lib/services/reportService";
import { useEffect } from "react";
import { HistoryPanel } from "@/components/HistoryPanel/HistoryPanel";
import { DocumentPanel } from "@/components/DocumentPanel/DocumentPanel";
import { EditChatContainer } from "@/components/EditChatContainer/EditChatContainer";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { initializeAuth } from "@/lib/store/userSlice";

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const { isHistoryVisible } = useAppSelector((state) => state.ui);

  // Get the report ID from params
  const reportId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Use React Query instead of Redux for data fetching
  const { data: currentReport, isLoading, error } = useReport(reportId || "");

  useEffect(() => {
    if (currentReport) {
      dispatch(setCurrentReport(currentReport));
      dispatch(setCurrentReportId(currentReport.id));
    }
  }, [currentReport, dispatch]);

  const toggleHistory = () => {
    dispatch(setIsHistoryVisible(!isHistoryVisible));
  };

  const handleNewDocument = () => {
    router.push("/");
  };

  useEffect(() => {
    // Initialize auth from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // Only redirect if we're done loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // While waiting for authentication check and potential redirect, return null.
  /* if (!isAuthenticated) {
    return null;
  } */

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            {error.message || "Failed to load report"}
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      {isHistoryVisible ? (
        <ResizablePanelGroup
          key="three-panel"
          direction="horizontal"
          className="h-full"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={40}
            collapsible={true}
            onCollapse={() => setIsHistoryVisible(false)}
          >
            <HistoryPanel
              onToggleHistory={toggleHistory}
              onNewDocument={handleNewDocument}
              currentDocumentId={reportId}
            />
          </ResizablePanel>

          <ResizableHandle className="w-px bg-gray-200 hover:bg-gray-300 transition-colors" />

          <ResizablePanel defaultSize={50} minSize={30}>
            <DocumentPanel
              showHistoryControls={!isHistoryVisible}
              onToggleHistory={toggleHistory}
              onNewDocument={handleNewDocument}
              isLoading={isLoading}
              report={currentReport}
            />
          </ResizablePanel>

          <ResizableHandle className="w-px bg-gray-200 hover:bg-gray-300 transition-colors" />

          <ResizablePanel defaultSize={30} minSize={25}>
            <EditChatContainer isLoading={isLoading} />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <ResizablePanelGroup
          key="two-panel"
          direction="horizontal"
          className="h-full"
        >
          <ResizablePanel defaultSize={70} minSize={50}>
            <DocumentPanel
              showHistoryControls={!isHistoryVisible}
              onToggleHistory={toggleHistory}
              onNewDocument={handleNewDocument}
              isLoading={isLoading}
              report={currentReport}
            />
          </ResizablePanel>

          <ResizableHandle className="w-px bg-gray-200 hover:bg-gray-300 transition-colors" />

          <ResizablePanel defaultSize={30} minSize={25}>
            <EditChatContainer isLoading={isLoading} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
