import React from 'react';
import GitHubLogin from './GithubLogin';

function Login() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Branding Section */}
      <div className="max-w-xl mx-auto border-l-4 border-white px-6">
        <h1 className="text-5xl font-extrabold tracking-wide mb-2 text-center">
          Jenking
        </h1>
        <p className="text-base opacity-75 text-center">
          Your gateway to seamless development
        </p>

        {/* Login Prompt */}
        <h2 className="text-xl sm:text-2xl font-bold leading-snug mt-8 text-left">
          Sign in with
          <span className="text-5xl md:text-2xl opacity-80 hover:opacity-100 mx-2 transition-all duration-300">
            GitHub
          </span>
          to continue..
        </h2>

        {/* Styled GitHub Button */}
        <div className="mt-3">
          <GitHubLogin />
        </div>
      </div>
    </section>
  );
}

export default Login;
