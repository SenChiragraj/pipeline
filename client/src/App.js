// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Callback from './functions/Callback';
import Login from './components/auth/Login';
import Webhook from './components/pages/Webhook';
import { RepoProvider } from './context/RepoContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <RepoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/webhook" element={<Webhook />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </RepoProvider>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
