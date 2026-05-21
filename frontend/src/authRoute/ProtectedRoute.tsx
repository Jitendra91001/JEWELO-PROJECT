// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import { isAdmin } from "@/utils/roleCheck";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;  
  }

  if (!isAdmin(user?.role)) {
    return <Navigate to="/" replace />;  
  }

  return <Outlet />; 
};

export default ProtectedRoute;