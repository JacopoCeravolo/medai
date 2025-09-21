import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { logout } from "@/lib/store/userSlice";
import { setLoading, setError, setReports } from "@/lib/store/reportSlice";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, Plus } from "lucide-react";
import Link from "next/link";

interface HistoryPanelProps {
  onToggleHistory?: () => void;
  onNewDocument?: () => void;
}

export function HistoryPanel({
  onToggleHistory,
  onNewDocument,
}: HistoryPanelProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token } = useAppSelector(
    (state) => state.user
  );
  const { reports, isLoading } = useAppSelector((state) => state.report);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      if (!isAuthenticated || !token) return;

      dispatch(setLoading(true));

      try {
        const response = await fetch("/api/report", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (isMounted) {
          if (response.ok) {
            dispatch(setReports(data.reports));
          } else {
            dispatch(setError(data.error || "Failed to load reports"));
          }
        }
      } catch (error) {
        if (isMounted) {
          dispatch(setError("An error occurred while loading reports"));
        }
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleReportClick = (reportId: string) => {
    router.push(`/report/${reportId}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header with Controls */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewDocument}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleHistory}
              className="h-8 w-8 p-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-500 text-sm py-4">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No reports yet. Create your first document!
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleReportClick(report.id)}
              className="p-3 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm transition-colors"
            >
              <div className="font-medium truncate">{report.title}</div>
              <div className="text-gray-500 text-xs">
                {formatDate(report.updatedAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Menu at Bottom */}
      <div className="p-4 border-t bg-gray-50">
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">Not logged in</div>
            <div className="flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
