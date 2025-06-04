import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepo } from '../../../../context/RepoContext';
import { getToken } from '../../../auth/authSessions';
import { useUser } from '../../../../context/UserContext';

const CreateHook = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [message, setMessage] = useState('');
  const hasFetched = useRef(false);
  const { setRepoFullName } = useRepo();
  const accessToken = getToken();
  const { userDetails, setUserdetails } = useUser();

  useEffect(() => {
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
  }, []);

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
    setRepoFullName(repoFullName);
    navigate(`/webhook`);
  };

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto bg-white text-gray-800">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold mb-8">Your Repositories</h2>
        <button className="btn" onClick={() => navigate('/')}>
          Go Back
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="flex flex-col h-44 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Repo name */}
            <div className="mb-4">
              <h3 className="font-medium text-sm text-gray-800 truncate">
                {repo.full_name}
              </h3>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-start mb-4">
              <button
                onClick={() => createWebhook(repo.full_name)}
                className="text-xs px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                ➕ Create
              </button>
              <button
                onClick={() => openWebhook(repo.full_name)}
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                🔍 Open
              </button>
            </div>

            {/* ID at the bottom */}
            <div className="mt-auto pt-2 border-t border-gray-200 text-xs text-gray-500">
              ID: {repo.id}
            </div>
          </div>
        ))}
      </div>

      {message && (
        <p className="mt-6 text-center text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default CreateHook;
