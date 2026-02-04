'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Users, Building2, UserPlus, X, AlertCircle } from 'lucide-react';
import { createParticipant } from '@/lib/db';

export default function ParticipantRegister() {
  const [teamName, setTeamName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [participants, setParticipants] = useState(['', '']);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddParticipant = () => {
    setParticipants([...participants, '']);
  };

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (teamName && collegeName && participants.some(p => p)) {
      setLoading(true);

      try {
        const validParticipants = participants.filter(p => p);

        // Save to Supabase
        const result = await createParticipant({
          team: teamName,
          college: collegeName,
          members: validParticipants,
          status: 'Active',
          joined: new Date().toISOString(),
          email: '' // Optional field
        });

        // Save team data to localStorage for session persistence
        const teamData = {
          id: result.id,
          teamName,
          collegeName,
          participants: validParticipants,
          registeredAt: new Date().toISOString()
        };
        localStorage.setItem('teamData', JSON.stringify(teamData));

        setSubmitted(true);
      } catch (err) {
        console.error('Registration error:', err);
        setError('Failed to register team. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveParticipant = (index: number) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground flex items-center justify-center p-4">
        <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-4xl text-white">✓</div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Registration Successful!
            </h1>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Your team <span className="text-accent font-semibold">{teamName}</span> has been registered successfully.
            </p>
            <p className="text-muted-foreground mb-8 text-sm">
              Please proceed to enter the quiz code to start competing.
            </p>
            <Link href="/participant/quiz-code">
              <Button className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 mb-3 shadow-lg">
                Enter Quiz Code
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-border/50 bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
        </div>
      </nav>

      {/* Registration Form */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-12 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mb-4 shadow-lg">
            <Users size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Team Registration
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Register your team to participate in Code Clash
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <Card className="bg-gradient-to-br from-card to-card/90 border-border/50 shadow-2xl p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Team Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Users size={16} className="text-accent" />
                Team Name
              </label>
              <Input
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="bg-input border-border/50 focus:border-accent transition-colors h-11 sm:h-12"
              />
            </div>

            {/* College Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Building2 size={16} className="text-accent" />
                College / Institution Name
              </label>
              <Input
                type="text"
                placeholder="Enter your college name"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
                className="bg-input border-border/50 focus:border-accent transition-colors h-11 sm:h-12"
              />
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <UserPlus size={16} className="text-accent" />
                  Team Members
                </label>
                <span className="text-xs sm:text-sm px-3 py-1 bg-accent/10 text-accent rounded-full font-medium border border-accent/30">
                  {participants.length} {participants.length === 1 ? 'member' : 'members'}
                </span>
              </div>

              <div className="space-y-3">
                {participants.map((participant, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder={`Member ${index + 1} name`}
                        value={participant}
                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                        className="bg-input border-border/50 focus:border-accent transition-colors h-11 sm:h-12 pl-10"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {index + 1}
                      </span>
                    </div>
                    {participants.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent flex-shrink-0 h-11 sm:h-12 w-11 sm:w-12"
                        onClick={() => handleRemoveParticipant(index)}
                      >
                        <X size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 border-accent/50 text-accent hover:bg-accent/10 bg-transparent gap-2 h-11 sm:h-12"
                onClick={handleAddParticipant}
              >
                <UserPlus size={18} />
                Add Team Member
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Add at least 2 team members. You can add more members by clicking "Add Team Member" button.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:from-accent/90 hover:to-accent/70 text-base py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              {loading ? 'Registering...' : 'Register Team'}
            </Button>
          </form>
        </Card>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Your information is secure and will only be used for this competition
          </p>
        </div>
      </div>
    </div>
  );
}
