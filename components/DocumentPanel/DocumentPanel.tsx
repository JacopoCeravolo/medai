import React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft, Plus, ArrowRight } from "lucide-react";
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
  const WelcomeInstruction = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <h2 className="text-xl font-semibold text-gray-700">
        Crea un nuovo referto
      </h2>
      <p className="mt-2 max-w-md">
        Compila i campi nel pannello a destra per generare un nuovo documento.
      </p>
      <ArrowRight className="h-8 w-16 mt-4 text-gray-400 italic" />
    </div>
  );
  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b h-20 flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {showHistoryControls && (
              <div className="flex items-center gap-1">
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
            <h2 className="text-lg font-semibold text-gray-900">MedAI</h2>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto h-full">
          {isNewDocument ? (
            <WelcomeInstruction />
          ) : isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Caricamento...</div>
            </div>
          ) : report ? (
            <div className="prose prose-gray max-w-none">
              <div className="mb-4 text-sm text-gray-500">
                Creato: {new Date(report.createdAt).toLocaleDateString()} |
                Modificato: {new Date(report.updatedAt).toLocaleDateString()}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-4">
                {report.docName}
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
