import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = "Generazione in corso..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="text-lg font-medium text-gray-900">{message}</div>
        <div className="text-sm text-gray-500">Attendere prego...</div>
      </div>
    </div>
  );
}
