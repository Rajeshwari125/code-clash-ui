'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp, Clock, Target, Download } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import { getQuizResults } from '@/lib/db';

interface Result {
  rank: number;
  team: string;
  score: number;
  correct: number;
  total: number;
  time: string;
  college: string;
  submittedAt?: string;
}

export default function AdminResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState({
    averageScore: 0,
    highestScore: 0,
    averageTime: '0:00',
    totalParticipants: 0
  });

  // Load results from Supabase
  useEffect(() => {
    const loadResults = async () => {
      try {
        const loadedResults = await getQuizResults();
        setResults(loadedResults as unknown as Result[]);

        // Calculate statistics
        if (loadedResults.length > 0) {
          const avgScore = loadedResults.reduce((sum: number, r: any) => sum + Number(r.score), 0) / loadedResults.length;
          const maxScore = Math.max(...loadedResults.map((r: any) => Number(r.score)));

          // Calculate average time (convert time strings to seconds, average, convert back)
          const totalSeconds = loadedResults.reduce((sum: number, r: any) => {
            const [mins, secs] = r.time.split(':').map(Number);
            return sum + (mins * 60 + secs);
          }, 0);
          const avgSeconds = Math.floor(totalSeconds / loadedResults.length);
          const avgMins = Math.floor(avgSeconds / 60);
          const avgSecs = avgSeconds % 60;

          setStats({
            averageScore: avgScore,
            highestScore: maxScore,
            averageTime: `${avgMins}:${avgSecs < 10 ? '0' : ''}${avgSecs}`,
            totalParticipants: loadedResults.length
          });
        }
      } catch (error) {
        console.error('Error loading results:', error);
      }
    };

    loadResults();
  }, []);

  const handleExport = () => {
    if (results.length === 0) {
      alert('No results to export. Results will be available after participants complete the quiz.');
      return;
    }

    // Create CSV content
    const headers = ['Rank', 'Team Name', 'College', 'Score (%)', 'Correct Answers', 'Total Questions', 'Time Taken'];
    const csvContent = [
      headers.join(','),
      ...results.map((result: Result) => [
        result.rank,
        `"${result.team}"`, // Quotes to handle commas in names
        `"${result.college}"`,
        `${result.score.toFixed(1)}%`,
        result.correct,
        result.total,
        result.time
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `quiz_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionButton = (
    <Button
      onClick={handleExport}
      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 gap-2 shadow-md hover:shadow-lg transition-all"
    >
      <Download size={20} />
      <span className="hidden sm:inline">Export Results</span>
    </Button>
  );

  // Calculate score distribution
  const scoreRanges = [
    { range: '90-100%', count: 0, percentage: 0 },
    { range: '80-89%', count: 0, percentage: 0 },
    { range: '70-79%', count: 0, percentage: 0 },
    { range: '60-69%', count: 0, percentage: 0 },
    { range: '50-59%', count: 0, percentage: 0 },
    { range: '0-49%', count: 0, percentage: 0 },
  ];

  return (
    <AdminLayout title="Results" actionButton={actionButton}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Quiz Results
        </h1>
        <p className="text-muted-foreground text-lg">Live leaderboard and detailed performance analytics</p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm font-medium">Average Score</p>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-500 mb-1">{stats.averageScore.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Across all participants</p>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm font-medium">Highest Score</p>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Trophy size={20} className="text-green-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-green-500 mb-1">{stats.highestScore.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">{stats.totalParticipants > 0 ? 'Top performer' : 'No results yet'}</p>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm font-medium">Average Time</p>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-purple-500" />
            </div>
          </div>
          <p className="text-4xl font-bold text-purple-500 mb-1">{stats.averageTime}</p>
          <p className="text-xs text-muted-foreground">To complete quiz</p>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Trophy size={24} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>

        <div className="space-y-3">
          {results.length > 0 ? (
            results.map((result: Result) => {
              const getRankIcon = (rank: number) => {
                if (rank === 1) return <Trophy size={24} className="text-yellow-500" />;
                if (rank === 2) return <Medal size={24} className="text-gray-400" />;
                if (rank === 3) return <Award size={24} className="text-orange-600" />;
                return null;
              };

              return (
                <div
                  key={result.rank}
                  className={`flex items-center gap-4 p-5 rounded-lg border transition-all duration-200 ${result.rank === 1
                    ? 'bg-gradient-to-r from-accent/20 to-accent/10 border-accent shadow-md'
                    : 'bg-gradient-to-r from-secondary/20 to-secondary/10 border-border/50 hover:border-accent/50 hover:shadow-md'
                    }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-16">
                    {getRankIcon(result.rank) || (
                      <span className={`text-2xl font-bold ${result.rank === 1 ? 'text-accent' : 'text-muted-foreground'
                        }`}>
                        #{result.rank}
                      </span>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">{result.team}</p>
                    <p className="text-sm text-muted-foreground">{result.college}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Correct</p>
                      <p className="font-bold text-accent">{result.correct}/{result.total}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Time</p>
                      <p className="font-bold">{result.time}</p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-3xl font-bold text-accent">{result.score.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Trophy size={48} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2 font-semibold">No results yet</p>
              <p className="text-sm text-muted-foreground">Results will appear here after participants complete the quiz.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Score Distribution */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
            <Target size={24} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold">Score Distribution</h2>
        </div>

        <div className="space-y-4">
          {scoreRanges.length > 0 ? (
            scoreRanges.map((range) => (
              <div key={range.range}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{range.range}</span>
                  <span className="text-sm text-muted-foreground">{range.count} teams ({range.percentage}%)</span>
                </div>
                <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full transition-all duration-500"
                    style={{ width: `${range.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Target size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No score distribution data available</p>
            </div>
          )}
        </div>

        {/* Performance Insights */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-accent" />
            Performance Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Strong Performance</p>
              <p className="font-semibold text-green-500">0% scored above 60%</p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
              <p className="font-semibold text-blue-500">0% teams finished</p>
            </div>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
