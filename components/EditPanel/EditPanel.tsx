import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  useCreateReport,
  useReport,
  useUpdateReportContent,
} from "@/lib/services/reportService";
import { setIsAiGenerating } from "@/lib/store/uiSlice";

type ReportType = "REFERTO" | "NOTA" | "CHIRURGIA";

interface EditPanelProps {
  isNewDocument?: boolean;
  isLoading?: boolean;
  isCollapsed?: boolean;
  onHeaderClick?: () => void;
}

export function EditPanel({
  isNewDocument = true,
  isLoading = false,
  isCollapsed = false,
  onHeaderClick,
}: EditPanelProps) {
  const [reportType, setReportType] = useState<ReportType>("REFERTO");
  const [docName, setDocName] = useState("");
  const [informazioni, setInformazioni] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);
  const { currentReportId } = useAppSelector((state) => state.report);

  const createReportMutation = useCreateReport();
  const updateReportMutation = useUpdateReportContent();

  // Fetch report data if we have a current report ID and it's not a new document
  const { data: report } = useReport(currentReportId || "");
  //const report = null; // Temporarily disabled for new document flow

  // Populate form when editing existing report
  useEffect(() => {
    if (report && !isNewDocument) {
      setReportType(report.reportType || "REFERTO");
      setDocName(report.docName || "");
      setInformazioni(report.informazioni || "");
      setNote(report.note || "");
    } else if (isNewDocument) {
      setReportType("REFERTO");
      setDocName("");
      setInformazioni("");
      setNote("");
    }
  }, [report, isNewDocument]);

  const handleSave = async () => {
    if (!informazioni.trim() && !note.trim()) {
      alert("Please enter some content before saving.");
      return;
    }

    if (!token) {
      alert("You must be logged in to save documents.");
      return;
    }

    try {
      // Show loading overlay for AI generation
      dispatch(setIsAiGenerating(true));

      const result = await createReportMutation.mutateAsync({
        title: docName || "Untitled Report",
        content: `${informazioni}\n\n${note}`, // Concatenated for blob
        reportType,
        docName,
        informazioni,
        note,
      });

      // Clear the form
      setReportType("REFERTO");
      setDocName("");
      setInformazioni("");
      setNote("");

      // Redirect to the report page
      router.push(`/report/${result.id}`);
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Error saving report. Please try again.");
    } finally {
      // Hide loading overlay
      dispatch(setIsAiGenerating(false));
    }
  };

  /* const handleEdit = async () => {
    if (!informazioni.trim() && !note.trim()) {
      alert("Please enter some content before saving.");
      return;
    }

    if (!token) {
      alert("You must be logged in to save documents.");
      return;
    }

    try {
      await updateReportMutation.mutateAsync({
        id: currentReportId || "",
        content: note,
        reportType: reportType,
        docName: docName,
        informazioni: informazioni,
        note: note,
      });
    } catch (error) {
      console.error("Error updating report:", error);
      throw error; // Re-throw to handle in the UI if needed
    }
  }; */

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div
        className={`p-4 border-b h-20 flex items-center ${
          isCollapsed ? "cursor-pointer hover:bg-gray-50" : ""
        }`}
        onClick={isCollapsed ? onHeaderClick : undefined}
      >
        <h2 className="text-lg font-semibold text-gray-900">Editor</h2>
      </div>

      {!isCollapsed &&
        (isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Caricamento...</div>
          </div>
        ) : (
          <div className="flex-1 p-4 space-y-4">
            {/* Section 1: Report Type Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Tipo Documento
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={reportType === "REFERTO" ? "default" : "outline"}
                  onClick={() => setReportType("REFERTO")}
                  className="flex-1"
                >
                  Referto
                </Button>
                <Button
                  variant={reportType === "NOTA" ? "default" : "outline"}
                  onClick={() => setReportType("NOTA")}
                  className="flex-1"
                >
                  Nota
                </Button>
                <Button
                  variant={reportType === "CHIRURGIA" ? "default" : "outline"}
                  onClick={() => setReportType("CHIRURGIA")}
                  className="flex-1"
                >
                  Chirurgia
                </Button>
              </div>
            </div>

            {/* Section 2: Doc Name Input */}
            <div className="space-y-2">
              <Label
                htmlFor="docname"
                className="text-sm font-medium text-gray-700"
              >
                Nome Documento
              </Label>
              <Input
                id="docname"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="eg Mario Rossi"
                className="w-full"
              />
            </div>

            {/* Section 3: Informazioni Paziente */}
            <div className="space-y-2 flex-[2] flex flex-col">
              <Label
                htmlFor="informazioni"
                className="text-sm font-medium text-gray-700"
              >
                Informazioni Paziente
              </Label>
              <textarea
                id="informazioni"
                value={informazioni}
                onChange={(e) => setInformazioni(e.target.value)}
                placeholder="Inserisci le informazioni del paziente..."
                className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
              />
            </div>

            {/* Section 4: Note Personali */}
            <div className="space-y-2 flex-[2] flex flex-col">
              <Label
                htmlFor="note"
                className="text-sm font-medium text-gray-700"
              >
                Note Personali
              </Label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Inserisci le note personali..."
                className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
              />
            </div>

            {/* Section 5: Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleSave}
                disabled={createReportMutation.isPending || !isNewDocument}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {createReportMutation.isPending
                  ? "Salvando..."
                  : "Genera Referto"}
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
