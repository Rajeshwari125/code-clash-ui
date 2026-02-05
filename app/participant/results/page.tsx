'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function Results() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch latest result from localStorage
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        if (Array.isArray(parsedResults) && parsedResults.length > 0) {
          // Get the most recent result
          const latestResult = parsedResults[parsedResults.length - 1];
          setResult(latestResult);
        }
      } catch (err) {
        console.error('Error parsing results:', err);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <nav className="border-b border-border mb-8">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2 text-accent hover:text-accent/80 transition">
              <ArrowLeft size={20} />
              Back
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-card border-border p-8">
            <h2 className="text-2xl font-bold mb-4">No Results Found</h2>
            <p className="text-muted-foreground mb-6">You haven't completed any quizzes yet.</p>
            <Link href="/participant/quiz-code">
              <Button className="bg-accent text-accent-foreground">Take a Quiz</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">Code Clash</div>
          <Link href="/">
            <Button variant="outline" className="border-border bg-transparent">
              Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Results</h1>
          <p className="text-muted-foreground">Team: <span className="text-accent">{result.team || 'Unknown'}</span></p>
        </div>

        {/* Score Card */}
        <Card className="bg-card border-border p-8 mb-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">Final Score</p>
            <p className="text-6xl font-bold text-accent mb-2">{Math.round(result.score)}%</p>
            <p className="text-muted-foreground">{result.correct} out of {result.total} correct</p>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-green-500" />
              <p className="text-muted-foreground text-sm">Correct Answers</p>
            </div>
            <p className="text-3xl font-bold text-accent">{result.correct}</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-destructive" />
              <p className="text-muted-foreground text-sm">Incorrect/Skipped</p>
            </div>
            <p className="text-3xl font-bold text-destructive">{result.total - result.correct}</p>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <ArrowLeft className="text-blue-500" /> {/* Just an icon */}
              <p className="text-muted-foreground text-sm">Time Taken</p>
            </div>
            <p className="text-3xl font-bold text-accent">{result.time}</p>
          </Card>
        </div>

        {/* Offline Note */}
        {result.isOffline && (
          <Card className="bg-yellow-500/10 border-yellow-500/30 p-4 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
              <AlertCircle size={20} />
              <span className="font-bold">Offline Submission</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This result was saved locally on your device because you were offline.
              Please contact the admin to manually record your score if needed.
            </p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/" className="flex-1">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
