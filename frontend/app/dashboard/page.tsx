'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { JobCard } from '@/components/app/JobCard';
import { TrendingUp, Target, Loader2, Sparkles, ArrowRight, Zap, ArrowUpRight, Search } from 'lucide-react';
import api from '@/lib/api';


export default function DashboardHome() {
    const { user } = useAuth();
    const [analysis, setAnalysis] = useState<Record<string, unknown> | null>(null);
    const [feed, setFeed] = useState<{ highly_relevant: any[]; based_on_skills: any[]; trending: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [analRes, feedRes] = await Promise.allSettled([
                    api.getResumeAnalysis(),
                    api.getFeed()
                ]);

                if (analRes.status === 'fulfilled' && analRes.value) {
                    setAnalysis(analRes.value as Record<string, unknown>);
                }
                if (feedRes.status === 'fulfilled' && feedRes.value) {
                    setFeed(feedRes.value as any);
                }
            } catch {
                // Ignore empty resume error
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const highestMatchRaw = feed?.highly_relevant?.[0];
    const highestMatch = highestMatchRaw ? {
        id: highestMatchRaw.id,
        title: highestMatchRaw.title,
        company: highestMatchRaw.companies?.name || 'Company',
        location: highestMatchRaw.location,
        salary: highestMatchRaw.salary_min && highestMatchRaw.salary_max ? `$${highestMatchRaw.salary_min / 1000}k - $${highestMatchRaw.salary_max / 1000}k` : 'Competitive',
        matchScore: highestMatchRaw.match_score || 0,
        skills: (highestMatchRaw.skills_required as string[]) || [],
        isPremium: false
    } : null;

    const trendingJobsRaw = [...(feed?.highly_relevant?.slice(1) || []), ...(feed?.based_on_skills || []), ...(feed?.trending || [])].slice(0, 3);
    const trendingJobs = trendingJobsRaw.map(j => ({
        id: j.id,
        title: j.title,
        company: j.companies?.name || 'Company',
        location: j.location,
        salary: j.salary_min && j.salary_max ? `$${j.salary_min / 1000}k - $${j.salary_max / 1000}k` : 'Competitive',
        matchScore: j.match_score || 0,
        skills: (j.skills_required as string[]) || [],
    }));

    const resumeScore = (analysis?.analysis as Record<string, unknown>)?.overall_score as number | undefined;

    // Simplified Profile Completeness Logic
    const completeness = resumeScore ? 100 : 10;
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (completeness / 100) * circumference;

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                    <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-sky-100" />
                </div>
                <p className="text-slate-400 font-medium tracking-tight text-sm">Calibrating your interface...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-[fade-in_0.6s_ease-out_forwards]">

            {/* 1. Top Greeting & Profile Completeness */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-slate-100/60">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-tight text-slate-900 leading-[1.1]">
                        Good morning, {user?.full_name?.split(' ')[0] || 'there'}.
                    </h1>
                    <p className="text-lg text-slate-500 font-light tracking-tight">
                        Your next level is closer than you think.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-3 pr-5 rounded-full border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-all cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                                cx="32" cy="32" r={radius}
                                stroke="currentColor" strokeWidth="3" fill="transparent"
                                className="text-slate-100"
                            />
                            <circle
                                cx="32" cy="32" r={radius}
                                stroke="currentColor" strokeWidth="3" fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashoffset}
                                className="text-sky-500 transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-[15px] font-bold text-slate-900 leading-none">{completeness}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 tracking-tight leading-snug mb-0.5">
                            Profile Completeness
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 group-hover:text-slate-600 transition-colors">
                            {resumeScore ? 'Fully optimized for matchmaking' : 'Upload resume to unlock roles'}
                            {!resumeScore && <ArrowRight className="w-3 h-3 text-sky-500 group-hover:translate-x-0.5 transition-transform" />}
                        </p>
                    </div>
                </div >
            </header >

            {/* Empty State / CTA */}
            {
                !resumeScore ? (
                    <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.05)]">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-[400px] h-[400px] rounded-full bg-sky-50/50 blur-[80px] pointer-events-none group-hover:bg-sky-100/40 transition-colors duration-700" />

                        <div className="relative z-10 max-w-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 mb-6 shadow-sm">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Intelligence Engine Offline</h3>
                            <p className="text-slate-500 mb-8 text-[15px] leading-relaxed font-light">
                                CareerPilot requires your latest resume to establish a baseline graph. Upload your history to instantly curate your high-match job feed and generate an executable roadmap.
                            </p>
                            <Link href="/dashboard/resume" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-px">
                                Provide Baseline Data <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">

                        {/* 2. The Spotlight Card (Highest Match Hero) */}
                        {highestMatch ? (
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 px-2">
                                        <span className="font-bold text-[10px] uppercase tracking-widest text-slate-400">The Intelligence Engine</span>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.05)] group">
                                    {/* Faint AI Node Watermark Background */}
                                    <div className="absolute -right-20 -bottom-20 opacity-[0.03] text-sky-900 group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
                                        <Target className="w-96 h-96" />
                                    </div>

                                    <div className="relative z-10 max-w-3xl">
                                        {/* Match Badge */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50/80 border border-sky-100/50 rounded-full mb-6">
                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-[pulse_2s_ease-in-out_infinite]" />
                                            <span className="text-xs font-bold tracking-wide text-sky-700">{highestMatch.matchScore}% Precise Match</span>
                                        </div>

                                        <div className="mb-6">
                                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 leading-tight">
                                                {highestMatch.title}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-medium text-slate-500">
                                                <span className="text-slate-900">{highestMatch.company}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span>{highestMatch.location}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span className="text-emerald-600 font-semibold">{highestMatch.salary}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {highestMatch.skills.slice(0, 5).map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Alignment Note (Editorial Voice) */}
                                        <div className="bg-[#FAFAFC] border-l-2 border-slate-200 p-4 rounded-r-xl mb-8">
                                            <p className="font-serif italic text-slate-600/90 leading-relaxed text-[15px]">
                                                "Your extracted skill graph places you in the top tier of candidates for this specific role. Applying now accelerates your global trajectory."
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Link href={`/dashboard/jobs/${highestMatch.id}`} className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3.5 rounded-xl font-medium text-sm transition-all hover:shadow-[0_10px_20px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-px inline-flex items-center gap-2">
                                                Apply via CareerPilot <ArrowUpRight className="w-4 h-4 text-slate-400" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : (
                            <div className="flex items-center justify-center h-48 rounded-[2rem] border border-slate-100 border-dashed bg-slate-50/50">
                                <p className="text-slate-500 font-medium flex items-center gap-2">
                                    <Search className="w-5 h-5 text-slate-400" /> No highly matched jobs available yet. Try adjusting your profile or check back later!
                                </p>
                            </div>
                        )}


                        {/* 4. Trending Feed */}
                        {trendingJobs.length > 0 && (
                            <section className="space-y-6 pt-2 border-t border-slate-100 border-dashed">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-lg font-bold tracking-tight text-slate-900">Trending in your stack</h2>
                                    <Link href="/dashboard/jobs" className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 group/link">
                                        Explore All Opportunities
                                        <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {trendingJobs.map((job, idx) => (
                                        <Link
                                            key={job.id}
                                            href={`/dashboard/jobs/${job.id}`}
                                            className="block animate-[fade-in_0.5s_ease-out_forwards] opacity-0"
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <div className="transition-all duration-300 hover:-translate-y-1 h-full">
                                                <JobCard {...job} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )
            }
        </div >
    );
}
