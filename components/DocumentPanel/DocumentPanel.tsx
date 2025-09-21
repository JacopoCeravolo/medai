import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft, Plus } from "lucide-react";
import { Report } from "@/lib/store/reportSlice";

interface DocumentPanelProps {
  showHistoryControls?: boolean;
  onToggleHistory?: () => void;
  onNewDocument?: () => void;
  report?: Report | null;
  isLoading?: boolean;
  isNewDocument?: boolean;
}

export function DocumentPanel({
  showHistoryControls,
  onToggleHistory,
  onNewDocument,
  report,
  isLoading,
  isNewDocument,
}: DocumentPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showHistoryControls && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleHistory}
                  className="h-8 w-8 p-0"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewDocument}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {report ? report.title : "Document Viewer"}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {isNewDocument ? (
            <div className="prose prose-gray max-w-none">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Your Document Editor
              </h1>
              <p className="text-gray-600 leading-relaxed">
                This is the document viewer panel. Here you can view and read
                your documents in a clean, distraction-free environment. The
                content will be displayed with proper typography and formatting
                for optimal readability.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Select a document from the history panel on the left to view its
                contents, or create a new document using the edit panel on the
                right.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Caricamento...</div>
            </div>
          ) : report ? (
            <div className="prose prose-gray max-w-none">
              <div className="mb-4 text-sm text-gray-500">
                Created: {new Date(report.createdAt).toLocaleDateString()} |
                Updated: {new Date(report.updatedAt).toLocaleDateString()}
              </div>
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {report.content}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">No document selected</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
