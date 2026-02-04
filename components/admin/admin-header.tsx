'use client';

import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
    title: string;
    setSidebarOpen: (open: boolean) => void;
    sidebarOpen: boolean;
    actionButton?: React.ReactNode;
}

export default function AdminHeader({
    title,
    setSidebarOpen,
    sidebarOpen,
    actionButton
}: AdminHeaderProps) {
    return (
        <div className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-10 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-foreground hover:text-accent transition-colors p-2 hover:bg-accent/10 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {actionButton}

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-accent/10 hover:text-accent transition-all"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    </Button>

                    {/* User Profile */}
                    <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                        </div>
                        <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center shadow-lg">
                            <User size={18} className="text-accent-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
