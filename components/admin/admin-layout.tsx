'use client';

import { useState } from 'react';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    actionButton?: React.ReactNode;
}

export default function AdminLayout({ children, title, actionButton }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 text-foreground">
            <div className="flex">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 min-h-screen">
                    <AdminHeader
                        title={title}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        actionButton={actionButton}
                    />

                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
