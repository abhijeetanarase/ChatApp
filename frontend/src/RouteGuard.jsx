// RouteGuard.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RouteGuard = ({ requireAuth=true }) => {
  const isAuthenticated = localStorage.getItem("authToken");

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/chat" />; // or "/chat"
  }

  return <Outlet />;
};

export default RouteGuard;
