"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistoryPanel } from "@/components/HistoryPanel/HistoryPanel";
import { DocumentPanel } from "@/components/DocumentPanel/DocumentPanel";
import { EditPanel } from "@/components/EditPanel/EditPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { initializeAuth } from "@/lib/store/userSlice";
import { setIsHistoryVisible } from "@/lib/store/uiSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);
  const { isHistoryVisible } = useAppSelector((state) => state.ui);

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

  const toggleHistory = () => {
    dispatch(setIsHistoryVisible(!isHistoryVisible));
  };

  const handleNewDocument = () => {
    // TODO: Implement new document functionality
    console.log("Creating new document...");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
              isNewDocument={true}
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
              isNewDocument={true}
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
