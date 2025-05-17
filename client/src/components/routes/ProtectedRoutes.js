// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../auth/authSessions'; // Adjust path as needed
import Navbar from '../sub-components/navigation/Navbar';

const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
