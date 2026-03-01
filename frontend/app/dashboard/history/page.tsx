'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { History, FileText, Map as MapIcon, Calendar, ArrowRight, ExternalLink, Activity, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ResumeHistory {
    id: string;
    created_at: string;
    file_url: string;
}

interface AnalysisHistory {
    id: string;
    resume_id: string;
    created_at: string;
    overall_score: number;
    industry_alignment: string;
}

interface RoadmapHistory {
    id: string;
    created_at: string;
    target_role: string;
    total_duration: string;
    ai_narrative: string;
}

export default function HistoryPage() {
    const [loading, setLoading] = useState(true);
    const [resumes, setResumes] = useState<ResumeHistory[]>([]);
    const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
    const [roadmaps, setRoadmaps] = useState<RoadmapHistory[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [resumeData, roadmapData] = await Promise.all([
                    api.getResumeHistory() as Promise<{ resumes: ResumeHistory[], analyses: AnalysisHistory[] }>,
                    api.getRoadmapHistory() as Promise<{ history: RoadmapHistory[] }>
                ]);

                setResumes(resumeData.resumes);
                setAnalyses(resumeData.analyses);
                setRoadmaps(roadmapData.history);
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getAnalysisForResume = (resumeId: string) => {
        return analyses.find(a => a.resume_id === resumeId);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4" />
                <p>Retrieving your historical artifacts...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto space-y-12 animate-[fade-in_0.6s_ease-out_forwards]">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                            <History className="w-6 h-6 text-slate-700" />
                        </div>
                        History Vault
                    </h1>
                    <p className="text-slate-500 mt-2">Track your intelligence footprints and generated action plans over time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Resumes Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Intelligence Briefs</h2>
                    </div>

                    {resumes.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                            <p className="text-slate-500 text-sm">No resumes uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {resumes.map((resume) => {
                                const analysis = getAnalysisForResume(resume.id);
                                return (
                                    <Link href={`/dashboard/resume/${resume.id}`} key={resume.id} className="block bg-white border text-left border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(resume.created_at), 'MMM d, yyyy • h:mm a')}
                                            </div>
                                            {resume.file_url && (
                                                <a href={resume.file_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors" onClick={(e) => e.stopPropagation()}>
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>

                                        {analysis ? (
                                            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">
                                                <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                                    <span className="font-bold text-slate-800">{analysis.overall_score}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                                                        <Activity className="w-3.5 h-3.5 text-indigo-500" /> Profile Score
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{analysis.industry_alignment}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">Processing analysis...</p>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Roadmaps Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <MapIcon className="w-5 h-5 text-emerald-500" />
                        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Action Plans</h2>
                    </div>

                    {roadmaps.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                            <p className="text-slate-500 text-sm">No action plans generated yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {roadmaps.map((roadmap) => (
                                <Link href={`/dashboard/roadmap/${roadmap.id}`} key={roadmap.id} className="block bg-white border text-left border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-100/50 transition-colors" />

                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-3">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(roadmap.created_at), 'MMM d, yyyy • h:mm a')}
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">{roadmap.target_role}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 w-max px-2.5 py-1 rounded-md mb-4">
                                                <Trophy className="w-3.5 h-3.5" />
                                                {roadmap.total_duration}
                                            </div>
                                            <p className="text-sm text-slate-600 line-clamp-2 italic font-serif">"{roadmap.ai_narrative}"</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
