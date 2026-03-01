'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDropOpen, setUserDropOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 transition-all font-sans">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Minimalist Logo */}
                    <Link href="/" className="flex items-center gap-1 group relative">
                        <span className="font-extrabold text-[1.35rem] text-slate-900 tracking-tight leading-none">
                            CareerPilot
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mb-2" />
                        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-sky-500 group-hover:w-full transition-all duration-500 ease-out"></span>
                    </Link>

                    {/* Elegant Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link href="/jobs" className="text-[13px] uppercase tracking-[0.1em] font-medium text-slate-500 hover:text-slate-900 transition-colors">
                            For Talent
                        </Link>
                        <Link href="/employer" className="text-[13px] uppercase tracking-[0.1em] font-medium text-slate-500 hover:text-slate-900 transition-colors">
                            For Employers
                        </Link>
                        <Link href="#" className="text-[13px] uppercase tracking-[0.1em] font-medium text-slate-500 hover:text-slate-900 transition-colors">
                            Blog
                        </Link>
                    </div>

                    {/* Refined Actions */}
                    <div className="hidden md:flex items-center gap-8">
                        {!user ? (
                            <>
                                <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="group bg-sky-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20 active:translate-y-px">
                                    Upload Resume
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link
                                    href={user.role === 'employer' ? '/employer' : '/dashboard'}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
                                >
                                    Workspace
                                </Link>

                                {/* Refined User Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setUserDropOpen(!userDropOpen)}
                                        className="flex items-center gap-2 px-1 py-1 rounded-full transition-all group"
                                    >
                                        <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold border border-slate-200">
                                            {user.full_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                                    </button>

                                    {userDropOpen && (
                                        <div className="absolute right-0 mt-4 w-56 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-5 py-3 border-b border-slate-50">
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Account</p>
                                                <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Minimalist Mobile Trigger */}
                    <button className="md:hidden p-2 text-slate-900 transition-transform active:scale-95" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                    </button>
                </div>
            </div>

            {/* Seamless Mobile Overlay */}
            {menuOpen && (
                <div className="md:hidden absolute inset-x-0 top-20 bg-white/95 backdrop-blur-2xl border-b border-slate-100 px-8 py-10 space-y-8 shadow-2xl animate-in fade-in duration-300 h-[calc(100vh-5rem)] flex flex-col">
                    <div className="space-y-6 flex-1 text-center mt-10">
                        <Link href="/jobs" onClick={() => setMenuOpen(false)} className="block text-2xl font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors">Talent</Link>
                        <Link href="/employer" onClick={() => setMenuOpen(false)} className="block text-2xl font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors">Employers</Link>
                        <Link href="#" onClick={() => setMenuOpen(false)} className="block text-2xl font-light tracking-wide text-slate-600 hover:text-slate-900 transition-colors">Blog</Link>
                    </div>

                    <div className="pt-8 space-y-6 pb-20">
                        {user ? (
                            <>
                                <Link href={user.role === 'employer' ? '/employer' : '/dashboard'} onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 text-lg font-medium text-slate-900">
                                    <LayoutDashboard className="w-5 h-5" /> Workspace
                                </Link>
                                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full py-4 text-center text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-slate-900 transition-colors">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="py-4 text-center text-lg font-medium text-slate-600 transition-colors border border-slate-200 rounded-2xl">Sign In</Link>
                                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="py-4 text-center rounded-2xl bg-sky-500 text-white font-semibold text-lg hover:bg-sky-400 transition-colors">
                                    Upload Resume
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
