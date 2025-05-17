import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/dashboard/Dashboard';
import Callback from './functions/Callback';
import Login from './components/auth/Login';
import Webhook from './components/pages/Webhook';
import { RepoProvider } from './context/RepoContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/routes/ProtectedRoutes';

import NewItem from './components/pages/dashboard/functional/new-item';
import BuildHistory from './components/pages/dashboard/functional/buildHistory';
import Manage from './components/pages/dashboard/functional/manage';
import People from './components/pages/dashboard/functional/people';

function App() {
  return (
    <>
      <RepoProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/webhook" element={<Webhook />} />

            {/* Protected Dashboard and its sub-routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/new-item" element={<NewItem />} />
              <Route path="/dashboard/people" element={<People />} />
              <Route
                path="/dashboard/build-history"
                element={<BuildHistory />}
              />
              <Route path="/dashboard/manage" element={<Manage />} />
            </Route>
          </Routes>
        </Router>
      </RepoProvider>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
