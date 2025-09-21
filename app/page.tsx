"use client";

import { useEffect } from "react";
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

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);

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
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* History Panel - Left */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <HistoryPanel />
        </ResizablePanel>
        
        <ResizableHandle className="w-px bg-gray-200 hover:bg-gray-300 transition-colors" />
        
        {/* Document Panel - Center */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <DocumentPanel />
        </ResizablePanel>
        
        <ResizableHandle className="w-px bg-gray-200 hover:bg-gray-300 transition-colors" />
        
        {/* Edit Panel - Right */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
          <EditPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
