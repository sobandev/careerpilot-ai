'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Users, Brain, CheckCircle, XCircle, Eye, Loader2, ChevronDown, BarChart3, Download, FileText, Sparkles, Navigation, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

interface Applicant {
    id: string;
    status: string;
    applied_at: string;
    cover_letter?: string;
    compatibility_score?: number;
    compatibility_details?: Record<string, number>;
    missing_skills?: string[];
    contact_email?: string;
    contact_phone?: string;
    profiles?: {
        full_name: string;
        email: string;
        resume_analysis?: Array<{
            overall_score: number;
            missing_skills: string[];
            strengths: string[];
        }>;
    };
    jobs?: { title: string };
    resume_url?: string;
}

const STATUS_OPTIONS = ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'];

const STATUS_BADGE: Record<string, { bg: string, text: string, border: string }> = {
    applied: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    viewed: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    shortlisted: { bg: 'bg-emerald-50 text-emerald-700 animate-pulse border-emerald-200', text: '', border: '' },
    rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    hired: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

export default function ApplicantsPage() {
    const { user, loading: authLoading } = useAuth();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [selected, setSelected] = useState<Applicant | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setError(null);
                const data: any = await api.getApplicants();
                const list = data.applicants || data.applications;

                if (!list) {
                    setApplicants([]);
                    return;
                }

                const mapped = list.map((app: any) => {
                    const analysis = app.profiles?.resume_analysis?.[0] || null;
                    return {
                        ...app,
                        compatibility_score: app.match_score ?? analysis?.overall_score ?? 0,
                        missing_skills: analysis?.missing_skills || [],
                        compatibility_details: {
                            score: app.match_score ?? analysis?.overall_score ?? 0
                        },
                        contact_email: app.contact_email,
                        contact_phone: app.contact_phone,
                        resume_url: app.profiles?.resumes?.file_url || null
                    };
                });

                // Sort by match score descending by default
                mapped.sort((a: Applicant, b: Applicant) => (b.compatibility_score || 0) - (a.compatibility_score || 0));

                setApplicants(mapped);
                if (mapped.length > 0) setSelected(mapped[0]); // Auto-select highest match
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load candidates");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user, authLoading]);

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        try {
            await api.updateApplicationStatus(id, status);
            setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
            if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
        } finally {
            setUpdating(null);
        }
    };

    const score = selected?.compatibility_score || 0;

    // SVG Circular Progress Ring
    const CircleProgress = ({ percentage, size = 64, strokeWidth = 5 }: { percentage: number, size?: number, strokeWidth?: number }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        const isHigh = percentage >= 80;
        const isMed = percentage >= 60 && percentage < 80;

        return (
            <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    {/* Background track */}
                    <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
                    {/* Progress track */}
                    <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} className={`transition-all duration-1000 ease-out ${isHigh ? 'text-sky-500' : isMed ? 'text-indigo-400' : 'text-slate-300'}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`font-black tracking-tighter leading-none ${isHigh ? 'text-sky-600' : isMed ? 'text-indigo-600' : 'text-slate-500'}`} style={{ fontSize: size * 0.35 }}>{percentage}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 animate-[fade-in_0.6s_ease-out_forwards] pb-24">

            {/* Header & Controls Strip */}
            <div className="space-y-8 pt-2">
                <div className="space-y-4">
                    <h1 className="text-[2.5rem] font-bold tracking-tight text-slate-900 leading-tight">
                        Candidate Pipeline
                    </h1>
                    <p className="text-xl text-slate-500 font-medium tracking-wide">
                        Review your top matches. Let the <span className="font-bold text-sky-600 inline-flex items-center gap-1"><Sparkles className="w-4 h-4 ml-0.5" /> AI Engine</span> highlight who to interview next.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mr-2">Filters:</span>
                        <select className="h-10 px-4 rounded-xl bg-[#FAFAFC] border border-slate-100 text-[13px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-100 cursor-pointer appearance-none pr-8 relative">
                            <option>All Active Roles</option>
                        </select>
                        <select className="h-10 px-4 rounded-xl bg-[#FAFAFC] border border-slate-100 text-[13px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-100 cursor-pointer appearance-none pr-8 relative">
                            <option>Highest Match %</option>
                            <option>Newest First</option>
                        </select>
                        <select className="h-10 px-4 rounded-xl bg-[#FAFAFC] border border-slate-100 text-[13px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-100 cursor-pointer appearance-none pr-8 relative">
                            <option>All Stages</option>
                            <option>Applied Only</option>
                            <option>Shortlisted Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col h-[50vh] items-center justify-center gap-6">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                    <p className="text-slate-400 font-medium tracking-tight text-sm">Evaluating Pipeline Candidates...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-rose-50/50 rounded-[2rem] border border-rose-100 p-12 text-center">
                    <XCircle className="w-12 h-12 mb-4 text-rose-500 opacity-80" />
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Pipeline Error</h3>
                    <p className="text-slate-500 max-w-sm mb-6 font-medium">{error}</p>
                    <button onClick={() => window.location.reload()} className="h-12 px-6 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold shadow-sm hover:bg-rose-50 transition-colors">Retry Connection</button>
                </div>
            ) : applicants.length === 0 ? (
                <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-[450px] bg-white rounded-[2rem] border border-slate-100 p-12 text-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-50 rounded-full blur-[100px] pointer-events-none opacity-50" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#FAFAFC] shadow-inner border border-slate-100 rounded-3xl flex items-center justify-center mb-8">
                            <Navigation className="w-8 h-8 text-sky-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">The pipeline is clear.</h3>
                        <p className="text-slate-500 max-w-md font-medium text-lg leading-relaxed mb-8">
                            Your active requisitions are currently routing through the network. The AI engine will surface matches here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">

                    {/* Left Pane: Intelligence Candidate List */}
                    <div className="xl:col-span-3 space-y-4">
                        {applicants.map((app) => {
                            const isSelected = selected?.id === app.id;
                            const isHighMatch = (app.compatibility_score || 0) >= 80;
                            const isMedMatch = (app.compatibility_score || 0) >= 60 && (app.compatibility_score || 0) < 80;

                            return (
                                <div
                                    key={app.id}
                                    onClick={() => setSelected(app)}
                                    className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer overflow-hidden relative shadow-[0_15px_40px_-15px_rgba(0,0,0,0.01)] hover:-translate-y-0.5
                                        ${isSelected
                                            ? 'bg-white border-sky-200 shadow-[0_20px_50px_-15px_rgba(14,165,233,0.15)] ring-1 ring-sky-100'
                                            : isHighMatch ? 'bg-white border-sky-100/50 hover:border-sky-200 hover:shadow-[0_20px_50px_-15px_rgba(14,165,233,0.08)]' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]'}
                                    `}
                                >
                                    {/* High Match Glow Highlight */}
                                    {isHighMatch && <div className={`absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`} />}

                                    <div className="flex items-center gap-6 relative z-10 w-full">

                                        {/* Dynamic Match Score Ring */}
                                        <div className="shrink-0 relative">
                                            <CircleProgress percentage={app.compatibility_score || 0} size={72} strokeWidth={6} />
                                            {isHighMatch && (
                                                <div className="absolute -top-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                                                    <Sparkles className="w-4 h-4 text-sky-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Applicant Info */}
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <h3 className={`text-xl font-bold truncate tracking-tight transition-colors ${isSelected ? 'text-sky-700' : 'text-slate-900 group-hover:text-sky-600'}`}>
                                                    {app.profiles?.full_name || 'Anonymous Applicant'}
                                                </h3>
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${STATUS_BADGE[app.status]?.bg} ${STATUS_BADGE[app.status]?.text} ${STATUS_BADGE[app.status]?.border}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-500 truncate mb-3">{app.jobs?.title || 'Unknown Configuration'}</p>

                                            {/* AI Mini Insight */}
                                            <div className={`flex items-start gap-2 text-[12px] font-medium leading-snug p-3 rounded-xl border ${isHighMatch ? 'bg-sky-50/50 border-sky-100 text-sky-800' : 'bg-[#FAFAFC] border-slate-100 text-slate-600'}`}>
                                                <Brain className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isHighMatch ? 'text-sky-500' : 'text-slate-400'}`} />
                                                <span className="truncate italic">
                                                    {isHighMatch ? `"Exceptional overlap in trajectory. Strong candidate for interview."` :
                                                        isMedMatch ? `"Strong core skills, but may require onboarding for specific tools."` :
                                                            `"Significant gaps identified in required technical scope."`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions (Desktop Hover) */}
                                    <div className="shrink-0 flex flex-col gap-2 relative z-10 hidden sm:flex">
                                        {app.status !== 'shortlisted' && app.status !== 'hired' && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'shortlisted'); }}
                                                className="bg-slate-900 hover:bg-slate-800 text-white shadow-md text-[12px] font-bold tracking-wide h-10 px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                            >
                                                {updating === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Shortlist</>}
                                            </button>
                                        )}
                                        {app.status === 'shortlisted' && (
                                            <button className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[12px] font-bold tracking-wide h-10 px-5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-default">
                                                <CheckCircle2 className="w-4 h-4" /> Shortlisted
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Pane: Deep Profile Inspection */}
                    <div className="xl:col-span-2 xl:sticky xl:top-6">
                        {selected ? (
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col animate-[fade-in_0.3s_ease-out_forwards]">

                                {/* Header / Cover */}
                                <div className="h-24 bg-gradient-to-br from-sky-50 via-slate-50 to-white relative pb-10 border-b border-slate-50">
                                    <div className="absolute top-6 left-6 right-6 flex items-start gap-4">
                                        <div className="w-20 h-20 shrink-0 bg-white shadow-xl border border-slate-100 rounded-[1.25rem] flex items-center justify-center -mb-8 z-10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-sky-50 opacity-50" />
                                            <span className="text-3xl font-black bg-gradient-to-br from-sky-600 to-indigo-600 text-transparent bg-clip-text relative z-10">
                                                {(selected.profiles?.full_name || 'A')[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="pt-2">
                                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-1">{selected.profiles?.full_name}</h2>
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-[13px] font-semibold text-slate-600 flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">@</span> {selected.contact_email || 'No contact email provided'}</p>
                                                <p className="text-[13px] font-semibold text-slate-500 flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center shrink-0">#</span> {selected.contact_phone || 'No contact phone provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8 flex-1 overflow-y-auto">

                                    {/* Action Row */}
                                    <div className="flex gap-3">
                                        {selected.resume_url ? (
                                            <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#FAFAFC] hover:bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
                                                <FileText className="w-4 h-4" /> View Resume
                                            </a>
                                        ) : (
                                            <button disabled className="flex-1 bg-slate-50 border border-slate-100 text-slate-400 text-[13px] font-bold h-12 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                                <FileText className="w-4 h-4 opacity-50" /> No Resume
                                            </button>
                                        )}
                                        <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all">
                                            <MessageSquare className="w-4 h-4" /> Message
                                        </button>
                                    </div>

                                    {/* Detailed AI Match Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" /> Intelligence Breakdown</h3>
                                            <span className="text-xl font-black text-sky-600 tracking-tighter">{score}%</span>
                                        </div>

                                        <div className="bg-[#FAFAFC] border border-slate-100 rounded-[1.5rem] p-5 space-y-5 shadow-inner">
                                            {selected.compatibility_details && Object.keys(selected.compatibility_details).length > 0 ? (
                                                Object.entries(selected.compatibility_details).map(([k, v]) => (
                                                    <div key={k} className="space-y-2">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[13px] font-bold text-slate-700 capitalize">{k.replace(/_/g, ' ')}</span>
                                                            <span className="text-[11px] font-black text-slate-400">{v}/100</span>
                                                        </div>
                                                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
                                                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" style={{ width: `${v}%` }} />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[13px] font-bold text-slate-700">Overall Match Vector</span>
                                                        <span className="text-[11px] font-black text-slate-400">{score}/100</span>
                                                    </div>
                                                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
                                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-1000" style={{ width: `${score}%` }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actionable Gaps */}
                                    {selected.missing_skills?.length ? (
                                        <div>
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Actionable Gaps</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selected.missing_skills.map((s) => (
                                                    <span key={s} className="bg-rose-50/50 border border-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                        - {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                </div>

                                {/* Deep Pipeline Controls Footer */}
                                <div className="p-6 bg-[#FAFAFC] border-t border-slate-100 mt-auto">
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 text-center">Update Pipeline Status</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {STATUS_OPTIONS.map((s) => {
                                            const isCurrent = selected.status === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => updateStatus(selected.id, s)}
                                                    disabled={updating === selected.id}
                                                    className={`h-11 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${isCurrent
                                                        ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-sm'
                                                        : 'bg-white border text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-slate-200'
                                                        }`}
                                                >
                                                    {updating === selected.id && isCurrent ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#FAFAFC] rounded-[2rem] border border-slate-100 shadow-inner flex flex-col items-center justify-center min-h-[500px] text-center p-12 relative overflow-hidden">
                                <Eye className="w-12 h-12 mb-5 opacity-20 text-slate-900 relative z-10" />
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 relative z-10">Select a Profile</h3>
                                <p className="text-sm font-medium text-slate-500 max-w-xs relative z-10">
                                    Click on any candidate card to view their deep intelligence breakdown and resume details.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}
