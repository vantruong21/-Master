import React, { useState, useEffect, useCallback, useMemo } from 'react';

const QuizEngine = ({ studySet, mode, onFinish, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(mode === 'GENIUS' ? 10 : null);
  const [results, setResults] = useState([]);
  const [startTime] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Shuffle the questions once at the beginning of the quiz session
  const questions = useMemo(() => {
    return [...studySet.questions].sort(() => Math.random() - 0.5);
  }, [studySet.questions]);

  // Pre-determine mode for each question in Genius mode (fixed at mount)
  const geniusModeMap = useMemo(() => {
    if (mode !== 'GENIUS') return [];
    return questions.map(() => (Math.random() > 0.5 ? 'TYPING' : 'MCQ'));
  }, [mode, questions]);

  const currentQuestion = questions[currentIndex];

  // Determine current question's input type
  const currentInputType = useMemo(() => {
    if (mode === 'TYPING') return 'TYPING';
    if (mode === 'MCQ') return 'MCQ';
    return geniusModeMap[currentIndex] || 'TYPING';
  }, [mode, currentIndex, geniusModeMap]);

  const generateOptions = useCallback(() => {
    if (!currentQuestion) return [];
    const distractors = questions
      .filter(q => q.id !== currentQuestion.id)
      .map(q => q.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [currentQuestion.answer, ...distractors].sort(() => 0.5 - Math.random());
  }, [currentIndex, questions, currentQuestion]);

  useEffect(() => {
    if (currentInputType === 'MCQ') {
      setOptions(generateOptions());
    }
    if (mode === 'GENIUS') {
      setTimeLeft(10);
    }
  }, [currentIndex, currentInputType, mode, generateOptions]);

  // Timer for Genius Mode
  useEffect(() => {
    if (mode === 'GENIUS' && timeLeft !== null && !feedback) {
      if (timeLeft <= 0) {
        handleAnswer(null);
        return;
      }
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, mode, feedback]);

  const handleAnswer = (answer) => {
    if (feedback) return; // Prevent double-click

    const isCorrect = answer !== null && (
      currentInputType === 'TYPING'
        ? answer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()
        : answer === currentQuestion.answer
    );

    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    const detail = {
      questionId: currentQuestion.id,
      userAnswer: answer || "TIME_OUT",
      isCorrect: isCorrect
    };

    const newResults = [...results, detail];
    setResults(newResults);

    setTimeout(() => {
      setFeedback(null);
      setIsTransitioning(true);
      
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setUserInput('');
        } else {
          onFinish(newResults, startTime);
        }
        setIsTransitioning(false);
      }, 200);
    }, 600);
  };

  if (!currentQuestion) return null;

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen bg-zen-white flex flex-col items-center justify-center p-8 transition-all duration-200 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>

      {/* Confirm Exit Modal */}
      {showConfirmExit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center modal-backdrop" style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
          <div className="bg-white border border-zen-accent p-10 max-w-sm w-full animate-scale-in text-center space-y-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zen-muted">⚠ Confirm Exit</p>
            <p className="text-sm font-light text-zen-black">Your progress ({currentIndex}/{questions.length}) will be lost.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmExit(false)}
                className="flex-1 py-3 border border-zen-accent text-[10px] uppercase tracking-[0.2em] text-zen-muted hover:text-zen-black hover:border-zen-black transition-all"
              >
                Continue
              </button>
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-zen-black text-white text-[10px] uppercase tracking-[0.2em] btn-magnetic"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl space-y-12 animate-fade-in-up">
        
        {/* Exit Button + Progress */}
        <div>
          <button
            onClick={() => setShowConfirmExit(true)}
            className="hover-underline text-[10px] uppercase tracking-[0.2em] text-zen-muted hover:text-zen-black transition-colors duration-300 mb-4 inline-block"
          >
            ← Exit
          </button>
          <div className="flex justify-between items-end">
            <div className="space-y-2 flex-1 mr-8">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zen-muted">
                  {currentIndex + 1} / {questions.length}
                </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zen-accent">
                {mode === 'GENIUS' ? `Genius · ${currentInputType === 'TYPING' ? '⌨ Type' : '◉ Pick'}` : mode}
              </p>
            </div>
            <div className="w-full h-[2px] bg-zen-accent overflow-hidden">
              <div className="h-full bg-zen-black progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
          {mode === 'GENIUS' && (
            <div className={`text-5xl font-thin tabular-nums transition-all duration-300 ${
              timeLeft <= 3 ? 'text-red-400 animate-countdown' : 'text-zen-black'
            }`}>
              {timeLeft}
            </div>
          )}
          </div>
        </div>

        {/* Prompt Card */}
        <div className={`bg-white border p-12 md:p-16 text-center shadow-sm transition-all duration-500 ${
          feedback === 'correct' ? 'border-green-300 bg-green-50/30' :
          feedback === 'wrong' ? 'border-red-300 bg-red-50/30' :
          'border-zen-accent'
        }`}>
          <span className="text-[9px] uppercase tracking-[0.4em] text-zen-accent mb-6 block">
            {currentQuestion.type || 'QUESTION'}
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-zen-black tracking-tight leading-none">
            {currentQuestion.prompt}
          </h2>
          {currentQuestion.hint && (
            <p className="mt-8 text-sm text-zen-muted font-light italic animate-fade-in">
              💡 {currentQuestion.hint}
            </p>
          )}
          
          {/* Feedback indicator */}
          {feedback && (
            <div className={`mt-6 text-sm font-light animate-fade-in ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
              {feedback === 'correct' ? '✓ Correct!' : `✕ Answer: ${currentQuestion.answer}`}
            </div>
          )}
        </div>

        {/* Answer Area */}
        {!feedback && (
          <div className="space-y-4 animate-fade-in">
            {currentInputType === 'TYPING' ? (
              <div className="relative group">
                <input
                  autoFocus
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userInput.trim() && handleAnswer(userInput)}
                  placeholder="Type your answer..."
                  className="w-full bg-transparent border-b-2 border-zen-accent py-4 text-2xl font-light focus:outline-none focus:border-zen-black transition-all duration-300 text-center"
                />
                <p className="text-center mt-4 text-[9px] text-zen-accent uppercase tracking-[0.3em]">
                  Press Enter ↵
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className="option-btn p-5 bg-white border border-zen-accent text-sm font-light text-left hover:bg-zen-gray cursor-pointer"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
