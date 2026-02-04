'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    actionButton?: React.ReactNode;
}

export default function AdminLayout({ children, title, actionButton }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Add useEffect to toggle body class if needed, or just wrap
    // But since Next.js layout structure is complex, applying a style to this container and ensuring it covers
    // might be easier. However, the 'body' tag is global.
    // Let's use a useEffect to add the class to the body tag when mounted.

    useEffect(() => {
        document.body.classList.add('admin-body');
        return () => {
            document.body.classList.remove('admin-body');
        };
    }, []);

    return (
        <div className="min-h-screen bg-background isolate">
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
