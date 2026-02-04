'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Users,
  FileQuestion,
  CheckCircle,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
  Trophy,
  Clock,
  Activity
} from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import StatCard from '@/components/admin/stat-card';

const recentActivities: Array<{
  id: number;
  title: string;
  type: string;
  time: string;
  participants: number;
}> = [];

import { getParticipants, getQuizzes, getQuizResults } from '@/lib/db';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    activeQuizzes: 0,
    completedToday: 0,
    totalParticipants: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [participants, quizzes, results] = await Promise.all([
          getParticipants(),
          getQuizzes(),
          getQuizResults()
        ]);

        const totalMembers = participants.reduce((sum: number, p: any) => {
          // Adjust based on updated logic where members might be an array or count
          const count = Array.isArray(p.members) ? p.members.length : (typeof p.members === 'number' ? p.members : 0);
          return sum + count;
        }, 0);

        // Calculate "Completed Today"
        const today = new Date().toDateString();
        const completedCount = results.filter((r: any) =>
          new Date(r.submitted_at || r.created_at || Date.now()).toDateString() === today
        ).length;

        setStats({
          totalTeams: participants.length,
          activeQuizzes: quizzes.filter((q: any) => q.status === 'Active').length,
          completedToday: completedCount,
          totalParticipants: totalMembers
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout title="Admin Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Welcome Back! 👋
        </h1>
        <p className="text-muted-foreground text-lg">Here's an overview of today's quiz competition</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Teams"
          value={stats.totalTeams}
          subtitle="Active registrations"
          icon={Users}
          trend={0}
          trendLabel="vs last week"
        />
        <StatCard
          title="Active Quizzes"
          value={stats.activeQuizzes}
          subtitle="Currently running"
          icon={FileQuestion}
          trend={0}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          subtitle="Finished quizzes"
          icon={CheckCircle}
          trend={0}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Total Participants"
          value={stats.totalParticipants}
          subtitle="Registered users"
          icon={TrendingUp}
          trend={0}
          trendLabel="this month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/50 border-border/50 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Activity size={20} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Recent Activity</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-lg border border-border/50 hover:border-accent/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <FileQuestion size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {activity.time}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users size={12} />
                          {activity.participants} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${activity.type === 'Active'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                    {activity.type}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Activity size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <h3 className="text-2xl font-bold">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            <Link href="/admin/quiz-management">
              <Button className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 justify-start gap-3 h-12 shadow-md hover:shadow-lg transition-all">
                <Plus size={20} />
                Create New Quiz
              </Button>
            </Link>

            <Link href="/admin/participants">
              <Button variant="outline" className="w-full border-border/50 justify-start gap-3 h-12 bg-secondary/20 hover:bg-secondary/40 hover:border-accent/50 transition-all">
                <Users size={20} />
                View Participants
              </Button>
            </Link>

            <Link href="/admin/results">
              <Button variant="outline" className="w-full border-border/50 justify-start gap-3 h-12 bg-secondary/20 hover:bg-secondary/40 hover:border-accent/50 transition-all">
                <Trophy size={20} />
                View Results
              </Button>
            </Link>

            <Link href="/admin/feedback">
              <Button variant="outline" className="w-full border-border/50 justify-start gap-3 h-12 bg-secondary/20 hover:bg-secondary/40 hover:border-accent/50 transition-all">
                <MessageSquare size={20} />
                View Feedback
              </Button>
            </Link>
          </div>

          {/* Performance Summary */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="font-semibold mb-4 text-sm text-muted-foreground">Today's Performance</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-semibold text-accent">0%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-semibold text-accent">0%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Participation</span>
                  <span className="font-semibold text-accent">0%</span>
                </div>
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6 bg-gradient-to-br from-card to-card/50 border-border/50 p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Database: <span className="text-foreground font-medium">Online</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">API: <span className="text-foreground font-medium">Operational</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Server: <span className="text-foreground font-medium">Healthy</span></span>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
}
