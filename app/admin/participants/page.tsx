'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Users, MapPin, Clock, Eye, Mail, Phone, Trash2, X } from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import { getParticipants, deleteParticipant } from '@/lib/db';

interface Participant {
  id: number;
  team: string;
  college: string;
  members: any; // Can be array or number depending on source
  status: string;
  joined: string;
  email: string;
  score: number;
}

export default function Participants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Load participants from localStorage (quiz results)
  // Load participants from Supabase
  const loadParticipants = async () => {
    try {
      const data = await getParticipants();

      // Format data
      // Supabase returns dates as strings, we might want to format them
      const formattedData = data.map((p: any) => ({
        ...p,
        members: Array.isArray(p.members) ? p.members.length : p.members, // Handle JSONB array
        joined: new Date(p.joined).toLocaleDateString()
      }));

      setParticipants(formattedData);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleViewDetails = (participant: Participant) => {
    setSelectedParticipant(participant);
  };

  const handleDelete = async (participantId: number) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant && confirm(`Delete "${participant.team}"? This will remove all their data.`)) {
      try {
        await deleteParticipant(participantId);
        loadParticipants(); // Reload list
        alert('Participant deleted successfully!');
      } catch (error) {
        console.error('Error deleting participant:', error);
        alert('Failed to delete participant.');
      }
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Participants">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Registered Participants
        </h1>
        <p className="text-muted-foreground text-lg">View and manage all registered teams</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-4">
          <p className="text-muted-foreground text-sm mb-1">Total Teams</p>
          <p className="text-3xl font-bold text-accent">{participants.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-4">
          <p className="text-muted-foreground text-sm mb-1">Active Teams</p>
          <p className="text-3xl font-bold text-green-500">
            {participants.filter(p => p.status === 'Active').length}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-4">
          <p className="text-muted-foreground text-sm mb-1">Total Members</p>
          <p className="text-3xl font-bold text-blue-500">
            {participants.reduce((sum, p) => sum + p.members, 0)}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 p-4">
          <p className="text-muted-foreground text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-purple-500">
            {participants.filter(p => p.status === 'Completed').length}
          </p>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search by team name or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input border-border/50 pl-10 h-12 focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-4">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map((participant) => (
            <Card
              key={participant.id}
              className="bg-gradient-to-r from-card to-card/50 border-border/50 p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Participant Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-colors flex-shrink-0">
                      <Users size={24} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold group-hover:text-accent transition-colors">
                          {participant.team}
                        </h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${participant.status === 'Active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                          {participant.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin size={14} />
                        {participant.college}
                      </div>
                    </div>
                  </div>

                  {/* Participant Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Team Size</p>
                        <p className="font-bold">{participant.members} members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Joined</p>
                        <p className="font-bold">{participant.joined}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-bold text-sm truncate">{participant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-accent to-accent/60" />
                      <div>
                        <p className="text-xs text-muted-foreground">Score</p>
                        <p className="font-bold text-accent">
                          {participant.score > 0 ? `${participant.score}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 lg:flex-none border-border/50 bg-secondary/20 hover:bg-accent/10 hover:text-accent hover:border-accent/50 transition-all gap-2"
                    size="sm"
                    onClick={() => handleViewDetails(participant)}
                  >
                    <Eye size={16} />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 lg:flex-none border-border/50 bg-secondary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all gap-2"
                    size="sm"
                    onClick={() => handleDelete(participant.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="bg-card border-border/50 p-12 text-center">
            <Users size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No participants found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
