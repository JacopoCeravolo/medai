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
      {/* EditPanel Wrapper */}
      <div className={`${isChatExpanded ? 'h-20' : 'flex-1'} min-h-0`}>
        <EditPanel 
          isNewDocument={isNewDocument} 
          isLoading={isLoading}
          isCollapsed={isChatExpanded}
          onHeaderClick={toggleEditPanel}
        />
      </div>
      
      {/* ChatPanel Wrapper */}
      <div className={`${isChatExpanded ? 'flex-1' : 'h-20'} min-h-0`}>
        <ChatPanel 
          isExpanded={isChatExpanded}
          onToggleExpanded={toggleChat}
        />
      </div>
    </div>
  );
}
