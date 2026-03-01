'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import {
    Search, Briefcase, MapPin, Sparkles, AlertCircle, ArrowRight,
    Filter, ChevronDown, Loader2, Building2
} from 'lucide-react';
import Link from 'next/link';
import { JobCard } from '@/components/app/JobCard';
import { Button } from '@/components/ui/button';

interface Job {
    id: string;
    title: string;
    industry: string;
    location: string;
    job_type: string;
    salary_min?: number;
    salary_max?: number;
    match_score?: number;
    created_at: string;
    skills_required: string[];
    companies?: { name: string; logo_url?: string };
}

const INDUSTRIES = ['All Industries', 'Technology', 'Finance', 'Marketing', 'Healthcare', 'Design', 'Education', 'Sales'];
const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [feed, setFeed] = useState<{ highly_relevant: Job[]; based_on_skills: Job[]; trending: Job[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [industry, setIndustry] = useState('All Industries');
    const [jobType, setJobType] = useState('All Types');
    const [view, setView] = useState<'feed' | 'browse'>('feed');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadFeed = async () => {
        try {
            const data = await api.getFeed() as unknown as { highly_relevant: Job[]; based_on_skills: Job[]; trending: Job[] };
            setFeed(data);
        } catch { /* no resume, fall to browse */ }
    };

    const loadJobs = async (q?: string) => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (q) params.q = q;
            if (industry !== 'All Industries') params.industry = industry;
            if (jobType !== 'All Types') params.job_type = jobType;
            const data = await api.getJobs(params);
            setJobs(data.jobs as unknown as Job[]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeed();
        loadJobs();
    }, []);

    useEffect(() => {
        // Don't trigger on initial mount if search is empty, covered by loadJobs() above
        if (industry !== 'All Industries' || jobType !== 'All Types') {
            if (view === 'feed') setView('browse');
            loadJobs(search);
        }
    }, [industry, jobType]);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (view === 'feed' && val.trim() !== '') setView('browse');
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => loadJobs(val), 400);
    };

    const mapToJobCardProps = (job: Job) => ({
        id: job.id,
        title: job.title,
        company: job.companies?.name || 'Company',
        location: job.location,
        salary: job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k–$${((job.salary_max || job.salary_min * 1.5) / 1000).toFixed(0)}k` : undefined,
        matchScore: job.match_score || 0,
        skills: job.skills_required || [],
        isPremium: job.match_score && job.match_score > 90 ? true : false
    });

    return (
        <div className="max-w-[1000px] mx-auto space-y-12 animate-[fade-in_0.6s_ease-out_forwards] pb-20">
            {/* Header Section */}
            <div className="space-y-4">
                <h1 className="text-[2.5rem] font-bold tracking-tight text-slate-900 leading-tight">
                    Intelligence Feed
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl font-medium tracking-wide">
                    Opportunities algorithmically mapped to your verified skill graph and current trajectory.
                </p>
            </div>

            {/* Mega Search & Filter Suite */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group/search z-20">
                {/* Faint BG glow on hover */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-50 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover/search:opacity-100 transition-opacity duration-1000" />

                <div className="relative z-10 flex flex-col gap-6">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within/search:text-sky-500 transition-colors" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search high-velocity roles, companies, or specific technologies..."
                            className="w-full h-[4.5rem] pl-16 pr-6 rounded-2xl text-[1.1rem] text-slate-900 placeholder:text-slate-400 bg-[#FAFAFC] border-transparent focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-100/50 transition-all outline-none shadow-inner"
                        />
                    </div>

                    {/* Filters & Toggle Suite */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2 border-t border-slate-100">
                        {/* Toggle */}
                        {feed && (
                            <div className="flex bg-[#FAFAFC] p-1.5 rounded-xl border border-slate-100 w-fit shrink-0 shadow-inner">
                                <button
                                    onClick={() => setView('feed')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${view === 'feed' ? 'bg-white text-sky-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                                >
                                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Curated</span>
                                </button>
                                <button
                                    onClick={() => setView('browse')}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${view === 'browse' ? 'bg-white text-sky-700 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                                >
                                    <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> All Opportunities</span>
                                </button>
                            </div>
                        )}

                        {/* Dropdown Filters */}
                        <div className="flex flex-wrap md:flex-nowrap gap-3 flex-1 md:justify-end">
                            <div className="relative w-full md:w-auto">
                                <select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full md:w-[180px] h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-slate-700 text-[14px] font-semibold hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 appearance-none cursor-pointer outline-none transition-all shadow-sm"
                                >
                                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <div className="relative w-full md:w-auto">
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    className="w-full md:w-[160px] h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-slate-700 text-[14px] font-semibold hover:bg-slate-50 hover:border-slate-300 focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 appearance-none cursor-pointer outline-none transition-all shadow-sm"
                                >
                                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Content Area */}
            <div className="min-h-[500px] relative z-10">
                {/* AI Curated View */}
                {view === 'feed' && feed && (
                    <div className="space-y-16">
                        {[
                            {
                                key: 'highly_relevant',
                                title: 'High-Conviction Matches',
                                desc: 'Roles perfectly aligned with your current verified skill graph.',
                                icon: <Sparkles className="w-6 h-6 text-sky-500" />,
                                jobs: feed.highly_relevant
                            },
                            {
                                key: 'based_on_skills',
                                title: 'Strategic Growth Trajectories',
                                desc: 'Stretch roles that track slightly above your current band. Excellent roadmap targets.',
                                icon: <MapPin className="w-6 h-6 text-emerald-500" />,
                                jobs: feed.based_on_skills
                            },
                            {
                                key: 'trending',
                                title: 'Network Velocity',
                                desc: 'High-impact roles popular among engineers matching your profile.',
                                icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
                                jobs: feed.trending
                            },
                        ].filter((s) => s.jobs.length > 0).map((section, secIdx) => (
                            <div key={section.key} className="animate-[fade-in_0.5s_ease-out_forwards]" style={{ animationDelay: `${secIdx * 150}ms` }}>
                                <div className="flex items-center gap-4 mb-6 px-2">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                                        {section.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-900">{section.title}</h2>
                                        <p className="text-slate-500 text-sm font-medium mt-0.5">{section.desc}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-5">
                                    {section.jobs.map((job) => (
                                        <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="block focus:outline-none focus:ring-4 focus:ring-sky-100 rounded-[1.5rem]">
                                            <JobCard {...mapToJobCardProps(job)} />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Empty Curated Feed State */}
                        {Object.values(feed).every((arr) => arr.length === 0) && (
                            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-sm relative overflow-hidden">
                                <div className="mx-auto w-20 h-20 bg-[#FAFAFC] rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                    <AlertCircle className="w-8 h-8 text-sky-400" />
                                </div>
                                <h3 className="text-[1.5rem] font-bold text-slate-900 mb-3 tracking-tight">Intelligence Graph Incomplete</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">We need your resume to construct your career node graph and match you with precision opportunities.</p>
                                <Button asChild className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 font-semibold shadow-md inline-flex items-center gap-2">
                                    <Link href="/dashboard/resume">Upload Resume <ArrowRight className="w-4 h-4" /></Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )
                }

                {/* Browse All View */}
                {
                    (view === 'browse' || !feed) && (
                        <div className="animate-[fade-in_0.5s_ease-out_forwards]">
                            {loading ? (
                                <div className="flex flex-col h-[40vh] items-center justify-center gap-6">
                                    <div className="relative">
                                        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                                        <div className="absolute inset-0 border-2 border-sky-100 rounded-full" />
                                    </div>
                                    <p className="text-slate-400 font-medium tracking-wide text-sm">Scanning market opportunities...</p>
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="rounded-[2.5rem] border border-slate-100 bg-[#FAFAFC] p-16 text-center shadow-inner flex flex-col items-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <Search className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-[1.5rem] font-bold text-slate-900 mb-3 tracking-tight">No roles aligned with these parameters</h3>
                                    <p className="text-slate-500 font-medium max-w-sm">Adjust your geographical or industry filters to broaden the opportunity horizon.</p>
                                    <Button variant="outline" className="mt-8 rounded-xl h-12 px-6 font-semibold border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm" onClick={() => { setSearch(''); setIndustry('All Industries'); setJobType('All Types'); }}>
                                        Reset Intelligence Filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5">
                                    {jobs.map((job, idx) => (
                                        <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="block focus:outline-none focus:ring-4 focus:ring-sky-100 rounded-[1.5rem] animate-[fade-in_0.5s_ease-out_forwards]" style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}>
                                            <JobCard {...mapToJobCardProps(job)} />
                                        </Link>
                                    ))}
                                </div>
                            )
                            }
                        </div >
                    )}
            </div >
        </div >
    );
}
