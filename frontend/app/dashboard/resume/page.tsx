'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { ResumeUploadCreative } from '@/components/app/ResumeUploadCreative';
import { AlertCircle, Map as MapIcon, RotateCcw, Sparkles, Check, Lightbulb, Navigation } from 'lucide-react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ResumePage() {
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [error, setError] = useState('');

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError('');
        try {
            const res = await api.uploadResume(file);
            setResult(res);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const analysis = result?.analysis as Record<string, unknown> | undefined;

    // Derived values for the new design
    const overallScore = analysis?.overall_score as number || 0;
    const completeness = analysis?.profile_completeness as number || 0;

    // SVG Progress Ring logic
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (overallScore / 100) * circumference;

    return (
        <div className="max-w-[1000px] mx-auto space-y-8 animate-[fade-in_0.6s_ease-out_forwards]">

            {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-5 text-sm text-rose-600 font-medium shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <AlertCircle className="h-4 w-4" />
                    </div>
                    {error}
                </div>
            )}

            {!result && (
                <div className="py-4 md:py-12">
                    <ResumeUploadCreative onUpload={handleUpload} isUploading={uploading} />
                </div>
            )}

            {result && analysis && (
                <>
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Intelligence Briefing</h1>
                        <button
                            onClick={() => setResult(null)}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors bg-white border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Upload Source
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* 1. Profile Strength Hero Card (Left Bento) - span 5 */}
                        <div className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-center gap-8 relative overflow-hidden group">
                            {/* Faint background blob */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-sky-100/50 transition-colors duration-700" />

                            {/* Progress Ring */}
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
                                            <stop offset="0%" stopColor="#38bdf8" />
                                            <stop offset="100%" stopColor="#0ea5e9" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black text-slate-900 tracking-tighter">{overallScore}<span className="text-lg text-slate-400 font-bold ml-0.5">%</span></span>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <h2 className="text-[1.75rem] font-bold text-slate-900 tracking-tight leading-tight">
                                    Your profile is already {overallScore}% strong.
                                </h2>
                                <p className="text-[15px] font-light text-slate-500 leading-relaxed">
                                    {analysis.ai_summary as string}
                                </p>
                            </div>

                            <button className="text-[13px] font-bold text-sky-500 hover:text-sky-600 w-fit border-b border-sky-200 hover:border-sky-500 pb-0.5 transition-colors">
                                Why this score?
                            </button>
                        </div>

                        {/* Right Stack Building Blocks */}
                        <div className="lg:col-span-7 flex flex-col gap-6">

                            {/* 2. Core Metrics Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)]">
                                {[
                                    { label: 'Skills Extracted', value: (result.skills as unknown[])?.length || 0 },
                                    { label: 'Experience Tier', value: `${result.experience_years as number}y` },
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
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Verified Skill Graph</h3>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {/* Make the first few skills prominent, the rest muted */}
                                    {(result.skills as string[])?.slice(0, 5).map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold px-4 py-2 rounded-xl text-[13px] border border-sky-100/50">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {(result.skills as string[])?.slice(5).map((skill: string) => (
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
                        {/* Strengths Card */}
                        <div className="bg-emerald-50/40 rounded-3xl border border-emerald-100/60 p-8 transition-transform hover:-translate-y-0.5">
                            <h3 className="flex items-center gap-3 text-emerald-950 font-bold text-lg mb-6">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200/50 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-emerald-600" />
                                </div>
                                Market Strengths
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

                        {/* Opportunities Card */}
                        <div className="bg-sky-50/40 rounded-3xl border border-sky-100/60 p-8 transition-transform hover:-translate-y-0.5">
                            <h3 className="flex items-center gap-3 text-sky-950 font-bold text-lg mb-6">
                                <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200/50 flex items-center justify-center shrink-0">
                                    <Lightbulb className="w-4 h-4 text-sky-600" />
                                </div>
                                Growth Opportunities
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
                                <span className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">High-value targets:</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2.5">
                                {(analysis.missing_skills as string[]).map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 bg-white border border-indigo-100 rounded-lg text-sm font-semibold text-indigo-700 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <Link
                                href="/dashboard/roadmap?auto=true"
                                className="mt-4 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow hover:-translate-y-0.5 transition-all text-[15px]"
                            >
                                <Navigation className="w-4 h-4" /> Build Personalized Action Plan
                            </Link>
                        </div>
                    )}



                </>
            )}
        </div>
    );
}
