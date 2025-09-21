import React, { useState } from "react";
import { EditPanel } from "@/components/EditPanel/EditPanel";
import { ChatPanel } from "@/components/ChatPanel/ChatPanel";

interface EditChatContainerProps {
  isNewDocument?: boolean;
  isLoading?: boolean;
}

export function EditChatContainer({ isNewDocument = false, isLoading = false }: EditChatContainerProps) {
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  const toggleChat = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const toggleEditPanel = () => {
    if (isChatExpanded) {
      setIsChatExpanded(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* EditPanel - collapses to header only when chat is expanded */}
      <div className={`transition-all duration-300 ${
        isChatExpanded ? 'h-12 overflow-hidden' : 'flex-1'
      }`}>
        <EditPanel 
          isNewDocument={isNewDocument} 
          isLoading={isLoading}
          isCollapsed={isChatExpanded}
          onHeaderClick={toggleEditPanel}
        />
      </div>
      
      {/* ChatPanel - takes remaining space when expanded */}
      <div className={`transition-all duration-300 ${
        isChatExpanded ? 'flex-1' : 'h-auto'
      }`}>
        <ChatPanel 
          isExpanded={isChatExpanded}
          onToggleExpanded={toggleChat}
        />
      </div>
    </div>
  );
}
