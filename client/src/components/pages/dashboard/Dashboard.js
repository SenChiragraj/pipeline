// import React from 'react';
// import {
//   UserIcon,
//   ClockIcon,
//   Cog8ToothIcon,
//   PlusIcon,
// } from '@heroicons/react/24/outline'; // Use Heroicons or replace with your icons
// import SidebarItem from './functional/sideBarItem';

// const Dashboard = () => {
//   return (
//     <div className="min-h-screen bg-[#fafbfc]">
//       <div className="flex pt-6 px-8">
//         {/* Sidebar */}
//         <aside className="w-64 pr-6">
//           <ul className="space-y-1 mb-8">
//             <SidebarItem icon={PlusIcon} label="New Item" route={'new-item'} />
//             <SidebarItem icon={UserIcon} label="People" route={'people'} />
//             <SidebarItem
//               icon={ClockIcon}
//               label="Build History"
//               route={'build-history'}
//             />
//             <SidebarItem
//               icon={Cog8ToothIcon}
//               label="Manage Jenkins"
//               route={'manage'}
//             />
//           </ul>
//           {/* Collapsible Sections */}
//           <div className="mb-2">
//             <details open className="mb-2">
//               <summary className="bg-gray-100 px-3 py-2 rounded font-medium cursor-pointer">
//                 Build Queue
//               </summary>
//               <div className="px-3 py-2 text-sm text-gray-500">
//                 No builds in the queue.
//               </div>
//             </details>
//             <details open>
//               <summary className="bg-gray-100 px-3 py-2 rounded font-medium cursor-pointer">
//                 Build Executor Status
//               </summary>
//               <div className="px-3 py-2 text-sm text-gray-700">
//                 <div>
//                   1 <span className="text-gray-500">Idle</span>
//                 </div>
//                 <div>
//                   2 <span className="text-gray-500">Idle</span>
//                 </div>
//               </div>
//             </details>
//           </div>
//         </aside>
//         {/* Main Content */}
//         <main className="flex-1 flex flex-col items-center">
//           <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-10">
//             <div className="flex justify-between items-center mb-2">
//               <h1 className="text-3xl font-bold">Welcome to Jenkins!</h1>
//               <button className="text-gray-500 text-base flex items-center gap-1 hover:text-gray-700">
//                 <svg
//                   className="h-5 w-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     d="M12 4v16m8-8H4"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//                 Add description
//               </button>
//             </div>
//             <p className="text-gray-600 mb-8 text-base">
//               This page is where your Jenkins jobs will be displayed. To get
//               started, you can set up distributed builds or start building a
//               software project.
//             </p>
//             <div className="mb-8">
//               <h2 className="font-semibold mb-3 text-xl">
//                 Start building your software project
//               </h2>
//               <button className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-2 text-lg font-medium">
//                 Create a job
//                 <span className="text-xl">&rarr;</span>
//               </button>
//             </div>
//             <div>
//               <h2 className="font-semibold mb-3 text-xl">
//                 Set up a distributed build
//               </h2>
//               <button className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-2 text-lg font-medium">
//                 Set up an agent
//                 <span className="text-xl">&rarr;</span>
//               </button>
//               <button className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition mb-2 text-lg font-medium">
//                 Configure a cloud
//                 <span className="text-xl">&rarr;</span>
//               </button>
//               <button className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition text-lg font-medium">
//                 Learn more about distributed builds
//                 <svg
//                   className="h-5 w-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     d="M14 5l7 7m0 0l-7 7m7-7H3"
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, logout, isAuthenticated } from '../../auth/authSessions';
import { useRepo } from '../../../context/RepoContext';
import useWebSocket from '../../sub-components/webSocketManager';

const Dashboard = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [message, setMessage] = useState('');
  const hasFetched = useRef(false); // ✅ guard to avoid duplicate fetch
  const { setRepoFullName } = useRepo();
  const accessToken = getToken();

  useWebSocket();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    if (hasFetched.current) return; // ✅ skip if already fetched
    hasFetched.current = true;

    const fetchRepos = async () => {
      try {
        const res = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        setMessage('Failed to load repos');
      }
    };

    fetchRepos();
  }, [navigate]);

  const createWebhook = (repoFullName) => {
    fetch('http://localhost:8080/api/webhook/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoFullName, accessToken }),
    })
      .then((res) => res.text())
      .then(() => setMessage('Webhook created'))
      .catch(() => setMessage('Failed to create webhook'));
  };

  const openWebhook = (repoFullName) => {
    console.log(repoFullName);
    setRepoFullName(repoFullName);
    navigate(`/webhook`);
  };

  return (
    <div>
      <h2>Your Repositories</h2>
      {repos.map((repo) => (
        <div key={repo.id}>
          <span>{repo.full_name}</span>
          <button onClick={() => createWebhook(repo.full_name)}>
            Create Webhook
          </button>

          <button onClick={() => openWebhook(repo.full_name)}>
            Open Webhook
          </button>
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
