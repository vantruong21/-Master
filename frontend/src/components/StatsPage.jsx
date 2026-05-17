import React, { useState, useEffect } from 'react';

const StatsPage = ({ onBack }) => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [weakPoints, setWeakPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/quiz/stats').then(r => r.json()),
      fetch('http://localhost:8080/api/quiz/sessions').then(r => r.json()),
      fetch('http://localhost:8080/api/quiz/weak-points').then(r => r.json()),
    ]).then(([statsData, sessionsData, weakData]) => {
      setStats(statsData);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      setWeakPoints(Array.isArray(weakData) ? weakData.slice(0, 10) : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const accuracy = stats && stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-zen-white flex items-center justify-center">
        <div className="space-y-4 text-center animate-fade-in">
          <div className="w-12 h-12 border border-zen-accent rounded-full mx-auto animate-spin" style={{ borderTopColor: '#111' }}></div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zen-muted">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-white">
      <div className="max-w-5xl mx-auto px-8 md:px-16 pt-24 pb-16">

        {/* Header */}
        <header className="pb-12 animate-fade-in-up">
          <button onClick={onBack} className="hover-underline text-[10px] uppercase tracking-[0.3em] text-zen-muted hover:text-zen-black transition-colors mb-6 inline-block">
            ← Back to Library
          </button>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zen-muted mb-3">Analytics</p>
              <h2 className="text-5xl md:text-6xl font-extralight text-zen-black tracking-tighter">
                統計
              </h2>
            </div>
            <p className="text-zen-muted text-xs font-light hidden md:block">
              {sessions.length} sessions recorded
            </p>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-zen-black via-zen-accent to-transparent mt-6"></div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
          {[
            { label: 'Streak', value: stats?.streak || 0, icon: '🔥', accent: (stats?.streak || 0) > 0 ? 'text-orange-500' : 'text-zen-black', suffix: stats?.streak === 1 ? ' day' : ' days' },
            { label: 'Sessions', value: stats?.totalSessions || 0, icon: '📝' },
            { label: 'Total Cards', value: stats?.totalQuestions || 0, icon: '🗂' },
            { label: 'Correct', value: stats?.totalCorrect || 0, icon: '✓', accent: 'text-green-500' },
            { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯' },
          ].map((card, i) => (
            <div key={i} className={`card-hover p-6 bg-white border border-zen-accent animate-fade-in-up stagger-${i + 1}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] uppercase tracking-[0.3em] text-zen-muted">{card.label}</span>
                <span className="text-lg opacity-40">{card.icon}</span>
              </div>
              <p className={`text-4xl font-extralight ${card.accent || 'text-zen-black'}`}>
                {card.value}{card.suffix ? <span className="text-sm text-zen-muted font-light">{card.suffix}</span> : null}
              </p>
            </div>
          ))}
        </div>

        {/* Accuracy Bar */}
        <div className="mb-16 animate-fade-in-up stagger-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zen-muted">Overall Accuracy</span>
            <span className="text-sm font-light text-zen-black">{accuracy}%</span>
          </div>
          <div className="w-full h-3 bg-zen-gray rounded-full overflow-hidden">
            <div
              className="h-full rounded-full progress-fill"
              style={{
                width: `${accuracy}%`,
                transitionDelay: '0.5s',
                background: accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#eab308' : '#ef4444'
              }}
            ></div>
          </div>
        </div>

        {/* Weak Points */}
        {weakPoints.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex-1 h-px bg-zen-accent"></div>
              <span className="text-[9px] uppercase tracking-[0.4em] text-zen-muted">⚠ Weak Points — Review These</span>
              <div className="flex-1 h-px bg-zen-accent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weakPoints.map((wp, i) => (
                <div key={i} className={`card-hover flex items-center justify-between p-5 bg-white border border-red-100 hover:border-red-300 animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-red-300 text-xs font-mono">×{wp.wrongCount}</span>
                    <span className="text-xl font-light text-zen-black">{wp.prompt}</span>
                  </div>
                  <span className="text-sm text-zen-muted font-light">{wp.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session History */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-1 h-px bg-zen-accent"></div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-zen-muted">Session History</span>
            <div className="flex-1 h-px bg-zen-accent"></div>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-zen-muted font-light text-sm">No sessions yet. Complete a quiz to see your history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, i) => {
                const pct = session.totalQuestions > 0
                  ? Math.round((session.score / session.totalQuestions) * 100)
                  : 0;
                return (
                  <div key={session.id} className={`flex items-center justify-between p-5 bg-white border border-zen-accent card-hover animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                    <div className="flex items-center space-x-6">
                      <div className="w-10 h-10 rounded-full border border-zen-accent flex items-center justify-center">
                        <span className="text-[10px] font-medium text-zen-black">
                          {pct}%
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-light text-zen-black">
                          {session.studySet?.title || 'Unknown Set'}
                        </p>
                        <p className="text-[10px] text-zen-muted mt-1">
                          {session.mode} · {session.score}/{session.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-1 bg-zen-gray rounded-full overflow-hidden">
                        <div className="h-full bg-zen-black rounded-full progress-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                      <p className="text-[9px] text-zen-accent mt-2">
                        {session.startTime ? new Date(session.startTime).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StatsPage;
