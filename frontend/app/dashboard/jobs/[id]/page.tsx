'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
    Briefcase, MapPin, Clock, DollarSign, ArrowLeft, Send,
    CheckCircle, AlertCircle, Loader2, Target, Sparkles,
    CircleCheck, Heart, Share2, Info, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string;
    industry: string;
    location: string;
    job_type: string;
    salary_min?: number;
    salary_max?: number;
    experience_min: number;
    experience_max: number;
    education_level: string;
    skills_required: string[];
    created_at: string;
    companies?: { name: string; logo_url?: string; description?: string; website?: string };
}

interface Score {
    total_score: number;
    skill_match: number;
    experience_match: number;
    keyword_similarity: number;
    education_match: number;
    industry_alignment: number;
    missing_skills: string[];
    ai_explanation: string;
    improvement_tips: string[];
}

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [score, setScore] = useState<Score | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [contactEmail, setContactEmail] = useState(user?.email || '');
    const [contactPhone, setContactPhone] = useState('');
    const [showCover, setShowCover] = useState(false);
    const [error, setError] = useState('');
    const [aiFeedback, setAiFeedback] = useState<string[] | null>(null);
    const [buildingPlan, setBuildingPlan] = useState(false);

    useEffect(() => {
        if (user?.email && !contactEmail) setContactEmail(user.email);
        // Add more pre-filling logic if you store phone numbers later.
    }, [user]);

    useEffect(() => {
        const load = async () => {
            try {
                const [jobData, scoreData] = await Promise.allSettled([
                    api.getJob(id),
                    api.getJobScore(id),
                ]);
                if (jobData.status === 'fulfilled') setJob(jobData.value as Job);
                if (scoreData.status === 'fulfilled') setScore(scoreData.value as Score);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleApply = async () => {
        setApplying(true);
        setError('');
        try {
            const res = await api.applyToJob(id, coverLetter || undefined, contactEmail || undefined, contactPhone || undefined);
            if (res && (res as any).ai_feedback) {
                setAiFeedback((res as any).ai_feedback);
            }
            setApplied(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Application failed');
        } finally {
            setApplying(false);
        }
    };

    const handleBuildPlan = async () => {
        setBuildingPlan(true);
        try {
            await api.generateRoadmap(undefined, id);
            router.push('/dashboard/roadmap');
        } catch (err: unknown) {
            console.error(err);
            setBuildingPlan(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
            <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-sky-100" />
            </div>
            <p className="text-slate-400 font-medium tracking-tight text-sm">Decoding parameters...</p>
        </div>
    );

    if (!job) return (
        <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Role Not Found</h2>
            <p className="text-slate-500 mb-6 text-sm">This position may have been closed.</p>
            <Link href="/dashboard/jobs" className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                Return to Intelligence Feed &rarr;
            </Link>
        </div>
    );

    // Helpers
    const matchScore = score?.total_score || 0;
    const ringRadius = 40;
    const ringCircumference = 2 * Math.PI * ringRadius;
    const dashOffset = ringCircumference - (matchScore / 100) * ringCircumference;
    const isHighMatch = matchScore >= 75;

    const missingSkillsSet = new Set(score?.missing_skills || []);
    const matchedSkills = job.skills_required.filter(s => !missingSkillsSet.has(s));
    const missingSkills = job.skills_required.filter(s => missingSkillsSet.has(s));

    return (
        <div className="max-w-[1100px] mx-auto space-y-8 animate-[fade-in_0.5s_ease-out_forwards] pb-24">
            {/* Nav Back */}
            <Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Feed
            </Link>

            {/* Header Spotlight Box */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 sm:p-12 pl-8 sm:pl-12 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-10">
                {/* Left: Job Meta */}
                <div className="flex-1 flex gap-6 sm:gap-8 items-start relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAFAFC] border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                        <span className="text-slate-600 font-bold text-2xl sm:text-3xl">
                            {(job.companies?.name || 'C')[0].toUpperCase()}
                        </span>
                    </div>
                    <div className="space-y-2.5">
                        <h1 className="text-2xl sm:text-[2rem] font-bold text-slate-900 leading-tight tracking-tight">
                            {job.title}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium tracking-tight">
                            {job.companies?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-[13px] font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1.5 capitalize"><Briefcase className="w-3.5 h-3.5" />{job.job_type}</span>
                            {job.salary_min && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        PKR {(job.salary_min / 1000).toFixed(0)}k–{((job.salary_max || job.salary_min * 1.5) / 1000).toFixed(0)}k
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Match Ring Spotlight */}
                {score && (
                    <div className="shrink-0 flex items-center gap-6 relative z-10 bg-[#FAFAFC]/80 backdrop-blur-sm px-6 py-4 rounded-3xl border border-slate-100 hidden md:flex">
                        <div className="space-y-1 text-right">
                            <h3 className="text-[13px] font-bold tracking-widest uppercase text-slate-400">Match</h3>
                            <p className={`text-[15px] font-bold ${isHighMatch ? 'text-sky-600' : 'text-slate-600'}`}>
                                {isHighMatch ? 'Strong Alignment' : 'Bridgeable Gap'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">AI Profile Assessment</p>
                        </div>
                        <div className="relative flex items-center justify-center w-[100px] h-[100px] group cursor-default">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r={ringRadius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                                <circle
                                    cx="50" cy="50" r={ringRadius} stroke="currentColor" strokeWidth="6" fill="transparent"
                                    strokeDasharray={ringCircumference} strokeDashoffset={dashOffset}
                                    className={`${isHighMatch ? 'text-sky-500' : 'text-amber-400'} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-[2rem] font-bold text-slate-900 mb-0.5">{matchScore}</span>
                            </div>

                            {/* Hover Tooltip */}
                            <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl">
                                Top {100 - matchScore}% of candidates
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column - Reading View (70%) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* The Opportunity */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">The Opportunity</h2>
                        <div className="prose prose-slate max-w-none text-[15px] leading-[1.7] text-slate-600 pl-4 border-l-[3px] border-slate-100 pb-2">
                            <p className="whitespace-pre-line">{job.description}</p>
                        </div>
                    </section>

                    {/* Core Capabilities */}
                    <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-sky-500" /> Core Capabilities
                            </h2>
                            {score && (
                                <span className="text-xs font-semibold text-slate-400">
                                    {matchedSkills.length} of {job.skills_required.length} matched
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {matchedSkills.map(s => (
                                <span key={s} className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-100/50 rounded-xl font-medium text-[13px] flex items-center gap-1.5">
                                    <CircleCheck className="w-3.5 h-3.5" /> {s}
                                </span>
                            ))}
                            {missingSkills.map(s => (
                                <span key={s} className="px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-200 border-dashed rounded-xl font-medium text-[13px]">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Qualifications */}
                    {job.requirements && (
                        <section className="space-y-6 pt-4 border-t border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">Experience Profile</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-[#FAFAFC] p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Min. Exp.</p>
                                    <p className="font-bold text-slate-900">{job.experience_min} Years</p>
                                </div>
                                <div className="bg-[#FAFAFC] p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Max. Exp.</p>
                                    <p className="font-bold text-slate-900">{job.experience_max} Years</p>
                                </div>
                                <div className="bg-[#FAFAFC] p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Education Base</p>
                                    <p className="font-bold text-slate-900 capitalize">{job.education_level}</p>
                                </div>
                            </div>
                            <div className="prose prose-slate max-w-none text-[15px] leading-[1.7] text-slate-600 pl-4 border-l-[3px] border-slate-100">
                                <p className="whitespace-pre-line">{job.requirements}</p>
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column - AI Co-Pilot (30%) */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-20 space-y-6">

                        {/* Co-Pilot Card */}
                        {score && (
                            <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-[2rem] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center border border-sky-100">
                                        <Target className="w-4 h-4 text-sky-500" />
                                    </div>
                                    <h3 className="font-bold text-slate-900">Alignment Analysis</h3>
                                </div>

                                <p className="text-[14px] text-slate-600 font-medium leading-[1.6] mb-6">
                                    "{score.ai_explanation}"
                                </p>

                                <div className="space-y-4 mb-6 pt-6 border-t border-slate-100">
                                    {/* Breakdown bars */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                                            <span>Skill Vectors</span>
                                            <span>{score.skill_match}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${score.skill_match}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                                            <span>Experience Parity</span>
                                            <span>{score.experience_match}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${score.experience_match}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Tips */}
                                {score.improvement_tips?.length > 0 && (
                                    <div className="bg-[#FAFAFC] rounded-2xl p-4 border border-slate-100 mb-6 group cursor-default">
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center justify-between">
                                            Resume Nudge <Info className="w-3.5 h-3.5 opacity-50" />
                                        </p>
                                        <p className="text-[13px] text-slate-600 font-medium leading-[1.6] mb-4">
                                            {score.improvement_tips[0]}
                                        </p>
                                        <button
                                            onClick={handleBuildPlan}
                                            disabled={buildingPlan}
                                            className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-[13px] font-bold shadow-sm hover:border-slate-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {buildingPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" /> : <><Sparkles className="w-3.5 h-3.5 text-sky-500" /> Build Action Plan to Close Gaps</>}
                                        </button>
                                    </div>
                                )}

                                {/* Application Zone */}
                                {applied ? (
                                    <div className="space-y-4 animate-[fade-in_0.5s_ease-out_forwards]">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-emerald-500">
                                                <CheckCircle className="w-6 h-6" />
                                            </div>
                                            <p className="font-bold text-slate-900 text-sm mb-1">Application Sent</p>
                                            <p className="text-xs text-slate-500 mb-4">Your passport is with the recruiter.</p>
                                            <Link href="/dashboard/applications" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
                                                Track Progress &rarr;
                                            </Link>
                                        </div>

                                        {aiFeedback && aiFeedback.length > 0 && (
                                            <div className="bg-gradient-to-tr from-sky-50/50 to-indigo-50/30 border border-sky-100/50 rounded-2xl p-6 animate-[slide-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '200ms' }}>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg shrink-0">
                                                        <Sparkles className="w-4 h-4" />
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 text-[14px]">AI Hiring Coach Insights</h4>
                                                </div>
                                                <ul className="space-y-3">
                                                    {aiFeedback.map((tip, i) => (
                                                        <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0 shadow-sm" />
                                                            <span>{tip.replace(/^-\s*/, '')}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    onClick={handleBuildPlan}
                                                    disabled={buildingPlan}
                                                    className="w-full mt-5 h-12 bg-white text-slate-900 border border-sky-100 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow hover:border-sky-200 transition-all font-semibold"
                                                >
                                                    {buildingPlan ? <Loader2 className="w-4 h-4 animate-spin text-sky-500" /> : <><Target className="w-4 h-4 text-sky-500" /> Build Action Plan</>}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {error && (
                                            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-xl text-center border border-red-100">
                                                {error}
                                            </div>
                                        )}
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showCover ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="space-y-3 pb-4">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="email"
                                                        value={contactEmail}
                                                        onChange={e => setContactEmail(e.target.value)}
                                                        placeholder="Email Address (Required)"
                                                        required
                                                        className="w-full p-3 text-[13px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                                                    />
                                                    <input
                                                        type="tel"
                                                        value={contactPhone}
                                                        onChange={e => setContactPhone(e.target.value)}
                                                        placeholder="Phone Number (Required)"
                                                        required
                                                        className="w-full p-3 text-[13px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                                                    />
                                                </div>
                                                <textarea
                                                    value={coverLetter}
                                                    onChange={e => setCoverLetter(e.target.value)}
                                                    placeholder="Add a brief note to the employer (Optional)"
                                                    className="w-full min-h-[100px] p-3 text-[13px] rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none transition-all placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleApply}
                                            disabled={applying}
                                            className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-[15px] shadow-[0_10px_20px_-10px_rgba(15,23,42,0.6)] hover:shadow-[0_15px_25px_-10px_rgba(15,23,42,0.5)] hover:-translate-y-0.5 active:translate-y-px transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                                            {!applying && <ChevronRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                                        </button>

                                        {!showCover && (
                                            <div className="text-center pt-2">
                                                <button onClick={() => setShowCover(true)} className="text-[13px] font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                                                    + Review Contact Info & Add Note
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex justify-center gap-4 pt-4 border-t border-slate-100 mt-4">
                                            <button className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-not-allowed" title="Save Job">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            <button className="w-10 h-10 rounded-full border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-not-allowed" title="Share Job">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
