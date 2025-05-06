// components/GitHubLogin.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './authSessions';

const GitHubLogin = () => {
  const clientId = 'Ov23liV7cGzi064cn6sX';
  const redirectUri = 'http://localhost:3000/callback';
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const loginWithGitHub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,admin:repo_hook`;
  };

  return <button onClick={loginWithGitHub}>Login with GitHub</button>;
};

export default GitHubLogin;
