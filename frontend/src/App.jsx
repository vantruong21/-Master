import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ImportModal from './components/ImportModal';
import QuizEngine from './components/QuizEngine';
import QuizResults from './components/QuizResults';
import StatsPage from './components/StatsPage';
import AuthPage from './components/AuthPage';

function App() {
  // Auth state
  const [user, setUser] = useState(null); // { username, role }
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App state
  const [view, setView] = useState('LIBRARY');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [studySets, setStudySets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSet, setActiveSet] = useState(null);
  const [quizMode, setQuizMode] = useState('TYPING');
  const [currentResults, setCurrentResults] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      // Verify token is still valid
      fetch('http://localhost:8080/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      }).then(res => {
        if (res.ok) return res.json();
        throw new Error('Token expired');
      }).then(data => {
        setToken(savedToken);
        setUser({ username: data.username, role: data.role });
        setAuthLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthLoading(false);
      });
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Fetch study sets when authenticated
  useEffect(() => {
    if (user) fetchStudySets();
  }, [user]);

  const fetchStudySets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/study-sets');
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setStudySets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching study sets:', error);
      setStudySets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = ({ token: newToken, username, role }) => {
    setToken(newToken);
    setUser({ username, role });
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setView('LIBRARY');
  };

  // Helper to get auth headers
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  });

  const handleStartQuiz = (set, mode) => {
    setActiveSet(set);
    setQuizMode(mode);
    setView('QUIZ');
  };

  const handleDeleteSet = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also delete all associated quiz history.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/study-sets/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });

      if (response.ok) {
        fetchStudySets();
      } else {
        alert('Failed to delete study set: Server error.');
      }
    } catch (error) {
      console.error('Error deleting study set:', error);
      alert('Failed to delete study set: Network error.');
    }
  };

  const handleQuizFinish = async (results, startTime) => {
    setCurrentResults(results);
    setSessionStartTime(startTime);
    setView('RESULTS');

    try {
      await fetch('http://localhost:8080/api/quiz/session', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          studySet: { id: activeSet.id },
          mode: quizMode,
          score: results.filter(r => r.isCorrect).length,
          totalQuestions: results.length,
          startTime: startTime,
          endTime: new Date(),
          details: results.map(r => ({
            question: { id: r.questionId },
            userAnswer: r.userAnswer,
            isCorrect: r.isCorrect
          }))
        }),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Auth loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zen-white flex items-center justify-center">
        <div className="space-y-4 text-center animate-fade-in">
          <div className="w-12 h-12 border border-zen-accent rounded-full mx-auto animate-spin" style={{ borderTopColor: '#111' }}></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zen-muted">Restoring session...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show auth page
  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  // Quiz view
  if (view === 'QUIZ') {
    return <QuizEngine studySet={activeSet} mode={quizMode} onFinish={handleQuizFinish} onBack={() => setView('LIBRARY')} />;
  }

  // Results view
  if (view === 'RESULTS') {
    return (
      <QuizResults 
        studySet={activeSet} 
        results={currentResults} 
        startTime={sessionStartTime} 
        onBackToLibrary={() => { setView('LIBRARY'); fetchStudySets(); }} 
      />
    );
  }

  // Stats view
  if (view === 'STATS') {
    return (
      <>
        <Navbar
          user={user}
          onImportClick={() => setIsImportModalOpen(true)}
          onLibraryClick={() => setView('LIBRARY')}
          onStatsClick={() => setView('STATS')}
          onLogout={handleLogout}
        />
        <StatsPage onBack={() => setView('LIBRARY')} />
      </>
    );
  }

  // Library view (default)
  return (
    <div className="min-h-screen bg-zen-white flex flex-col">
      <Navbar
        user={user}
        onImportClick={() => setIsImportModalOpen(true)}
        onLibraryClick={() => setView('LIBRARY')}
        onStatsClick={() => setView('STATS')}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 mt-16 p-8 md:p-16 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <header className="pt-8 pb-16 space-y-4 animate-fade-in-up">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zen-muted mb-3 animate-fade-in stagger-1">Your Collection</p>
              <h2 className="text-5xl md:text-6xl font-extralight text-zen-black tracking-tighter leading-none">
                Library
              </h2>
            </div>
            <p className="text-zen-muted text-xs font-light hidden md:block">
              {studySets.length} {studySets.length === 1 ? 'set' : 'sets'} available
            </p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-zen-black via-zen-accent to-transparent mt-6"></div>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="space-y-4 text-center animate-fade-in">
              <div className="w-12 h-12 border border-zen-accent rounded-full mx-auto animate-spin" style={{ borderTopColor: '#111' }}></div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zen-muted">Loading sets...</p>
            </div>
          </div>
        ) : (!studySets || studySets.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in-up">
            <div className="w-20 h-20 border border-dashed border-zen-accent rounded-full flex items-center justify-center mb-8 animate-float">
              <span className="text-3xl">空</span>
            </div>
            <p className="text-zen-muted font-light text-sm mb-2">Your library is empty</p>
            <p className="text-zen-accent text-xs mb-8">
              {user.role === 'ADMIN' ? 'Import a JSON study set to begin learning' : 'Ask an admin to import study sets'}
            </p>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="btn-magnetic px-10 py-3 bg-zen-black text-white text-[10px] uppercase tracking-[0.2em]"
              >
                Import First Set
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studySets.map((set, index) => (
              <div
                key={set.id}
                className={`card-hover group p-8 bg-white border border-zen-accent flex flex-col justify-between aspect-square animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] text-zen-muted uppercase tracking-[0.3em]">
                      {set.questions?.length || 0} cards
                    </span>
                    {user?.role === 'ADMIN' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSet(set.id, set.title);
                        }}
                        className="text-[9px] uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors duration-300 cursor-pointer font-medium"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zen-accent group-hover:bg-green-400 transition-colors duration-500"></span>
                    )}
                  </div>
                  <h3 className="text-2xl font-light text-zen-black mb-3 group-hover:tracking-tight transition-all duration-300">
                    {set.title}
                  </h3>
                  <p className="text-zen-muted text-sm font-light line-clamp-2 leading-relaxed">{set.description}</p>
                </div>
                
                {/* Card Bottom - Mode Selection */}
                <div className="pt-6 border-t border-zen-accent/50 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                  <button
                    onClick={() => handleStartQuiz(set, 'TYPING')}
                    className="option-btn text-[10px] text-left uppercase tracking-[0.15em] text-zen-muted hover:text-zen-black py-1 pl-0 border-l-0 transition-all"
                  >
                    ⌨ Typing Mode
                  </button>
                  <button
                    onClick={() => handleStartQuiz(set, 'MCQ')}
                    className="option-btn text-[10px] text-left uppercase tracking-[0.15em] text-zen-muted hover:text-zen-black py-1 pl-0 border-l-0 transition-all"
                  >
                    ◉ Multiple Choice
                  </button>
                  <button
                    onClick={() => handleStartQuiz(set, 'GENIUS')}
                    className="option-btn text-[10px] text-left uppercase tracking-[0.15em] text-zen-black font-medium py-1 pl-0 border-l-0 transition-all"
                  >
                    ⚡ Genius Mode
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-zen-accent/30">
        <p className="text-[9px] uppercase tracking-[0.4em] text-zen-accent">日本語 — Built for mastery</p>
      </footer>

      {user.role === 'ADMIN' && (
        <ImportModal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)} 
          onImport={(data) => {
            fetch('http://localhost:8080/api/study-sets/import', {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify(data),
            }).then(res => {
              if (res.ok) {
                fetchStudySets();
                setIsImportModalOpen(false);
              } else {
                alert('Import failed: Backend error.');
              }
            }).catch(err => {
              alert('Import failed: Network error.');
              console.error(err);
            });
          }}
        />
      )}
    </div>
  );
}

export default App;
