import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft, Plus, ArrowRight, Edit, Save, Loader2 } from "lucide-react";
import { Report } from "@/lib/store/reportSlice";
import { useUpdateReportContent } from "@/lib/services/reportService";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const updateReportMutation = useUpdateReportContent();

  const handleEditClick = () => {
    if (report) {
      setEditedContent(report.content || "");
      setIsEditing(true);
    }
  };

  const handleSaveClick = async () => {
    if (report?.id) {
      try {
        await updateReportMutation.mutateAsync({
          id: report.id,
          content: editedContent,
          reportType: report.reportType || "REFERTO",
          docName: report.docName || "",
          informazioni: report.informazioni || "",
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating report:", error);
      }
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };
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
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Creato: {new Date(report.createdAt).toLocaleDateString()} |
                  Modificato: {new Date(report.updatedAt).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                  disabled={updateReportMutation.isPending}
                  className="ml-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {updateReportMutation.isPending
                        ? "Salvataggio..."
                        : "Salva"}
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifica
                    </>
                  )}
                </Button>
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-4">
                {report.docName}
              </div>
              <div className="relative">
                {isEditing ? (
                  <div className="absolute inset-0">
                    <textarea
                      value={editedContent}
                      onChange={handleContentChange}
                      className="w-full h-full p-0 border-0 font-mono text-sm leading-relaxed resize-none focus:ring-0 focus:outline-none bg-transparent"
                      style={{
                        whiteSpace: "pre-wrap",
                        minHeight: "200px",
                        lineHeight: "1.6",
                        fontFamily: "inherit",
                        fontSize: "0.875rem",
                      }}
                      autoFocus
                    />
                  </div>
                ) : null}
                <div
                  className={`whitespace-pre-wrap font-mono text-sm leading-relaxed min-h-[200px] ${
                    isEditing ? "invisible" : ""
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {report.content}
                </div>
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
