'use client';

import { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import { Map as MapIcon, Loader2, AlertCircle, RefreshCw, CheckCircle, Clock, Sparkles, Target, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RoadmapMilestone } from '@/components/app/RoadmapMilestone';

interface ResourceObject {
    title: string;
    type: 'video' | 'article' | 'course';
    cost: 'free' | 'paid';
    url: string;
}

interface RoadmapItem {
    skill: string;
    priority: number;
    timeline: string;
    resources: (string | ResourceObject)[];
    milestone: string;
}

interface Roadmap {
    target_role: string;
    total_duration: string;
    ai_narrative: string;
    items: RoadmapItem[];
}

function RoadmapContent() {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const searchParams = useSearchParams();
    const autoGenerate = searchParams.get('auto') === 'true';

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const data = await api.getRoadmap() as Roadmap;
                setRoadmap(data);
                if (data.items.length > 0) {
                    setCompletedSteps([0]); // Mock completed first step
                }
            } catch {
                // No roadmap yet, check if we should auto-generate
                if (autoGenerate) {
                    generate();
                }
            } finally {
                setFetching(false);
            }
        };
        fetchRoadmap();
    }, [autoGenerate]);

    const generate = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.generateRoadmap(targetRole || undefined) as Roadmap;
            setRoadmap(data);
            setCompletedSteps([]);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Generation failed. Please upload your resume first.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
                    <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-sky-100" />
                </div>
                <p className="text-slate-400 font-medium tracking-tight text-sm">Mapping career trajectories...</p>
            </div>
        );
    }

    const completedPercentage = roadmap ? Math.round((completedSteps.length / roadmap.items.length) * 100) : 0;

    return (
        <div className="max-w-[800px] mx-auto space-y-12 animate-[fade-in_0.6s_ease-out_forwards] pb-20">

            {/* Header / Destination Setter */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group">
                {/* Background Watermark */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-50 rounded-full blur-[100px] pointer-events-none group-hover:bg-sky-100/50 transition-colors duration-1000" />

                <div className="relative z-10">
                    <h1 className="text-[2.25rem] font-bold tracking-tight text-slate-900 mb-2 leading-tight">
                        Define your destination.
                    </h1>
                    <p className="text-lg text-slate-500 font-medium mb-8">
                        Where are we aiming for in the next 6–12 months?
                    </p>

                    <div className="flex flex-col gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g. Senior Platform Engineer at a remote global startup"
                                className="w-full h-16 pl-6 pr-4 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 bg-[#FAFAFC] border-transparent focus:bg-white focus:border-sky-300 focus:ring-4 focus:ring-sky-100/50 transition-all outline-none shadow-inner"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                            <Button
                                onClick={generate}
                                disabled={loading}
                                className="h-14 px-8 rounded-xl font-semibold shadow-md md:w-auto w-full group/btn relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-95"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : roadmap ? <RefreshCw className="w-5 h-5 mr-2" /> : <Navigation className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
                                {loading ? 'Synthesizing Path...' : roadmap ? 'Recalibrate Path' : 'Chart the Path'}
                            </Button>

                            {!roadmap && !loading && (
                                <p className="text-[13px] font-semibold text-sky-600 tracking-wide cursor-pointer hover:text-sky-700 transition-colors flex items-center gap-1.5 self-start sm:self-center">
                                    <Sparkles className="w-3.5 h-3.5" /> Faint AI Suggestion: Data Engineering
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 text-rose-600 text-[14px] bg-rose-50/50 p-4 rounded-xl border border-rose-100 font-medium">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                            {error.includes('resume') && (
                                <Button asChild variant="outline" size="sm" className="ml-auto bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg shrink-0">
                                    <Link href="/dashboard/resume">Upload Resume</Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Progress Overview (Only if roadmap exists) */}
            {roadmap && (
                <div className="bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-slate-900">Your Journey Overview</p>
                        <p className="text-[13px] text-slate-500 font-medium">{completedSteps.length} of {roadmap.items.length} milestones complete ({completedPercentage}%)</p>
                    </div>
                    {/* Minimal horizontal progress bar */}
                    <div className="flex-1 max-w-sm h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        {roadmap.items.map((_, i) => (
                            <div
                                key={i}
                                className={`h-full flex-1 border-r border-white/50 last:border-0 transition-colors duration-1000 ${completedSteps.includes(i) ? 'bg-sky-500' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!roadmap && (
                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.02)]">
                    <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-1 ring-slate-100 shadow-sm">
                        <MapIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-[1.75rem] font-bold text-slate-900 mb-3 tracking-tight">The map is blank.</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg leading-relaxed font-light">
                        Enter your target role above or leave it blank to let our AI determine your next logical career step based on your extracted resume graph.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAFAFC]"><CheckCircle className="w-4 h-4 text-emerald-500" /> Extracted Skills</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAFAFC]"><CheckCircle className="w-4 h-4 text-emerald-500" /> Gap Analysis</span>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAFAFC]"><Loader2 className="w-4 h-4 text-sky-400 animate-spin" /> Deep Navigation</span>
                    </div>
                </div>
            )}

            {/* Strategy Hub / Overview */}
            {roadmap && (
                <div className="animate-[fade-in_0.5s_ease-out_forwards]">
                    {/* Top Narrative summary */}
                    <div className="mb-12 bg-[#FAFAFC] border-l-2 border-slate-200 p-6 sm:p-8 rounded-r-3xl">
                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                            Estimated Focus Time: {roadmap.total_duration}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">AI Strategy Narrative</h3>
                        <p className="text-[16px] text-slate-600 leading-relaxed font-serif italic max-w-2xl">
                            "{roadmap.ai_narrative}"
                        </p>
                    </div>

                    {/* Timeline Section */}
                    <div className="pl-1 sm:pl-2">
                        <div className="space-y-0">
                            {roadmap.items.map((item, idx) => {
                                let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
                                if (completedSteps.includes(idx)) status = 'completed';
                                else if (idx === 0 || completedSteps.includes(idx - 1)) status = 'current';

                                const mockResources = item.resources.map(r => {
                                    if (typeof r === 'string') {
                                        return {
                                            title: r,
                                            type: r.toLowerCase().includes('video') || r.toLowerCase().includes('youtube') || r.toLowerCase().includes('course') ? 'video' as const : 'article' as const,
                                            cost: r.toLowerCase().includes('udemy') || r.toLowerCase().includes('coursera') ? 'paid' as const : 'free' as const,
                                            url: `https://www.google.com/search?q=${encodeURIComponent(r)}`
                                        };
                                    } else {
                                        return {
                                            title: r.title || 'Learning Resource',
                                            type: r.type === 'video' ? 'video' as const : 'article' as const,
                                            cost: r.cost === 'free' ? 'free' as const : 'paid' as const,
                                            url: r.url || '#'
                                        };
                                    }
                                });

                                const handleComplete = () => {
                                    if (!completedSteps.includes(idx)) {
                                        setCompletedSteps(prev => [...prev, idx]);
                                    }
                                };

                                return (
                                    <div key={idx}>
                                        <RoadmapMilestone
                                            title={`Master ${item.skill}`}
                                            description={item.milestone}
                                            status={status}
                                            weekRange={item.timeline}
                                            isLast={idx === roadmap.items.length - 1}
                                            aiHint={`Our intelligence graph shows ${item.skill} is a missing requirement in 80% of ${roadmap.target_role} postings in your area.`}
                                            resources={mockResources}
                                            onComplete={handleComplete}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Motivational Footer */}
                    <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 text-center relative overflow-hidden text-white shadow-2xl">
                        {/* Faint glowing orb in BG */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/20 blur-[120px] pointer-events-none" />

                        <div className="relative z-10 max-w-xl mx-auto">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white border border-white/5 backdrop-blur-sm">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                                The distance between now and your goal is consistent execution.
                            </h3>
                            <p className="text-white/60 text-lg font-medium leading-relaxed mb-8">
                                You've conquered {completedPercentage}% of this journey. The hardest part is starting, and you've already done that.
                            </p>

                            <Button variant="outline" className="bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl h-12 px-6 backdrop-blur-md">
                                Recalibrate Roadmap
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RoadmapPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
            </div>
        }>
            <RoadmapContent />
        </Suspense>
    );
}
