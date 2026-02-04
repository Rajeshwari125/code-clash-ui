'use client';

import React from "react"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle2, FileQuestion, Clock } from 'lucide-react';
import { getQuizByCode } from '@/lib/db';

export default function QuizCodeEntry() {
  const router = useRouter();
  const [quizCode, setQuizCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundQuiz, setFoundQuiz] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFoundQuiz(null);

    if (!quizCode.trim()) {
      setError('Please enter a quiz code');
      return;
    }

    if (quizCode.length < 6) {
      setError('Quiz code must be at least 6 characters');
      return;
    }

    setLoading(true);

    setLoading(true);

    try {
      // Fetch quiz from Supabase
      const quiz = await getQuizByCode(quizCode.toUpperCase());

      if (quiz) {
        // Quiz found!
        setFoundQuiz(quiz);
        setLoading(false);

        // Save quiz data to localStorage for the quiz page
        localStorage.setItem('currentQuiz', JSON.stringify(quiz));

        // Navigate to quiz after a short delay
        setTimeout(() => {
          router.push('/participant/quiz');
        }, 1500);
      }
    } catch (err) {
      console.error('Quiz fetch error:', err);
      setLoading(false);
      setError('Invalid quiz code. Please check with your admin.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-accent hover:text-accent/80 transition">
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </nav>

      {/* Quiz Code Entry */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Enter Quiz Code</h1>
          <p className="text-muted-foreground">Admin will provide you with a unique quiz code</p>
        </div>

        <Card className="bg-card border-border p-8 mb-8">
          <form onSubmit={handleValidate} className="space-y-6">
            {/* Quiz Code Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Code</label>
              <Input
                type="text"
                placeholder="Enter your quiz code (e.g., PYT001)"
                value={quizCode}
                onChange={(e) => {
                  setQuizCode(e.target.value.toUpperCase());
                  setError('');
                  setFoundQuiz(null);
                }}
                maxLength={20}
                className="bg-input border-border text-lg font-mono tracking-widest"
                disabled={loading || foundQuiz}
              />

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 mt-3 text-destructive">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {foundQuiz && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-500 mb-3">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold">Quiz Found!</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-semibold">Title:</span>
                      <span>{foundQuiz.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileQuestion size={16} />
                      <span>{foundQuiz.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} />
                      <span>{foundQuiz.duration} Minutes</span>
                    </div>
                  </div>
                  <p className="text-xs text-green-500 mt-3">Redirecting to quiz...</p>
                </div>
              )}
            </div>

            {/* Validate Button */}
            <Button
              type="submit"
              disabled={loading || foundQuiz}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-base py-6"
            >
              {loading ? 'Validating...' : foundQuiz ? 'Starting Quiz...' : 'Validate Quiz Code'}
            </Button>
          </form>
        </Card>

        {/* Quiz Rules */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold mb-6">Quiz Rules</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-accent font-bold text-xl min-w-6">1.</div>
              <p className="text-muted-foreground">Once you start the quiz, the timer will begin. You cannot pause it.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-accent font-bold text-xl min-w-6">2.</div>
              <p className="text-muted-foreground">Answer all questions before the time runs out.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-accent font-bold text-xl min-w-6">3.</div>
              <p className="text-muted-foreground">You can navigate between questions using Previous/Next buttons.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-accent font-bold text-xl min-w-6">4.</div>
              <p className="text-muted-foreground">Unanswered questions will be marked separately in the summary.</p>
            </div>
            <div className="flex gap-4">
              <div className="text-accent font-bold text-xl min-w-6">5.</div>
              <p className="text-muted-foreground">Submit your responses before the timer ends for final scoring.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
