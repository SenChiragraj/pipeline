import React from 'react';

const Dashboard = () => {
  return <div>Dashboard</div>;
};

// import { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getToken, logout, isAuthenticated } from '../auth/authSessions';
// import { useRepo } from '../../context/RepoContext';
// import useWebSocket from '../sub-components/webSocketManager';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [repos, setRepos] = useState([]);
//   const [message, setMessage] = useState('');
//   const hasFetched = useRef(false); // ✅ guard to avoid duplicate fetch
//   const { setRepoFullName } = useRepo();
//   const accessToken = getToken();

//   useWebSocket();

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate('/');
//       return;
//     }

//     if (hasFetched.current) return; // ✅ skip if already fetched
//     hasFetched.current = true;

//     const fetchRepos = async () => {
//       try {
//         const res = await fetch('https://api.github.com/user/repos', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         const data = await res.json();
//         setRepos(data);
//       } catch (err) {
//         setMessage('Failed to load repos');
//       }
//     };

//     fetchRepos();
//   }, [navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const createWebhook = (repoFullName) => {
//     fetch('http://localhost:8080/api/webhook/create', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ repoFullName, accessToken }),
//     })
//       .then((res) => res.text())
//       .then(() => setMessage('Webhook created'))
//       .catch(() => setMessage('Failed to create webhook'));
//   };

//   const openWebhook = (repoFullName) => {
//     console.log(repoFullName);
//     setRepoFullName(repoFullName);
//     navigate(`/webhook`);
//   };

//   return (
//     <div>
//       <button onClick={handleLogout}>Logout</button>
//       <h2>Your Repositories</h2>
//       {repos.map((repo) => (
//         <div key={repo.id}>
//           <span>{repo.full_name}</span>
//           <button onClick={() => createWebhook(repo.full_name)}>
//             Create Webhook
//           </button>

//           <button onClick={() => openWebhook(repo.full_name)}>
//             Open Webhook
//           </button>
//         </div>
//       ))}
//       <p>{message}</p>
//     </div>
//   );
// };

export default Dashboard;
