import React, { useState, useEffect } from 'react';

const Navbar = ({ user, onImportClick, onLibraryClick, onStatsClick, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className={`fixed top-0 w-full h-16 glass-nav z-50 transition-all duration-500 ${scrolled ? 'border-b border-zen-accent shadow-sm' : 'border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8 md:px-16">
        {/* Logo */}
        <a href="/" className="group cursor-pointer no-underline">
          <span className="text-2xl font-bold tracking-tight text-zen-black group-hover:animate-float">
            日本語
          </span>
        </a>

        {/* Navigation */}
        <div className="flex items-center space-x-10 text-[10px] uppercase tracking-[0.2em]">
          {isAdmin && (
            <button
              onClick={onImportClick}
              className="hover-underline text-zen-muted hover:text-zen-black transition-colors duration-300 cursor-pointer font-medium"
            >
              Import
            </button>
          )}
          <button onClick={onLibraryClick} className="hover-underline text-zen-muted hover:text-zen-black transition-colors duration-300 cursor-pointer">
            Library
          </button>
          <button onClick={onStatsClick} className="hover-underline text-zen-muted hover:text-zen-black transition-colors duration-300 cursor-pointer">
            Stats
          </button>

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 hover:scale-110 ${
                isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-zen-muted to-zen-accent'
              }`}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-zen-accent shadow-lg animate-slide-down" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-zen-accent">
                  <p className="text-sm font-medium text-zen-black">{user?.username}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] font-bold ${
                    isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-zen-gray text-zen-muted'
                  }`}>
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-zen-muted hover:text-red-500 hover:bg-red-50/50 transition-all"
                >
                  ↗ Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
