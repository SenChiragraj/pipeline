// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../auth/authSessions'; // Adjust path as needed
import Navbar from '../sub-components/navigation/Navbar';
import useWebSocket from '../../components/sub-components/webSocketManager';

const ProtectedRoute = () => {
  useWebSocket();

  return isAuthenticated() ? (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;
