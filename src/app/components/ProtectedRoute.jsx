import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const getAuthToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; authToken=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    
    return localStorage.getItem("auth-token") || localStorage.getItem("x-auth-token");
  };

  const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
  };

  return isAuthenticated() ? children : <Navigate to="/404" replace />;
};

export default ProtectedRoute;