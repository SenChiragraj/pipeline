import React from 'react';
import GitHubLogin from './GithubLogin';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100">
      {/* Login Form */}
      <main className="flex items-center justify-center flex-col min-h-screen px-4">
        <div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl changa-one-regular">
            Welcome to Jenkings
          </h1>
        </div>
        <p className="text-lg sm:text-xl opacity-75 text-center mt-3">
          Your gateway to seamless CI/CD development
        </p>
        {/* Styled GitHub Button */}
        <div className="mt-3 flex flex-col sm:flex-row items-center gap-3">
          <button
            className="btn btn-dark px-4 py-2 text-sm sm:text-base"
            onClick={() => navigate('/docs')}
          >
            Documentation
          </button>
          <GitHubLogin />
        </div>
      </main>
    </section>
  );
}

export default Login;
