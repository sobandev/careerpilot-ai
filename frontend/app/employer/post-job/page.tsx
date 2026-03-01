'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { PlusCircle, Loader2, CheckCircle2, AlertCircle, Sparkles, Navigation, Check } from 'lucide-react';
import Link from 'next/link';

const INDUSTRIES = ['technology', 'finance', 'marketing', 'healthcare', 'design', 'education', 'sales'];
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'remote', 'internship'];
const EDU_LEVELS = ['high-school', 'bachelor', 'master', 'phd', 'any'];

export default function PostJobPage() {
    const [form, setForm] = useState({
        title: '', description: '', requirements: '', industry: 'technology',
        location: 'Karachi, Pakistan', job_type: 'full-time', salary_min: '',
        salary_max: '', experience_min: '0', experience_max: '3',
        education_level: 'bachelor', skills: '',
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.postJob({
                ...form,
                salary_min: form.salary_min ? Number(form.salary_min) : undefined,
                salary_max: form.salary_max ? Number(form.salary_max) : undefined,
                experience_min: Number(form.experience_min),
                experience_max: Number(form.experience_max),
                skills_required: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
            });
            setSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to post job. Make sure your company profile is set up.');
        } finally {
            setSaving(false);
        }
    };

    if (success) return (
        <div className="mx-auto max-w-[800px] mt-12 animate-[fade-in_0.5s_ease-out_forwards]">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-white p-12 text-center shadow-[0_20px_50px_-15px_rgba(16,185,129,0.08)]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] pointer-events-none opacity-50" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 border border-emerald-100 shadow-inner">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </div>

                    <h2 className="mb-4 text-[2.5rem] font-bold tracking-tight text-slate-900 leading-none">Requisition Deployed.</h2>
                    <p className="mb-10 text-lg text-slate-500 max-w-md font-medium">
                        Your role is active. CareerPilot&apos;s engine is currently scanning the network for the top 5% talent matches.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            className="bg-[#FAFAFC] border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 h-14 px-8 rounded-xl font-bold transition-all w-full sm:w-auto shadow-sm"
                            onClick={() => { setSuccess(false); setForm({ title: '', description: '', requirements: '', industry: 'technology', location: 'Karachi, Pakistan', job_type: 'full-time', salary_min: '', salary_max: '', experience_min: '0', experience_max: '3', education_level: 'bachelor', skills: '' }); }}
                        >
                            Post Another Role
                        </button>
                        <Link href="/employer/applicants" className="inline-flex items-center justify-center bg-slate-900 text-white h-14 px-8 rounded-xl font-bold shadow-md hover:bg-slate-800 transition-all w-full sm:w-auto">
                            View Candidate Pipeline
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mx-auto max-w-[900px] space-y-10 animate-[fade-in_0.6s_ease-out_forwards] pb-24">

            {/* Header & Progress Indicator */}
            <div className="space-y-6 pt-2">
                <div className="space-y-3">
                    <h1 className="text-[2.5rem] font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        Create Requisition
                    </h1>
                    <p className="text-xl text-slate-500 font-medium tracking-wide">
                        Define the parameters. Let our <span className="font-bold text-sky-600 inline-flex items-center gap-1"><Sparkles className="w-4 h-4 ml-0.5" /> AI pipeline</span> source your top 5% matches.
                    </p>
                </div>

                {/* Visual Step Tracker (Static representation of progress) */}
                <div className="flex items-center gap-2 mt-8">
                    <div className="flex-1 h-1.5 rounded-full bg-sky-500" />
                    <div className="flex-1 h-1.5 rounded-full bg-sky-500/50" />
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200" />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-[15px] text-rose-700 font-bold shadow-sm">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
                    </div>
                )}

                {/* Section: Core Profile */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FAFAFC] border border-slate-100 flex items-center justify-center">
                            <Navigation className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Core Profile</h2>
                            <p className="text-sm font-medium text-slate-500">The primary identifiers for the network.</p>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="space-y-2.5">
                            <label htmlFor="title" className="flex items-center justify-between text-[13px] font-bold uppercase tracking-widest text-slate-500">
                                Target Title <span className="text-sky-500 ml-1 font-black">*</span>
                            </label>
                            <input id="title" value={form.title} onChange={(e) => set('title', e.target.value)} required
                                placeholder="e.g. Senior Frontend Engineer, AI Platform"
                                className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-900 placeholder:text-slate-400" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2.5">
                                <label htmlFor="industry" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Industry Segment</label>
                                <select id="industry" value={form.industry} onChange={(e) => set('industry', e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-700 capitalize cursor-pointer appearance-none">
                                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <label htmlFor="job_type" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Employment Type</label>
                                <select id="job_type" value={form.job_type} onChange={(e) => set('job_type', e.target.value)}
                                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-700 capitalize cursor-pointer appearance-none">
                                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label htmlFor="location" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Location Strategy</label>
                            <input id="location" value={form.location} onChange={(e) => set('location', e.target.value)}
                                placeholder="e.g. Remote, Global, or Karachi, PK"
                                className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-900 placeholder:text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Section: Matching Parameters */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-sky-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Matching Parameters</h2>
                            <p className="text-sm font-medium text-slate-500">Inputs strictly used by the AI engine to pipeline talent.</p>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="space-y-2.5 flex flex-col">
                            <label htmlFor="skills" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">
                                Core Technical Stack <span className="text-sky-500 ml-1 font-black">*</span>
                            </label>
                            <input id="skills" value={form.skills} onChange={(e) => set('skills', e.target.value)} required
                                placeholder="e.g. React, Node.js, Next.js, System Design (Comma separated)"
                                className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-bold text-slate-900 placeholder:text-slate-300" />

                            {/* AI Suggestion Area (Mock feature) */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest mr-2 flex items-center">Smart Auto-Complete:</span>
                                {['TypeScript', 'GraphQL', 'AWS', 'Python', 'Docker'].map((mockSkill) => (
                                    <button type="button" key={mockSkill} onClick={() => set('skills', form.skills ? `${form.skills}, ${mockSkill}` : mockSkill)} className="flex items-center gap-1 bg-[#FAFAFC] hover:bg-sky-50 text-slate-500 hover:text-sky-700 border border-slate-100 px-3 py-1.5 text-[11px] rounded-lg font-bold tracking-wide transition-colors">
                                        <PlusCircle className="w-3 h-3" /> {mockSkill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label htmlFor="description" className="flex items-center justify-between text-[13px] font-bold uppercase tracking-widest text-slate-500">
                                Requisition Brief <span className="text-sky-500 ml-1 font-black">*</span>
                            </label>
                            <textarea id="description" value={form.description} onChange={(e) => set('description', e.target.value)} required rows={5}
                                placeholder="Detail the mission. The AI extracts context from this block to match against candidate trajectories..."
                                className="w-full p-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-700 placeholder:text-slate-400 resize-y" />
                        </div>

                        <div className="space-y-2.5">
                            <label htmlFor="requirements" className="flex items-center justify-between text-[13px] font-bold uppercase tracking-widest text-slate-500">
                                Responsibilities & Qualifications
                            </label>
                            <textarea id="requirements" value={form.requirements} onChange={(e) => set('requirements', e.target.value)} rows={4}
                                placeholder="List out specific expectations and nice-to-haves."
                                className="w-full p-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-700 placeholder:text-slate-400 resize-y" />
                        </div>
                    </div>
                </div>

                {/* Section: Compensation & Thresholds */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FAFAFC] border border-slate-100 flex items-center justify-center">
                            <Check className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Thresholds & Comp</h2>
                            <p className="text-sm font-medium text-slate-500">Establishes baseline filters for applicant integrity.</p>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2.5">
                                <label htmlFor="experience_min" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Min Experience Base</label>
                                <div className="relative">
                                    <input id="experience_min" type="number" min="0" max="20" value={form.experience_min} onChange={(e) => set('experience_min', e.target.value)}
                                        className="w-full h-14 pl-5 pr-12 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-900" />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">Yrs</span>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label htmlFor="experience_max" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Max Experience Ceiling</label>
                                <div className="relative">
                                    <input id="experience_max" type="number" min="0" max="30" value={form.experience_max} onChange={(e) => set('experience_max', e.target.value)}
                                        className="w-full h-14 pl-5 pr-12 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-900" />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">Yrs</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2.5">
                                <label htmlFor="salary_min" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Min Salary Band</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">$</span>
                                    <input id="salary_min" type="number" value={form.salary_min} onChange={(e) => set('salary_min', e.target.value)} placeholder="0"
                                        className="w-full h-14 pl-9 pr-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-300 transition-all outline-none text-[15px] shadow-sm font-bold text-slate-900" />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <label htmlFor="salary_max" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Max Salary Band</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none">$</span>
                                    <input id="salary_max" type="number" value={form.salary_max} onChange={(e) => set('salary_max', e.target.value)} placeholder="0"
                                        className="w-full h-14 pl-9 pr-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-300 transition-all outline-none text-[15px] shadow-sm font-bold text-slate-900" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label htmlFor="education_level" className="text-[13px] font-bold uppercase tracking-widest text-slate-500">Minimum Education Tier</label>
                            <select id="education_level" value={form.education_level} onChange={(e) => set('education_level', e.target.value)}
                                className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-sky-100/50 focus:border-sky-300 transition-all outline-none text-[15px] shadow-sm font-medium text-slate-700 capitalize cursor-pointer appearance-none">
                                {EDU_LEVELS.map((l) => <option key={l} value={l}>{l.replace('-', ' ')}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-8 pb-12">
                    <button type="submit" disabled={saving || !form.title || !form.description || !form.skills}
                        className="group w-full flex items-center justify-center gap-3 h-[4.5rem] rounded-2xl bg-slate-900 text-white font-bold tracking-wide shadow-[0_15px_30px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-slate-900 disabled:hover:shadow-none text-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]" />
                        {saving ? (
                            <><Loader2 className="w-6 h-6 animate-spin text-sky-400" /> Initializing Pipeline...</>
                        ) : (
                            <><Sparkles className="w-6 h-6 text-sky-400 group-hover:rotate-12 transition-transform" /> Deploy Requisition to Network</>
                        )}
                    </button>
                    <p className="text-center text-sm font-medium text-slate-400 mt-4">
                        Upon deployment, our AI matching engine evaluates candidates identically against your specified trajectory.
                    </p>
                </div>
            </form>
        </div>
    );
}
