// Callback.js
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Prevents double fetch

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      fetch(`http://localhost:8080/oauth/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token);
            // Remove the ?code=... from the URL
            window.history.replaceState({}, document.title, '/dashboard');
            navigate('/dashboard');
          } else {
            console.error('Access token missing:', data);
            navigate('/');
          }
        })
        .catch((err) => {
          console.error('OAuth error:', err);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default Callback;
