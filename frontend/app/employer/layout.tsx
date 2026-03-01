'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import React from 'react';
import { Sparkles, LayoutDashboard, PlusCircle, ClipboardList, LogOut, ChevronRight, Settings, LifeBuoy } from 'lucide-react';

const navItems = [
    { href: '/employer', icon: <LayoutDashboard className="w-[18px] h-[18px]" />, label: 'Headquarters' },
    { href: '/employer/post-job', icon: <PlusCircle className="w-[18px] h-[18px]" />, label: 'Post Requisition' },
    { href: '/employer/applicants', icon: <ClipboardList className="w-[18px] h-[18px]" />, label: 'Talent Pipeline' },
];

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
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
        <div className="min-h-screen flex bg-[#FAFAFC] font-sans selection:bg-sky-100 selection:text-sky-900">
            {/* Left Navigation Sidebar */}
            <aside className="hidden md:flex w-[280px] flex-col bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)]">

                {/* Brand Logo Area */}
                <div className="h-20 px-6 flex items-center border-b border-slate-50">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-slate-900 rounded-[10px] flex items-center justify-center shadow-md group-hover:bg-slate-800 transition-colors">
                            <Sparkles className="w-4 h-4 text-sky-400" />
                        </div>
                        <span className="font-bold text-slate-900 text-[1.1rem] tracking-tight">
                            CareerPilot <span className="text-slate-400 font-medium">Teams</span>
                        </span>
                    </Link>
                </div>

                {/* Identity / User Area */}
                <div className="p-5 border-b border-slate-50">
                    <div className="flex items-center gap-3 p-3 bg-[#FAFAFC] rounded-2xl border border-slate-100 shadow-inner">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 text-sm font-bold shrink-0">
                            {user?.full_name?.[0]?.toUpperCase() || 'E'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-bold text-slate-900 truncate tracking-tight">{user?.full_name || 'Hiring Manager'}</p>
                            <p className="text-[11px] text-sky-600 font-bold uppercase tracking-wider">Employer</p>
                        </div>
                    </div>
                </div>

                {/* Core Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <div className="px-3 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Core Workspace
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-sky-50 text-sky-700 font-bold shadow-sm border border-sky-100/50'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                                    }`}>
                                <div className={`${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.icon}
                                </div>
                                <span className="text-[14px] tracking-wide">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-sky-400" />}
                            </Link>
                        );
                    })}

                    <div className="px-3 mt-8 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Account
                    </div>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all group">
                        <Settings className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
                        <span className="text-[14px] tracking-wide">Settings</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all group">
                        <LifeBuoy className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-600" />
                        <span className="text-[14px] tracking-wide">Support</span>
                    </Link>
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-50">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold transition-all text-[14px] tracking-wide group">
                        <LogOut className="w-[18px] h-[18px] group-hover:-translate-x-0.5 transition-transform" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 md:ml-[280px] min-w-0">
                <div className="p-5 sm:p-8 lg:p-12 max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
