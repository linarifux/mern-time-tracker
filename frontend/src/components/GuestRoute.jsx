import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute() {
  const { user, loading } = useAuth();

  // 1. Wait for Auth check to finish so we don't redirect prematurely
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-mono text-sm animate-pulse">Checking credentials...</p>
        </div>
      </div>
    );
  }

  // 2. If user exists, redirect to Dashboard (/)
  // Replace "/" with "/dashboard" if your dashboard is on a sub-route
  if (user) {
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, render the Login/Register page
  return <Outlet />;
}