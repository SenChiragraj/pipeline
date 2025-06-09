// components/GitHubLogin.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './authSessions';
import { Button } from '@radix-ui/themes';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const GitHubLogin = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const redirectUri = `${process.env.REACT_APP_BASE_URL}/callback`;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const loginWithGitHub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,admin:repo_hook`;
  };

  return (
    <button className="btn btn-dark" onClick={loginWithGitHub}>
      Continue with GitHub <ArrowRightIcon className="h-4 w-4" />
    </button>
  );
};

export default GitHubLogin;
