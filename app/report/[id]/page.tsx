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
    <div className="h-screen flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <HistoryPanel onNewDocument={handleNewDocument} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <DocumentPanel report={currentReport} isLoading={isLoading} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <EditPanel report={currentReport} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
