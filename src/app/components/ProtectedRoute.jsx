import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const getAuthToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    
    return localStorage.getItem("auth-token") || localStorage.getItem("x-auth-token");
  };

  const getUserRole = () => {
    return localStorage.getItem("user-role");
  };

  const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
  };

  const hasRequiredRole = () => {
    if (allowedRoles.length === 0) return true; // No role restriction
    const userRole = getUserRole();
    return userRole && allowedRoles.includes(userRole);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/404" replace />;
  }

  if (!hasRequiredRole()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;