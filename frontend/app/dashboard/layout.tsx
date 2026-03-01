'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    LayoutDashboard, FileText, Map, Briefcase, ClipboardList,
    Sparkles, LogOut, ChevronRight, History
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />, label: 'Overview' },
    { href: '/dashboard/resume', icon: <FileText className="w-[18px] h-[18px] shrink-0" />, label: 'My Resume' },
    { href: '/dashboard/jobs', icon: <Briefcase className="w-[18px] h-[18px] shrink-0" />, label: 'Browse Jobs' },
    { href: '/dashboard/applications', icon: <ClipboardList className="w-[18px] h-[18px] shrink-0" />, label: 'Applications' },
    { href: '/dashboard/history', icon: <History className="w-[18px] h-[18px] shrink-0" />, label: 'History Vault' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (mounted && !loading && !user) {
            router.push('/auth/login');
        }
    }, [user, loading, router, mounted]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen flex bg-[#FAFAFC] selection:bg-sky-500/20 selection:text-slate-900 font-sans">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex w-[260px] flex-col bg-white border-r border-slate-100/80 fixed inset-y-0 left-0 z-30">
                {/* Logo Area */}
                <div className="p-8">
                    <Link href="/dashboard" className="flex items-center gap-1.5 group w-fit">
                        <span className="font-extrabold text-[1.35rem] text-slate-900 tracking-tight leading-none">
                            CareerPilot
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mb-1" />
                    </Link>
                </div>

                {/* Main Nav */}
                <div className="flex-1 px-4 py-2 space-y-8">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4 block">Menu</p>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] transition-all duration-200 group relative",
                                            isActive
                                                ? "font-semibold text-slate-900"
                                                : "font-medium text-slate-500 hover:text-slate-900"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-sky-500 rounded-r-full" />
                                        )}
                                        <div className={cn(
                                            "transition-colors",
                                            isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"
                                        )}>
                                            {item.icon}
                                        </div>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* User Info & Logout Footer */}
                <div className="p-6">
                    <div className="flex items-center gap-3 p-3 rounded-2xl mb-2 hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold flex-shrink-0">
                            {user?.full_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.full_name || 'User'}</p>
                            <p className="text-[11px] font-medium text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <LogOut className="w-[18px] h-[18px] shrink-0" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav (Frosted Glass) */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 pb-safe shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center p-2">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px]",
                                    isActive ? "text-sky-500" : "text-slate-400"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    isActive ? "bg-sky-50" : "bg-transparent"
                                )}>
                                    {item.icon}
                                </div>
                                <span className={cn("text-[10px] font-medium", isActive ? "font-bold" : "")}>
                                    {item.label.split(' ')[0]} {/* Shorter label for mobile */}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col relative w-full overflow-hidden pb-20 md:pb-0">
                {/* Subtle Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50/50 rounded-full mix-blend-multiply blur-[120px] pointer-events-none" />

                {/* Mobile Header (Top) */}
                <div className="md:hidden sticky top-0 z-40 w-full flex items-center justify-between px-6 py-4 bg-[#FAFAFC]/80 backdrop-blur-md border-b border-slate-100">
                    <Link href="/dashboard" className="flex items-center gap-1.5 group">
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                            CareerPilot
                        </span>
                        <div className="w-1 h-1 rounded-full bg-sky-500 mb-1" />
                    </Link>
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 text-xs font-bold border border-slate-200">
                        {user?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-[1000px] mx-auto w-full p-6 sm:p-10 lg:p-14">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
