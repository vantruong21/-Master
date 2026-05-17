import React, { useState } from 'react';

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
      const res = await fetch(`http://localhost:8080${endpoint}`, {
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
    <div className="min-h-screen bg-zen-white flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-12 animate-fade-in-up">

        {/* Logo */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-zen-black tracking-tight">
            日本語
          </h1>
          <div className="w-16 h-px bg-zen-black mx-auto"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-zen-muted">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-zen-accent p-10 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-zen-muted block">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full bg-transparent border-b-2 border-zen-accent py-3 text-sm font-light focus:outline-none focus:border-zen-black transition-all duration-300"
                placeholder="Enter username"
              />
            </div>

            {/* Email (register only) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-[9px] uppercase tracking-[0.3em] text-zen-muted block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b-2 border-zen-accent py-3 text-sm font-light focus:outline-none focus:border-zen-black transition-all duration-300"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.3em] text-zen-muted block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full bg-transparent border-b-2 border-zen-accent py-3 text-sm font-light focus:outline-none focus:border-zen-black transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-xs font-light text-center animate-fade-in py-2 border border-red-100 bg-red-50/30">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zen-black text-white text-[10px] uppercase tracking-[0.25em] btn-magnetic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center pt-4 border-t border-zen-accent">
            <p className="text-xs text-zen-muted font-light">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 text-zen-black hover-underline font-medium"
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-[9px] uppercase tracking-[0.3em] text-zen-accent">
          First account registered = ADMIN
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
