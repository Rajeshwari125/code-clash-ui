'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AlertCircle, Lock, User, Shield, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 text-foreground flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="bg-gradient-to-br from-card to-card/90 backdrop-blur-lg border-border/50 p-8 w-full max-w-md shadow-2xl relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={32} className="text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-muted-foreground">
            <span className="text-accent font-semibold">Code Clash</span> Administration Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <User size={16} className="text-accent" />
              Username
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="bg-input border-border/50 focus:border-accent transition-colors pl-10"
                disabled={loading}
                required
              />
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Lock size={16} className="text-accent" />
              Password
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="bg-input border-border/50 focus:border-accent transition-colors pl-10"
                disabled={loading}
                required
              />
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive animate-in slide-in-from-top duration-300">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 text-base py-6 shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              'Login to Dashboard'
            )}
          </Button>
        </form>

        {/* Demo Credentials */}


        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <p className="text-xs text-center text-muted-foreground">
            🔒 Secure admin access • All activities are logged
          </p>
        </div>
      </Card>
    </div>
  );
}
