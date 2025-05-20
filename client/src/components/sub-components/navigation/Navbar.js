import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../auth/authSessions'; // Adjust the import path as necessary

const Navbar = () => {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-black min-h-16 flex items-center px-6 shadow-sm w-full border-b border-gray-200 sticky top-0">
      {/* Jenkins Logo and Title */}
      <div className="flex items-center min-w-[180px]">
        <img
          src="https://www.jenkins.io/images/logos/jenkins/jenkins.png"
          alt="Jenkins Logo"
          className="h-8 w-8 mr-2"
        />
        <span className="text-white font-bold text-[1.5rem] leading-none">
          Jenkins
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search (CTRL+K)"
          className="w-[320px] h-10 px-4 py-2 rounded bg-gray-100 text-black outline-none border border-gray-200 text-sm"
        />
      </div>

      {/* Right-side Icons and User */}
      <div className="flex items-center gap-4 min-w-[220px] justify-end">
        {/* Notification Icon */}
        <button className="relative">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
            1
          </span>
        </button>

        {/* User Avatar */}
        <div className="h-9 w-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-base">
          U
        </div>

        {/* Logout Button */}
        <button
          className="text-white text-sm font-semibold"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
