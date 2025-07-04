import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, logout } from '../../auth/authSessions';
import { useUser } from '../../../context/UserContext';
import * as Avatar from '@radix-ui/react-avatar';
import { Dialog } from 'radix-ui';
import CreateProjectTrigger from './components/CreateProjectTrigger';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const accessToken = getToken();
  const { userDetails, setUserdetails } = useUser();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (!accessToken) {
      logout();
      navigate('/');
      return;
    }

    fetchUserDetails();
  }, [navigate]);

  async function fetchUserDetails() {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      });

      setUserdetails(response.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 px-8 py-12">
      {/* Sidebar Actions */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <CreateProjectTrigger />
        <button className="btn w-full" onClick={() => navigate('/logs')}>
          📄 Check Logs
        </button>
      </div>

      {/* Main Section */}
      <div className="flex flex-col justify-center flex-1">
        <div className="flex items-center gap-4 mb-6">
          <Avatar.Root className="w-16 h-16 rounded-full border-2 border-neutral-700 overflow-hidden">
            <Avatar.Image
              src={userDetails.avatar_url}
              alt={userDetails.name}
              className="w-full h-full object-cover"
            />
            <Avatar.Fallback className="flex items-center justify-center h-full text-2xl text-white bg-neutral-700">
              {userDetails.name ? userDetails.name[0] : 'U'}
            </Avatar.Fallback>
          </Avatar.Root>

          <div className="flex flex-col justify-center flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-extrabold leading-tight">
              <span className="text-4xl changa-one-regular">Welcome back</span>
              <br />
              <span className="text-[#22ff88] changa-one-regular">
                {userDetails.name}
              </span>
            </h1>
            <p className="mt-4 text-neutral-400 text-xl max-w-xl">
              Manage your pipelines, trigger builds, and monitor deployments
              directly from here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
