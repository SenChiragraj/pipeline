import React from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, route }) => {
  const navigate = useNavigate();

  return (
    <li
      className="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 cursor-pointer transition"
      onClick={() => navigate(route)}
    >
      <Icon className="h-5 w-5 text-gray-500" />
      <span className="text-gray-800 text-[15px]">{label}</span>
    </li>
  );
};

export default SidebarItem;
