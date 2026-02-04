'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp, TrendingUp, Download } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';

const SAMPLE_FEEDBACK: Array<{
  id: number;
  team: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}> = [];

export default function Feedback() {
  const averageRating = SAMPLE_FEEDBACK.length > 0 ? (SAMPLE_FEEDBACK.reduce((sum, f) => sum + f.rating, 0) / SAMPLE_FEEDBACK.length).toFixed(1) : '0.0';
  const totalFeedback = SAMPLE_FEEDBACK.length;

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}
      />
    ));
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: SAMPLE_FEEDBACK.filter(f => f.rating === rating).length,
    percentage: totalFeedback > 0 ? (SAMPLE_FEEDBACK.filter(f => f.rating === rating).length / totalFeedback) * 100 : 0
  }));

  const actionButton = (
    <Button
      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 gap-2 shadow-md hover:shadow-lg transition-all"
    >
      <Download size={20} />
      <span className="hidden sm:inline">Export Feedback</span>
    </Button>
  );

  return (
    <AdminLayout title="Feedback" actionButton={actionButton}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Participant Feedback
        </h1>
        <p className="text-muted-foreground text-lg">View ratings, comments, and insights from teams</p>
      </div>

      {/* Overall Rating Summary */}
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-8 mb-8 shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mb-3">
                <div>
                  <div className="text-5xl font-bold text-accent">{averageRating}</div>
                  <div className="text-xs text-muted-foreground">out of 5.0</div>
                </div>
              </div>
              <div className="flex gap-1 justify-center">
                {renderStars(Math.round(parseFloat(averageRating)), 20)}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Overall Rating</h3>
              <p className="text-muted-foreground mb-4">Based on {totalFeedback} reviews</p>
              <div className="flex items-center gap-2">
                <ThumbsUp size={18} className="text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  {totalFeedback > 0 ? Math.round((SAMPLE_FEEDBACK.filter(f => f.rating >= 4).length / totalFeedback) * 100) : 0}% positive feedback
                </span>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div>
            <h3 className="font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex gap-0.5 w-24">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-medium">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {SAMPLE_FEEDBACK.reduce((sum, f) => sum + f.helpful, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total Helpful Votes</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {SAMPLE_FEEDBACK.filter(f => f.rating === 5).length}
            </div>
            <p className="text-xs text-muted-foreground">5-Star Reviews</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {totalFeedback}
            </div>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
        </div>
      </Card>

      {/* Individual Feedback */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <MessageSquare size={20} className="text-accent" />
          </div>
          <h2 className="text-2xl font-bold">Individual Feedback</h2>
        </div>

        {SAMPLE_FEEDBACK.length > 0 ? (
          SAMPLE_FEEDBACK.map((feedback) => (
            <Card
              key={feedback.id}
              className="bg-gradient-to-r from-card to-card/50 border-border/50 p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-accent">{feedback.team.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                        {feedback.team}
                      </h3>
                      <p className="text-xs text-muted-foreground">{feedback.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {renderStars(feedback.rating, 16)}
                    </div>
                    <span className="text-sm font-semibold text-accent">{feedback.rating}.0</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feedback.comment}
                  </p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-accent/10 hover:text-accent gap-2 h-8"
                    >
                      <ThumbsUp size={14} />
                      Helpful ({feedback.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-500/10 hover:text-blue-500 gap-2 h-8"
                    >
                      <MessageSquare size={14} />
                      Reply
                    </Button>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${feedback.rating >= 4
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : feedback.rating === 3
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                  {feedback.rating >= 4 ? 'Positive' : feedback.rating === 3 ? 'Neutral' : 'Negative'}
                </span>
              </div>
            </Card>
          ))
        ) : (
          <Card className="bg-gradient-to-r from-card to-card/50 border-border/50 p-12">
            <div className="text-center">
              <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No feedback available yet</p>
              <p className="text-sm text-muted-foreground mt-2">Feedback will appear here once participants submit their reviews</p>
            </div>
          </Card>
        )}
      </div>

      {/* Insights Section */}
      <Card className="mt-8 bg-gradient-to-br from-card to-card/50 border-border/50 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-accent" />
          </div>
          <h3 className="text-xl font-bold">Key Insights</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Most Appreciated</p>
            <p className="font-semibold text-green-500">No data yet</p>
          </div>
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Needs Improvement</p>
            <p className="font-semibold text-orange-500">No data yet</p>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
