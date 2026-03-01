'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Navigation, Clock, Eye, CheckCircle2, XCircle, MapPin, Search, ChevronDown, Building2, MoreHorizontal, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Application {
    id: string;
    status: string;
    applied_at: string;
    match_score?: number;
    jobs?: {
        title: string;
        industry: string;
        location: string;
        job_type: string;
        companies?: { name: string };
    };
    ai_feedback?: string[];
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; ring: string }> = {
    applied: { label: 'Applied', icon: <Clock className="w-3.5 h-3.5" />, bg: 'bg-slate-50', text: 'text-slate-600', ring: 'border-slate-200' },
    viewed: { label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" />, bg: 'bg-amber-50', text: 'text-amber-700', ring: 'border-amber-200/60' },
    shortlisted: { label: 'Shortlisted', icon: <CheckCircle2 className="w-3.5 h-3.5" />, bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'border-emerald-200 animate-pulse' },
    rejected: { label: 'Rejected', icon: <XCircle className="w-3.5 h-3.5" />, bg: 'bg-rose-50/50', text: 'text-rose-600', ring: 'border-rose-100' },
    hired: { label: 'Hired 🎉', icon: <CheckCircle2 className="w-3.5 h-3.5" />, bg: 'bg-emerald-500', text: 'text-white', ring: 'border-emerald-600' },
};

function timeAgo(d: string) {
    const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
}

export default function ApplicationsPage() {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.getApplications();
                setApps(data.applications as unknown as Application[]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = {
        total: apps.length,
        active: apps.filter(a => !['rejected', 'hired'].includes(a.status)).length,
        applied: apps.filter((a) => a.status === 'applied').length,
        viewed: apps.filter((a) => a.status === 'viewed').length,
        shortlisted: apps.filter((a) => a.status === 'shortlisted' || a.status === 'hired').length,
        rejected: apps.filter((a) => a.status === 'rejected').length,
    };

    const filteredApps = apps.filter(app => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            app.jobs?.title.toLowerCase().includes(query) ||
            app.jobs?.companies?.name.toLowerCase().includes(query) ||
            app.status.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                    <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-sky-100" />
                </div>
                <p className="text-slate-400 font-medium tracking-tight text-sm">Syncing application pipeline...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto space-y-12 animate-[fade-in_0.6s_ease-out_forwards] pb-20">

            {/* Header / Motivational Space */}
            <div className="space-y-4 pt-2">
                <h1 className="text-[2.5rem] font-bold tracking-tight text-slate-900 leading-tight">
                    Momentum is Building.
                </h1>
                <p className="text-xl text-slate-500 font-medium tracking-wide">
                    You have <span className="font-bold text-slate-700">{stats.active}</span> active opportunities in motion. Every step forward is progress.
                </p>
            </div>

            {/* Premium Stat Overview Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Total Stats block */}
                <div className="bg-white/60 backdrop-blur-sm border-l-4 border-slate-300 rounded-r-2xl rounded-l-sm p-5 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-[2rem] font-black text-slate-800 leading-none mb-1">{stats.total}</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Total Tracked</p>
                </div>

                {/* Applied Block */}
                <div className="bg-white/80 border-l-4 border-slate-200 rounded-r-2xl rounded-l-sm p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all">
                    <p className="text-[2rem] font-bold text-slate-600 leading-none mb-1">{stats.applied}</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Applied</p>
                </div>

                {/* Viewed Block */}
                <div className="bg-amber-50/40 border-l-4 border-amber-300 rounded-r-2xl rounded-l-sm p-5 shadow-[0_15px_30px_-15px_rgba(245,158,11,0.08)] hover:-translate-y-0.5 transition-all">
                    <p className="text-[2rem] font-bold text-amber-700 leading-none mb-1">{stats.viewed}</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-amber-600/70">Viewed by Org</p>
                </div>

                {/* Shortlisted Block */}
                <div className="bg-emerald-50/50 border-l-4 border-emerald-400 rounded-r-2xl rounded-l-sm p-5 shadow-[0_15px_30px_-15px_rgba(16,185,129,0.1)] hover:-translate-y-0.5 transition-all outline outline-1 outline-emerald-100/50">
                    <p className="text-[2rem] font-bold text-emerald-700 leading-none mb-1">{stats.shortlisted}</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-emerald-600">Shortlisted</p>
                </div>

                {/* Rejected Block */}
                <div className="bg-[#FAFAFC] border-l-4 border-rose-200 rounded-r-2xl rounded-l-sm p-5 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                    <p className="text-[2rem] font-bold text-slate-500 leading-none mb-1">{stats.rejected}</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-rose-500/70">Closed</p>
                </div>
            </div>

            {/* Smart Tracking Section */}
            <div className="space-y-6">

                {/* Search & Utility Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by title, company, or status..."
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                        />
                    </div>

                    {/* Minimal Sort Dropdown (Visual only for layout balance) */}
                    <div className="relative shrink-0 w-full sm:w-auto hidden sm:block">
                        <select className="h-12 pl-4 pr-10 rounded-xl border border-slate-200 bg-[#FAFAFC] text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 appearance-none outline-none shadow-sm cursor-pointer transition-colors w-full">
                            <option>Sort: Newest First</option>
                            <option>Sort: Status Update</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Active Applications List */}
                {apps.length === 0 ? (
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] pointer-events-none opacity-50" />

                        <div className="relative z-10">
                            <div className="mx-auto w-24 h-24 bg-[#FAFAFC] rounded-full flex items-center justify-center mb-8 border border-white shadow-xl">
                                <Navigation className="w-10 h-10 text-sky-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                            </div>
                            <h3 className="text-[2rem] font-bold text-slate-900 mb-3 tracking-tight">Your next great role is waiting.</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg font-medium leading-relaxed">
                                You haven't applied to any positions yet. Leverage your AI intelligence feed to discover roles aligned with your velocity.
                            </p>
                            <Link href="/dashboard/jobs" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 transition-all active:scale-95 text-lg">
                                Discover Opportunities
                            </Link>
                        </div>
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 font-medium">
                        No applications match your search.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApps.map((app, idx) => {
                            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
                            const isShortlisted = app.status === 'shortlisted' || app.status === 'hired';

                            return (
                                <div key={app.id}
                                    className={`group flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white border rounded-[1.5rem] p-6 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 animate-[fade-in_0.5s_ease-out_forwards] ${isShortlisted ? 'border-emerald-100 hover:border-emerald-200' : 'border-slate-100 hover:border-slate-200'}`}
                                    style={{ animationDelay: `${Math.min(idx * 75, 400)}ms` }}
                                >
                                    {/* Left Side: Identity & Meta */}
                                    <div className="flex items-start gap-5">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-[#FAFAFC] shadow-inner text-slate-400 group-hover:text-slate-700 transition-colors">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-2 truncate group-hover:text-sky-600 transition-colors">
                                                {app.jobs?.title || 'Job Position'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium text-slate-500 tracking-wide">
                                                <span className="text-slate-700 font-semibold">{app.jobs?.companies?.name || 'Company Name'}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.jobs?.location || 'Remote'}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {timeAgo(app.applied_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Status & Actions */}
                                    <div className="flex items-center justify-between md:justify-end gap-6 ml-19 md:ml-0 border-t md:border-t-0 border-slate-50 pt-4 md:pt-0 mt-2 md:mt-0 w-full md:w-auto">

                                        {/* Premium Badge */}
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${status.bg} ${status.text} ${status.ring}`}>
                                            {status.icon}
                                            <span className="text-sm font-bold tracking-wide">{status.label}</span>
                                        </div>

                                        {/* Action Dots */}
                                        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* AI Feedback Section Breakdown */}
                                    {app.ai_feedback && app.ai_feedback.length > 0 && (
                                        <div className="w-full mt-6 pt-5 border-t border-slate-100/60 bg-gradient-to-tr from-sky-50/30 to-indigo-50/20 rounded-xl p-5 md:ml-[76px] md:w-[calc(100%-76px)]">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg shrink-0">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-[14px]">AI Hiring Coach Insights</h4>
                                            </div>
                                            <ul className="space-y-2.5">
                                                {app.ai_feedback.map((tip, i) => (
                                                    <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0 shadow-sm" />
                                                        <span>{tip.replace(/^-\s*/, '')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
}
