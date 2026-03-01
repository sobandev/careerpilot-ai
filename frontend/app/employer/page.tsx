'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
    Briefcase, Users, ClipboardList, TrendingUp, Plus, Building2,
    Loader2, ChevronRight, CheckCircle2, BarChart3, Globe, MapPin, Sparkles, Navigation
} from 'lucide-react';
import Link from 'next/link';

interface Company {
    id: string;
    name: string;
    industry: string;
    location: string;
    description?: string;
    website?: string;
}

interface Stats {
    total_jobs: number;
    total_applications: number;
    shortlisted: number;
    hired: number;
}

export default function EmployerDashboard() {
    const { user } = useAuth();
    const [company, setCompany] = useState<Company | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [showSetup, setShowSetup] = useState(false);
    const [companyForm, setCompanyForm] = useState({ name: '', description: '', website: '', industry: 'technology', location: 'Karachi, Pakistan', size: '1-50' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [comp, st] = await Promise.allSettled([api.getMyCompany(), api.getEmployerStats()]);
                if (comp.status === 'fulfilled' && comp.value) setCompany(comp.value as Company);
                else setShowSetup(true);
                if (st.status === 'fulfilled') setStats(st.value as Stats);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSaveCompany = async () => {
        setSaving(true);
        try {
            const res = await api.createCompany(companyForm);
            setCompany(res as Company);
            setShowSetup(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col h-[60vh] items-center justify-center gap-6">
            <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-sky-100" />
            </div>
            <p className="text-slate-400 font-medium tracking-tight text-sm">Initializing Intelligence Headquarters...</p>
        </div>
    );

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 animate-[fade-in_0.6s_ease-out_forwards] pb-20">

            {/* Header Section */}
            <div className="space-y-4 pt-2">
                <h1 className="text-[2.5rem] font-bold tracking-tight text-slate-900 leading-tight">
                    Intelligence Headquarters
                </h1>
                <p className="text-xl text-slate-500 font-medium tracking-wide">
                    Hire faster, smarter — unlock exceptional talent with AI precision matching.
                </p>
            </div>

            {/* Company Setup Wizard */}
            {showSetup && (
                <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] group">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-50 rounded-full blur-[100px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative z-10">
                        <div className="mb-10">
                            <h2 className="text-[1.75rem] font-bold flex items-center gap-3 text-slate-900 mb-3 tracking-tight">
                                <div className="w-10 h-10 rounded-xl bg-[#FAFAFC] border border-slate-100 shadow-inner flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-sky-500" />
                                </div>
                                Finalize Your Hub
                            </h2>
                            <p className="text-slate-500 text-lg font-medium">
                                Establish your organization&apos;s footprint to activate the talent alignment engine.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 bg-[#FAFAFC] p-8 rounded-3xl border border-slate-100 shadow-inner">
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Company Name *</label>
                                <input type="text" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                                    placeholder="e.g. Acme Corporation" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none font-medium shadow-sm" />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Industry</label>
                                <select value={companyForm.industry} onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none font-medium shadow-sm capitalize cursor-pointer appearance-none">
                                    {['technology', 'finance', 'healthcare', 'marketing', 'education', 'design', 'sales'].map((i) => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Location Area</label>
                                <input type="text" value={companyForm.location} onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                                    placeholder="e.g. Remote, or Karachi PK" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none font-medium shadow-sm" />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Website URL</label>
                                <input type="text" value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                                    placeholder="https://" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none font-medium shadow-sm" />
                            </div>
                            <div className="sm:col-span-2 space-y-2.5">
                                <label className="text-[13px] font-bold uppercase tracking-widest text-slate-500">About the Organization</label>
                                <textarea value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                                    placeholder="Describe your mission, values, and what makes your team unique..." rows={4}
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none font-medium shadow-sm resize-none" />
                            </div>

                            <div className="sm:col-span-2 pt-6 border-t border-slate-200 mt-2">
                                <button onClick={handleSaveCompany} disabled={saving || !companyForm.name} className="flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-slate-900 text-white font-bold shadow-md hover:bg-slate-800 transition-all active:scale-95 text-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                                    {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Provisioning Hub...</> : <><CheckCircle2 className="w-5 h-5" /> Launch Workspace</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!showSetup && (
                <>
                    {/* Core Intelligence Metrics */}
                    {stats && stats.total_jobs > 0 && (
                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                            {[
                                { label: 'Active Openings', value: stats.total_jobs, icon: <Briefcase className="w-6 h-6 text-sky-500" />, badge: 'bg-sky-50', border: 'border-sky-100' },
                                { label: 'Total Pipeline', value: stats.total_applications, icon: <Users className="w-6 h-6 text-slate-400" />, badge: 'bg-[#FAFAFC]', border: 'border-slate-100' },
                                { label: 'AI Shortlisted', value: stats.shortlisted, icon: <Sparkles className="w-6 h-6 text-emerald-500 group-hover:animate-pulse" />, badge: 'bg-emerald-50', border: 'border-emerald-100' },
                                { label: 'Hired YTD', value: stats.hired, icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" />, badge: 'bg-indigo-50', border: 'border-indigo-100' },
                            ].map((s, idx) => (
                                <div key={s.label} className="bg-white/80 backdrop-blur-[2px] rounded-3xl p-6 border shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] group" style={{ borderColor: idx === 2 ? '#a7f3d0' : '#f1f5f9' }}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.badge} ${s.border}`}>
                                            {s.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[2.5rem] font-bold tracking-tight text-slate-900 leading-none mb-1">{s.value}</p>
                                        <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dashboard Split View */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Pipeline Controls Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-[1.35rem] font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                                <div className="w-8 h-8 rounded-lg bg-[#FAFAFC] border border-slate-100 flex items-center justify-center">
                                    <Navigation className="w-4 h-4 text-slate-400" />
                                </div>
                                Pipeline Momentum
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Post Job Card */}
                                <Link href="/employer/post-job" className={`group flex flex-col bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] hover:border-slate-200 h-full relative overflow-hidden ${(!stats || stats.total_jobs === 0) ? 'md:col-span-2' : ''}`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="w-14 h-14 rounded-2xl bg-[#FAFAFC] border border-slate-100 shadow-inner flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <h3 className={`text-xl font-bold text-slate-900 tracking-tight mb-2 relative z-10 ${(!stats || stats.total_jobs === 0) ? 'text-2xl' : ''}`}>
                                        {(!stats || stats.total_jobs === 0) ? "Publish Your First Requisition" : "Publish Requisition"}
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-grow relative z-10">Deploy a new role to the intelligence network and let the matching engine find your top 5% candidates.</p>
                                    <div className="flex items-center text-[14px] font-bold text-slate-900 mt-auto relative z-10">
                                        Create Role <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                                    </div>
                                </Link>

                                {/* Review Applicants Card */}
                                {stats && stats.total_jobs > 0 && (
                                    <Link href="/employer/applicants" className="group flex flex-col bg-slate-900 rounded-[2rem] border border-slate-800 p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] h-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/5 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform backdrop-blur-sm">
                                            <ClipboardList className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight mb-2 relative z-10">Review Top Matches</h3>
                                        <p className="text-slate-400 font-medium leading-relaxed mb-8 flex-grow relative z-10">Access your candidate pipeline, view intelligent matching summaries, and advance the best talent.</p>
                                        <div className="flex items-center text-[14px] font-bold text-sky-400 mt-auto relative z-10">
                                            Enter Pipeline <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Company Identity / Insights Box */}
                        <div className="space-y-6">
                            <h2 className="text-[1.35rem] font-bold text-slate-900 flex items-center gap-3 tracking-tight">
                                <div className="w-8 h-8 rounded-lg bg-[#FAFAFC] border border-slate-100 flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                </div>
                                Organization
                            </h2>

                            {company && (
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] overflow-hidden relative">
                                    {/* Glass header bg */}
                                    <div className="h-28 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50 relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                                    </div>

                                    <div className="px-8 pb-8 flex flex-col items-center text-center relative z-10">
                                        <div className="h-20 w-20 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center -mt-10 mb-4 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-sky-50 opacity-50" />
                                            <span className="text-3xl font-black text-slate-900 relative z-10">
                                                {company.name[0]?.toUpperCase()}
                                            </span>
                                        </div>

                                        <h3 className="text-[1.35rem] font-bold text-slate-900 mb-1 tracking-tight">{company.name}</h3>
                                        <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" /> {company.location}
                                        </p>

                                        <div className="w-full space-y-2 mb-6">
                                            <div className="flex items-center justify-center gap-2 bg-[#FAFAFC] border border-slate-100 rounded-xl py-3 text-[13px] font-bold tracking-wide text-slate-600 capitalize">
                                                <Briefcase className="w-4 h-4 text-slate-400" /> {company.industry} Sector
                                            </div>
                                            {company.website && (
                                                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#FAFAFC] hover:bg-slate-50 hover:text-slate-900 border border-slate-100 rounded-xl py-3 text-[13px] font-bold tracking-wide text-slate-600 transition-colors">
                                                    <Globe className="w-4 h-4" /> {company.website.replace(/^https?:\/\//, '')}
                                                </a>
                                            )}
                                        </div>

                                        <div className="w-full text-left bg-sky-50/50 rounded-xl p-4 border border-sky-100/50">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-700">AI Insight</span>
                                            </div>
                                            <p className="text-[13px] text-sky-900/80 font-medium leading-relaxed italic">
                                                &quot;Your employer brand velocity is increasing. Roles in your sector are matching with top 10% candidates in 48 hours.&quot;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}

function ArrowRight(props: React.ComponentProps<"svg">) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
