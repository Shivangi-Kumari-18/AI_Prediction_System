// src/context/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../index.css";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  console.log("🔐 PrivateRoute:", { isAuthenticated, loading });

  // while checking (rare), you can render null or loading UI
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="loader"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
