import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/dashboard/Dashboard';
import Callback from './functions/Callback';
import Login from './components/auth/Login';
import Webhook from './components/pages/Webhook';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/routes/ProtectedRoutes';

import Document from './components/pages/Document';
import CreateHook from './components/pages/dashboard/components/CreateHook';
import Logs from './components/pages/dashboard/components/Logs';
import { UserProvider } from './context/UserContext';
import OpenProject from './components/pages/dashboard/components/OpenProject';
import Project from './components/pages/projects/Project';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/webhook" element={<Webhook />} />
          <Route path="/docs" element={<Document />} />

          {/* Protected Dashboard and its sub-routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateHook />} />
            <Route path="/open-project" element={<OpenProject />} />
            <Route path="/project/:name" element={<Project />} />
            <Route path="/logs" element={<Logs />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={5000} />
    </UserProvider>
  );
}

export default App;
