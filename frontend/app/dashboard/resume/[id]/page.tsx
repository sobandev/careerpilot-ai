'use client';

import { Suspense, useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, ArrowLeft, AlertCircle, Check, Lightbulb, Sparkles, Navigation } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

function ResumeDetailContent({ id }: { id: string }) {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const data = await api.getResumeAnalysisById(id) as Record<string, unknown>;
                setResult(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load this historical intelligence brief.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-indigo-100" />
                </div>
                <p className="text-slate-400 font-medium tracking-tight text-sm">Accessing temporal vault...</p>
            </div>
        );
    }

    if (error || !result || !result.analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="p-4 bg-rose-50 rounded-full text-rose-500 mb-2">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Briefing Classified</h2>
                <p className="text-slate-500">{error || "This intelligence brief couldn't be located."}</p>
                <Link href="/dashboard/history" className="text-indigo-600 font-medium hover:underline mt-4 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Vault
                </Link>
            </div>
        );
    }

    const resumeNode = (result.resume || {}) as Record<string, unknown>;
    const analysis = result.analysis as Record<string, unknown>;

    const overallScore = analysis?.overall_score as number || 0;
    const completeness = analysis?.profile_completeness as number || 0;

    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (overallScore / 100) * circumference;

    return (
        <div className="max-w-[1000px] mx-auto space-y-8 animate-[fade-in_0.6s_ease-out_forwards] pb-20">

            {/* Header Navigation */}
            <Link href="/dashboard/history" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors mb-2 group w-fit">
                <div className="p-1.5 rounded-full bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                </div>
                Back to History Vault
            </Link>

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Historical Intelligence</h1>
                {resumeNode.file_url ? (
                    <a
                        href={resumeNode.file_url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors bg-indigo-50 hover:bg-indigo-100 border border-transparent px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
                    >
                        View Original Baseline File
                    </a>
                ) : (
                    <div className="text-sm font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2">
                        Original File Unavailable
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Profile Strength Hero Card (Left Bento) - span 5 */}
                <div className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-100/50 transition-colors duration-700" />

                    <div className="relative flex items-center justify-center w-32 h-32 mx-auto sm:mx-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                            <circle
                                cx="64" cy="64" r={radius}
                                stroke="url(#gradient)" strokeWidth="6" fill="transparent"
                                strokeDasharray={circumference} strokeDashoffset={dashoffset}
                                className="transition-all duration-1000 ease-out" strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">{overallScore}<span className="text-lg text-slate-400 font-bold ml-0.5">%</span></span>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <h2 className="text-[1.75rem] font-bold text-slate-900 tracking-tight leading-tight">
                            At this point in time, your profile was {overallScore}% strong.
                        </h2>
                        <p className="text-[15px] font-light text-slate-500 leading-relaxed">
                            {analysis.ai_summary as string}
                        </p>
                    </div>
                </div>

                {/* Right Stack Building Blocks */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* 2. Core Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)]">
                        {[
                            { label: 'Skills Extracted', value: (resumeNode.skills as unknown[])?.length || 0 },
                            { label: 'Experience Tier', value: `${resumeNode.experience_years as number}y` },
                            { label: 'ATS Compliance', value: `${analysis.keyword_optimization as number}%` },
                            { label: 'Profile Completion', value: `${completeness}%` },
                        ].map((m, i) => (
                            <div key={i} className="flex flex-col items-center justify-center text-center px-2 py-2 border-r border-slate-100 last:border-0">
                                <p className="text-[2rem] font-black text-slate-900 tracking-tighter mb-1">{m.value}</p>
                                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase leading-snug">{m.label.replace(' ', '\n')}</p>
                            </div>
                        ))}
                    </div>

                    {/* 3. Verified Skill Graph */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 flex-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)] flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Historical Skill Graph</h3>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {(resumeNode.skills as string[])?.slice(0, 5).map((skill: string) => (
                                <Badge key={skill} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold px-4 py-2 rounded-xl text-[13px] border border-indigo-100/50">
                                    {skill}
                                </Badge>
                            ))}
                            {(resumeNode.skills as string[])?.slice(5).map((skill: string) => (
                                <Badge key={skill} variant="secondary" className="bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium px-4 py-2 rounded-xl text-[13px] border border-slate-100">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* 4. Market Strengths & Growth Opportunities (Bottom Split Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/40 rounded-3xl border border-emerald-100/60 p-8 transition-transform hover:-translate-y-0.5">
                    <h3 className="flex items-center gap-3 text-emerald-950 font-bold text-lg mb-6">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200/50 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        Recognized Strengths
                    </h3>
                    <ul className="space-y-4">
                        {((analysis.strengths as string[]) || []).map((s, i) => (
                            <li key={i} className="flex items-start gap-4 text-[15px] text-slate-700 leading-relaxed font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-sky-50/40 rounded-3xl border border-sky-100/60 p-8 transition-transform hover:-translate-y-0.5">
                    <h3 className="flex items-center gap-3 text-sky-950 font-bold text-lg mb-6">
                        <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200/50 flex items-center justify-center shrink-0">
                            <Lightbulb className="w-4 h-4 text-sky-600" />
                        </div>
                        Identified Opportunities
                    </h3>
                    <ul className="space-y-4">
                        {((analysis.weaknesses as string[]) || []).map((w, i) => (
                            <li key={i} className="flex items-start gap-4 text-[15px] text-slate-700 leading-relaxed font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                                {w}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* High-Value Skill Targets */}
            {(analysis.missing_skills as string[])?.length > 0 && (
                <div className="flex flex-col items-center justify-center gap-6 py-8 border-b border-t border-slate-100 border-dashed">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">High-value targets from this era:</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {(analysis.missing_skills as string[]).map((skill: string) => (
                            <span key={skill} className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-sm font-semibold text-indigo-700 shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default function HistoricalResumePage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>}>
            <ResumeDetailContent id={params.id} />
        </Suspense>
    );
}
