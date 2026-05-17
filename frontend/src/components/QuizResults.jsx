import React from 'react';

const QuizResults = ({ studySet, results, startTime, onBackToLibrary }) => {
  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = results.length - correctCount;
  const scorePercentage = Math.round((correctCount / results.length) * 100);
  const duration = Math.round((new Date() - new Date(startTime)) / 1000);

  const getGrade = () => {
    if (scorePercentage >= 90) return { label: '完璧', sub: 'Perfect', color: 'text-green-500' };
    if (scorePercentage >= 70) return { label: '良い', sub: 'Good', color: 'text-blue-500' };
    if (scorePercentage >= 50) return { label: '普通', sub: 'Average', color: 'text-yellow-500' };
    return { label: '頑張れ', sub: 'Keep trying', color: 'text-red-400' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen bg-zen-white">
      {/* Hero section */}
      <div className="pt-16 pb-12 px-8 md:px-16 max-w-5xl mx-auto animate-fade-in-up">
        
        {/* Score Header */}
        <div className="text-center py-16 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zen-muted animate-fade-in stagger-1">Session Complete</p>
          <div className={`text-8xl md:text-9xl font-thin animate-fade-in-up ${grade.color}`}>
            {grade.label}
          </div>
          <p className="text-sm text-zen-muted font-light animate-fade-in stagger-2">{grade.sub}</p>
        </div>

        {/* Score Bar */}
        <div className="relative w-full h-2 bg-zen-gray rounded-full overflow-hidden mb-16 animate-fade-in stagger-3">
          <div
            className="absolute left-0 top-0 h-full bg-zen-black rounded-full progress-fill"
            style={{ width: `${scorePercentage}%`, transitionDelay: '0.5s' }}
          ></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Accuracy', value: `${scorePercentage}%` },
            { label: 'Correct', value: correctCount, accent: 'text-green-500' },
            { label: 'Wrong', value: wrongCount, accent: 'text-red-400' },
            { label: 'Time', value: `${duration}s` },
          ].map((stat, i) => (
            <div key={i} className={`p-6 bg-white border border-zen-accent text-center card-hover animate-fade-in-up stagger-${i + 1}`}>
              <p className="text-[9px] uppercase tracking-[0.3em] text-zen-muted mb-2">{stat.label}</p>
              <p className={`text-3xl font-extralight ${stat.accent || 'text-zen-black'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center space-x-4 mb-10">
          <div className="flex-1 h-px bg-zen-accent"></div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-zen-muted">Detailed Review</span>
          <div className="flex-1 h-px bg-zen-accent"></div>
        </div>

        {/* Detail List */}
        <div className="space-y-3 mb-16">
          {results.map((res, idx) => {
            const question = studySet.questions.find(q => q.id === res.questionId);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-5 bg-white border transition-all duration-300 hover:translate-x-1 animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${
                  res.isCorrect ? 'border-green-100 hover:border-green-300' : 'border-red-100 hover:border-red-300'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <span className={`text-lg w-8 text-center ${res.isCorrect ? 'text-green-500' : 'text-red-400'}`}>
                    {res.isCorrect ? '✓' : '✕'}
                  </span>
                  <div>
                    <p className="text-lg font-light text-zen-black">
                      {question?.prompt}
                    </p>
                    {!res.isCorrect && (
                      <p className="text-xs text-red-300 font-light mt-1">
                        Your answer: <span className="line-through">{res.userAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light text-zen-muted">{question?.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="flex justify-center pb-16">
          <button 
            onClick={onBackToLibrary}
            className="btn-magnetic px-14 py-4 bg-zen-black text-white text-[10px] uppercase tracking-[0.2em]"
          >
            Back to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
