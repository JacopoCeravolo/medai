import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, User, PanelLeftClose, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/userSlice";
import { useReports } from "@/lib/services/reportService";

interface HistoryPanelProps {
  onToggleHistory?: () => void;
  onNewDocument?: () => void;
  currentDocumentId?: string;
}

export function HistoryPanel({
  onToggleHistory,
  onNewDocument,
  currentDocumentId,
}: HistoryPanelProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  // Use React Query instead of Redux for data fetching
  const { data: reports = [], isLoading, error } = useReports();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleReportClick = (reportId: string) => {
    router.push(`/report/${reportId}`);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleHistory}
                className="h-8 w-8 p-0"
              >
                <PanelLeftClose className="h-4 w-4" />
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
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Loading reports...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-red-500">Failed to load reports</div>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">No reports yet</div>
          </div>
        ) : (
          <div className="space-y-1">
            {reports.map((report) => {
              const isSelected = currentDocumentId === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => handleReportClick(report.id)}
                  className={`w-full p-3 text-left rounded-lg transition-colors group ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 text-blue-900"
                      : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText
                      className={`h-4 w-4 mt-0.5 ${
                        isSelected
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-medium text-sm truncate ${
                          isSelected ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {report.title}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          isSelected ? "text-blue-700" : "text-gray-500"
                        }`}
                      >
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t bg-gray-50">
        {isAuthenticated && user && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
