import React from 'react';

const LiquidBackground = () => (
  <div className="liquid-bg-container">
    <div className="liquid-blob blob-1"></div>
    <div className="liquid-blob blob-2"></div>
    <div className="liquid-blob blob-3"></div>
    <div className="liquid-blob blob-4"></div>
  </div>
);

const QuizResults = ({ studySet, results, startTime, onBackToLibrary }) => {
  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = results.length - correctCount;
  const scorePercentage = Math.round((correctCount / results.length) * 100);
  const duration = Math.round((new Date() - new Date(startTime)) / 1000);

  const getGrade = () => {
    if (scorePercentage >= 90) return { label: '完璧', sub: 'Perfect', color: 'text-emerald-500 drop-shadow-sm font-bold' };
    if (scorePercentage >= 70) return { label: '良い', sub: 'Good', color: 'text-sky-500 drop-shadow-sm font-bold' };
    if (scorePercentage >= 50) return { label: '普通', sub: 'Average', color: 'text-amber-500 drop-shadow-sm font-bold' };
    return { label: '頑張れ', sub: 'Keep trying', color: 'text-red-500 drop-shadow-sm font-bold' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <LiquidBackground />

      {/* Hero section */}
      <div className="pt-16 pb-12 px-8 md:px-16 max-w-5xl mx-auto animate-fade-in-up z-10 relative">
        
        {/* Score Header */}
        <div className="text-center py-16 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zen-black/60 font-bold animate-fade-in stagger-1">Session Complete</p>
          <div className={`text-8xl md:text-9xl font-extralight animate-fade-in-up ${grade.color}`}>
            {grade.label}
          </div>
          <p className="text-sm text-zen-black/60 font-semibold animate-fade-in stagger-2">{grade.sub}</p>
        </div>

        {/* Score Bar */}
        <div className="glass-panel p-4 mb-16 animate-fade-in stagger-3">
          <div className="w-full h-3.5 bg-black/5 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full bg-zen-black rounded-full progress-fill"
              style={{ width: `${scorePercentage}%`, transitionDelay: '0.5s' }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Accuracy', value: `${scorePercentage}%` },
            { label: 'Correct', value: correctCount, accent: 'text-emerald-500 font-bold' },
            { label: 'Wrong', value: wrongCount, accent: 'text-red-500 font-bold' },
            { label: 'Time', value: `${duration}s` },
          ].map((stat, i) => (
            <div key={i} className={`glass-panel glass-panel-hover p-6 text-center animate-fade-in-up stagger-${i + 1}`}>
              <p className="text-[9px] uppercase tracking-[0.3em] text-zen-black/60 font-bold mb-2">{stat.label}</p>
              <p className={`text-3xl font-extralight ${stat.accent || 'text-zen-black'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-4 mb-10">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-white/40"></div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-zen-black/60 font-bold">diagnostic</span>
          <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-white/40"></div>
        </div>
 
        {/* Detail List */}
        <div className="space-y-4 mb-16">
          {results.map((res, idx) => {
            const question = studySet.questions.find(q => q.id === res.questionId);
            return (
              <div
                key={idx}
                className={`glass-panel glass-panel-hover flex items-center justify-between p-5 border-l-4 animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${
                  res.isCorrect ? 'border-l-emerald-400' : 'border-l-red-400'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <span className={`text-lg w-8 text-center font-bold ${res.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                    {res.isCorrect ? '✓' : '✕'}
                  </span>
                  <div>
                    <p className="text-lg font-light text-zen-black">
                      {question?.prompt}
                    </p>
                    {!res.isCorrect && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        Your answer: <span className="line-through">{res.userAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zen-black/60">{question?.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
 
        {/* Back Button */}
        <div className="flex justify-center pb-16">
          <button 
            onClick={onBackToLibrary}
            className="px-14 py-4 glass-btn text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer"
          >
            Back to Repository
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
