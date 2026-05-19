import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const LiquidBackground = () => (
  <div className="liquid-bg-container">
    <div className="liquid-blob blob-1"></div>
    <div className="liquid-blob blob-2"></div>
    <div className="liquid-blob blob-3"></div>
    <div className="liquid-blob blob-4"></div>
  </div>
);

const AuthPage = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin
      ? { username, password }
      : { username, password, email };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Save token to localStorage and notify parent
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
      onAuth({ token: data.token, username: data.username, role: data.role });
    } catch (err) {
      setError('Cannot connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <LiquidBackground />

      <div className="w-full max-w-md space-y-12 animate-fade-in-up z-10">

        {/* Logo */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-zen-black tracking-tight drop-shadow-sm">
            日本語
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-zen-black to-transparent mx-auto"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-zen-black/60 font-semibold">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-zen-black/60 font-bold block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full glass-input px-4 py-3 text-sm font-light focus:outline-none transition-all duration-300 placeholder-black/30 text-zen-black"
                placeholder="Enter username"
              />
            </div>

            {/* Email (register only) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-[9px] uppercase tracking-[0.3em] text-zen-black/60 font-bold block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full glass-input px-4 py-3 text-sm font-light focus:outline-none transition-all duration-300 placeholder-black/30 text-zen-black"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-zen-black/60 font-bold block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full glass-input px-4 py-3 text-sm font-light focus:outline-none transition-all duration-300 placeholder-black/30 text-zen-black"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 text-xs font-medium text-center animate-fade-in py-2.5 px-4 rounded-xl border border-red-200/50 bg-red-50/40 backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 glass-btn text-[10px] uppercase tracking-[0.25em] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center pt-4 border-t border-white/40">
            <p className="text-xs text-zen-black/60 font-light">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 text-zen-black glass-link font-semibold cursor-pointer"
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-[9px] uppercase tracking-[0.3em] text-zen-black/40 font-medium">
          First account registered = ADMIN
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
