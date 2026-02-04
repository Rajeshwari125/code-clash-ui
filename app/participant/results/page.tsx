'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Results() {
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
          <p className="text-muted-foreground">Team: <span className="text-accent">Code Wizards</span></p>
        </div>

        {/* Score Card */}
        <Card className="bg-card border-border p-8 mb-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-2">Final Score</p>
            <p className="text-6xl font-bold text-accent mb-2">85%</p>
            <p className="text-muted-foreground">17 out of 20 correct</p>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Correct Answers</p>
            <p className="text-3xl font-bold text-accent">17</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Incorrect Answers</p>
            <p className="text-3xl font-bold text-destructive">2</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Unanswered</p>
            <p className="text-3xl font-bold text-muted-foreground">1</p>
          </Card>
          <Card className="bg-card border-border p-6">
            <p className="text-muted-foreground text-sm mb-2">Time Taken</p>
            <p className="text-3xl font-bold text-accent">4:35</p>
          </Card>
        </div>

        {/* Ranking */}
        <Card className="bg-card border-border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Leaderboard Position</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-secondary">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-accent w-12 text-center">1</div>
                <div>
                  <p className="font-bold">Code Wizards</p>
                  <p className="text-sm text-muted-foreground">Your Team</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-accent">85%</p>
                <p className="text-sm text-muted-foreground">4:35</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-muted-foreground w-12 text-center">2</div>
                <div>
                  <p className="font-bold">Tech Titans</p>
                  <p className="text-sm text-muted-foreground">Delhi University</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">80%</p>
                <p className="text-sm text-muted-foreground">4:12</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-muted-foreground w-12 text-center">3</div>
                <div>
                  <p className="font-bold">Algorithm Masters</p>
                  <p className="text-sm text-muted-foreground">IIT Bombay</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">75%</p>
                <p className="text-sm text-muted-foreground">4:45</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Answer Review */}
        <Card className="bg-card border-border p-8">
          <h2 className="text-2xl font-bold mb-6">Answer Review</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((q) => (
              <div key={q} className="border-b border-border pb-6 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold">Question {q}</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {q === 1 ? 'What is the time complexity of binary search?' : 
                       q === 2 ? 'Which data structure uses LIFO?' :
                       'What does CSS stand for?'}
                    </p>
                  </div>
                  <div className={`text-sm font-bold px-3 py-1 rounded ${
                    q === 1 ? 'bg-green-500/20 text-green-400' :
                    q === 2 ? 'bg-destructive/20 text-destructive' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {q === 1 ? '✓ Correct' : q === 2 ? '✗ Incorrect' : 'Unanswered'}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    <span className="text-foreground">Your answer:</span> {q === 1 ? 'O(log n)' : q === 2 ? 'Array' : 'Not answered'}
                  </p>
                  {q === 2 && (
                    <p>
                      <span className="text-foreground">Correct answer:</span> Stack
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Link href="/" className="flex-1">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Back to Home
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full border-border bg-transparent">
              Share Results
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
