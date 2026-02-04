'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { createQuizResult } from '@/lib/db';

interface Question {
  id: number;
  question: string;
  options: string[];
  answered: number | null;
  correctAnswer?: number;
}

export default function Quiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizId, setQuizId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [initialTime, setInitialTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load quiz from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentQuizData = localStorage.getItem('currentQuiz');

      if (!currentQuizData) {
        setError('No quiz found. Please enter a valid quiz code.');
        setLoading(false);
        return;
      }

      try {
        const quizData = JSON.parse(currentQuizData);

        if (!quizData.questionsData || quizData.questionsData.length === 0) {
          setError('Quiz has no questions. Please contact admin.');
          setLoading(false);
          return;
        }

        // Convert admin questions to quiz format
        const formattedQuestions: Question[] = quizData.questionsData.map((q: any, index: number) => ({
          id: index + 1,
          question: q.question,
          options: q.options,
          answered: null,
          correctAnswer: q.correctAnswer
        }));

        setQuestions(formattedQuestions);
        const timeInSeconds = quizData.duration * 60;
        setTimeLeft(timeInSeconds);
        setInitialTime(timeInSeconds);
        setQuizTitle(quizData.title);
        setQuizId(quizData.id);
        setLoading(false);
      } catch (err) {
        setError('Error loading quiz data. Please try again.');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !loading && questions.length > 0) {
      handleSubmit();
      return;
    }

    if (!loading && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, loading, questions]);

  const handleSelectOption = (optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestion].answered = optionIndex;
    setQuestions(newQuestions);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    const correctAnswers = questions.filter((q, index) => q.answered === q.correctAnswer).length;
    const score = (correctAnswers / questions.length) * 100;
    const timeTaken = formatTime(initialTime - timeLeft);

    // Get team info from localStorage (saved during registration)
    const teamData = localStorage.getItem('teamData') || '{}';
    const team = JSON.parse(teamData);

    try {
      // Create result object for DB
      await createQuizResult({
        quiz_id: quizId,
        participant_id: team.id, // Assuming teamData has id now
        rank: 0, // Will be calculated by admin/DB view usually, or explicit update
        team: team.teamName || 'Anonymous Team',
        college: team.collegeName || 'Unknown College',
        score: score,
        correct: correctAnswers,
        total: questions.length,
        time: timeTaken,
        submitted_at: new Date().toISOString()
      });

      // Also save to localStorage as backup/verify
      const existingResults = localStorage.getItem('quizResults');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.push({
        quiz_id: quizId,
        team: team.teamName,
        score,
        correct: correctAnswers,
        total: questions.length,
        time: timeTaken,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('quizResults', JSON.stringify(results));

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz results. Please try again or contact admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const answeredCount = questions.filter(q => q.answered !== null).length;
  const unansweredCount = questions.length - answeredCount;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground flex items-center justify-center p-4">
        <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 shadow-2xl p-6 sm:p-8 max-w-lg w-full">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Quiz Completed Successfully! 🎉
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base">
              Thank you for participating. Your responses have been submitted successfully.
            </p>

            {/* Submission Summary */}
            <div className="bg-gradient-to-r from-secondary/30 to-secondary/20 border border-secondary/50 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Submission Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-card/50 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Answered</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{answeredCount}/{questions.length}</p>
                </div>
                <div className="text-center p-3 bg-card/50 rounded-lg">
                  <p className="text-muted-foreground text-xs mb-1">Time Taken</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {formatTime(initialTime - timeLeft)}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground">
                📊 Results will be announced by the administrator. Please check with your quiz coordinator.
              </p>
            </div>

            {/* Action Button */}
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-xl transition-all">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Quiz</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/participant/quiz-code">
            <Button className="w-full bg-accent text-accent-foreground">
              Go Back
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading Quiz...</h2>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
          <p className="text-muted-foreground mb-6">This quiz has no questions.</p>
          <Link href="/participant/quiz-code">
            <Button className="w-full bg-accent text-accent-foreground">
              Go Back
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground">
      {/* Header - Fixed and Responsive */}
      <div className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="text-base sm:text-xl font-bold truncate">{quizTitle || 'Code Clash Quiz'}</div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-lg font-bold px-2 sm:px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-destructive/20 text-destructive' : 'bg-accent/20 text-accent'
              }`}>
              <Clock size={16} className="sm:w-5 sm:h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Quiz Area */}
          <div className="flex-1 order-2 lg:order-1">
            <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 shadow-lg p-4 sm:p-6 lg:p-8">
              {/* Progress Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <div className="flex-1 sm:max-w-xs bg-secondary/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent to-accent/60 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 sm:mb-8 leading-tight">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-6 sm:mb-8">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left font-medium text-sm sm:text-base ${question.answered === index
                      ? 'border-accent bg-gradient-to-r from-accent/20 to-accent/10 text-foreground shadow-md scale-[1.02]'
                      : 'border-border/50 bg-secondary/20 text-foreground hover:border-accent/50 hover:bg-secondary/30'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 text-xs sm:text-sm font-bold flex-shrink-0 ${question.answered === index
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-muted-foreground/50'
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                  className="flex-1 border-border/50 bg-transparent hover:bg-secondary/50 disabled:opacity-50 gap-2"
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentQuestion === questions.length - 1}
                  variant="outline"
                  className="flex-1 border-border/50 bg-transparent hover:bg-secondary/50 disabled:opacity-50 gap-2"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar - Question Status */}
          <div className="w-full lg:w-80 order-1 lg:order-2">
            <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 shadow-lg p-4 sm:p-6 lg:sticky lg:top-20">
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Quiz Status</h3>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/30">
                  <p className="text-muted-foreground text-xs mb-1">Answered</p>
                  <p className="text-2xl sm:text-3xl font-bold text-accent">{answeredCount}</p>
                </div>
                <div className="text-center p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                  <p className="text-muted-foreground text-xs mb-1">Remaining</p>
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">{unansweredCount}</p>
                </div>
              </div>

              {/* Question Grid */}
              <div className="border-t border-border/50 pt-4">
                <h4 className="text-xs sm:text-sm font-medium mb-3">Quick Navigation</h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`aspect-square rounded-lg text-xs sm:text-sm font-bold transition-all ${currentQuestion === index
                        ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-card scale-110'
                        : q.answered !== null
                          ? 'bg-green-500/30 text-green-400 border-2 border-green-500/50 hover:bg-green-500/40'
                          : 'bg-secondary/50 border-2 border-border/50 hover:border-accent/50 hover:bg-secondary/70'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full mt-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
