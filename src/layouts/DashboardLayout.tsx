import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { authApi } from "../api/auth";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  const token = localStorage.getItem("token");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    enabled: !!token,
    retry: false,
  });

  if (!token || isError) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-app-bg flex flex-col overflow-hidden">
      <Navbar user={user!} />
      <main className="flex-1 min-h-0 px-4 py-[13px]">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
