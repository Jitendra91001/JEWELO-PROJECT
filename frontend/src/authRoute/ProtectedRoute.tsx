// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import useAuth from "@/hooks/use-auth";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;  
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" />;  
  }

  return <Outlet />; 
};

export default ProtectedRoute;