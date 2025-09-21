"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  setCurrentReport,
  setLoading,
  setError,
  clearCurrentReport,
} from "@/lib/store/reportSlice";
import { HistoryPanel } from "@/components/HistoryPanel/HistoryPanel";
import { DocumentPanel } from "@/components/DocumentPanel/DocumentPanel";
import { EditPanel } from "@/components/EditPanel/EditPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { setIsHistoryVisible } from "@/lib/store/uiSlice";

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.user
  );
  const { currentReport, isLoading, error } = useAppSelector(
    (state) => state.report
  );
  const { isHistoryVisible } = useAppSelector((state) => state.ui);

  const toggleHistory = () => {
    dispatch(setIsHistoryVisible(!isHistoryVisible));
  };

  useEffect(() => {
    let isMounted = true;

    // Clear any existing report when component mounts or ID changes
    dispatch(clearCurrentReport());

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchReport = async () => {
      // Get the id from params
      const reportId = Array.isArray(params.id) ? params.id[0] : params.id;

      console.log(
        "Fetching report with ID:",
        reportId,
        "Token exists:",
        !!token
      );

      if (!reportId || !token) {
        if (isMounted) {
          dispatch(setError("Missing report ID or authentication token"));
        }
        return;
      }

      if (isMounted) {
        dispatch(setLoading(true));
      }

      try {
        const response = await fetch(`/api/report/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("API Response:", response.status, data);

        if (isMounted) {
          if (response.ok && data.report) {
            console.log("Dispatching setCurrentReport with:", data.report);
            dispatch(setCurrentReport(data.report));
            console.log("Redux dispatch completed");
          } else {
            console.log("API error:", data.error);
            dispatch(setError(data.error || "Failed to load report"));
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (isMounted) {
          dispatch(setError("An error occurred while loading the report"));
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [params.id, isAuthenticated, token, router]);

  const handleNewDocument = () => {
    router.push("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
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
            <EditPanel />
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
            <EditPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
