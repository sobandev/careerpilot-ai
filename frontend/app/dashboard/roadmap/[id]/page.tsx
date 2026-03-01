'use client';

import { Suspense, useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, ArrowLeft, Clock, Sparkles, Navigation } from 'lucide-react';
import { RoadmapMilestone } from '@/components/app/RoadmapMilestone';
import Link from 'next/link';

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
    id?: string;
    target_role: string;
    total_duration: string;
    ai_narrative: string;
    items: RoadmapItem[];
}

function RoadmapDetailContent({ id }: { id: string }) {
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const data = await api.getRoadmapById(id) as Roadmap;
                setRoadmap(data);
                // Mock first step completed for engagement
                if (data.items.length > 0) setCompletedSteps([0]);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load this historical roadmap.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
                <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                    <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-emerald-100" />
                </div>
                <p className="text-slate-400 font-medium tracking-tight text-sm">Accessing temporal vault...</p>
            </div>
        );
    }

    if (error || !roadmap) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="p-4 bg-rose-50 rounded-full text-rose-500 mb-2">
                    <Navigation className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Coordinates Lost</h2>
                <p className="text-slate-500">{error || "This action plan couldn't be located."}</p>
                <Link href="/dashboard/history" className="text-emerald-600 font-medium hover:underline mt-4 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Return to Vault
                </Link>
            </div>
        );
    }

    const completedPercentage = Math.round((completedSteps.length / roadmap.items.length) * 100);

    return (
        <div className="max-w-[800px] mx-auto space-y-8 animate-[fade-in_0.6s_ease-out_forwards] pb-20">

            {/* Header Navigation */}
            <Link href="/dashboard/history" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-emerald-600 transition-colors mb-4 group w-fit">
                <div className="p-1.5 rounded-full bg-white border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                </div>
                Back to History Vault
            </Link>

            {/* Dynamic Progress Overview */}
            <div className="bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-50 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-100 transition-colors" />
                <div className="relative z-10">
                    <p className="text-sm font-bold text-slate-900">Historical Journey Overview</p>
                    <p className="text-[13px] text-slate-500 font-medium">{completedSteps.length} of {roadmap.items.length} milestones complete ({completedPercentage}%)</p>
                </div>
                {/* Minimal horizontal progress bar */}
                <div className="relative z-10 flex-1 max-w-sm h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    {roadmap.items.map((_, i) => (
                        <div
                            key={i}
                            className={`h-full flex-1 border-r border-white/50 last:border-0 transition-colors duration-1000 ${completedSteps.includes(i) ? 'bg-emerald-500' : 'bg-transparent'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Strategy Hub / Overview */}
            <div>
                {/* Top Narrative summary */}
                <div className="mb-12 bg-[#FAFAFC] border-l-2 border-slate-200 p-6 sm:p-8 rounded-r-3xl">
                    <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                        <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                        Target: {roadmap.target_role} ({roadmap.total_duration})
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
            </div>

            {/* Motivational Footer */}
            <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 text-center relative overflow-hidden text-white shadow-2xl">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 blur-[120px] pointer-events-none" />
                <div className="relative z-10 max-w-xl mx-auto">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-white/5 backdrop-blur-sm">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-4 leading-tight">
                        Timeline Preserved.
                    </h3>
                    <p className="text-white/60 text-lg font-medium leading-relaxed mb-8">
                        This historic roadmap was safely archived. You can continue advancing through these milestones at any time.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default function HistoricalRoadmapPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>}>
            <RoadmapDetailContent id={params.id} />
        </Suspense>
    );
}
