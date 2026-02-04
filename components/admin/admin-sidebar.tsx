'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileQuestion, 
  Users, 
  Trophy, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/quiz-management', label: 'Quiz Management', icon: FileQuestion },
    { href: '/admin/participants', label: 'Participants', icon: Users },
    { href: '/admin/results', label: 'Results', icon: Trophy },
    { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  ];

  return (
    <aside 
      className={`fixed lg:relative left-0 top-0 h-screen bg-gradient-to-b from-card to-card/80 backdrop-blur-lg border-r border-border/50 transition-all duration-300 z-20 ${
        sidebarOpen ? 'w-64' : 'w-0 lg:w-64'
      } overflow-hidden shadow-xl`}
    >
      <div className="p-6">
        {/* Logo Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center shadow-lg">
              <FileQuestion className="text-accent-foreground" size={22} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              Code Clash
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-foreground hover:text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-base gap-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-l-4 border-accent shadow-md' 
                      : 'hover:bg-secondary/50 hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full gap-2 bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  );
}
