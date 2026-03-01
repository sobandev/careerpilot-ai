'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Brain, FileText, CheckCircle, ArrowRight, Upload, Loader2, Sparkles, Target, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingWizard() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Step 1: Upload
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Step 2: Extracted Data
    const [skills, setSkills] = useState<string[]>([]);
    const [customSkill, setCustomSkill] = useState('');
    const [experienceText, setExperienceText] = useState('');

    // Step 3: Goals
    const [targetRole, setTargetRole] = useState('');
    const [finishing, setFinishing] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setUploading(true);

        try {
            // Upload & Parse logic
            const formData = new FormData();
            formData.append('file', selected);

            const res = await fetch('http://127.0.0.1:8000/api/resume/parse', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
            const data = await res.json();

            if (data.analysis?.skills) {
                setSkills(data.analysis.skills);
            }
            if (data.analysis?.experience_summary) {
                setExperienceText(data.analysis.experience_summary);
            }

            // Artificial delay for premium feel
            await new Promise(r => setTimeout(r, 1500));
            setStep(2);
        } catch (error) {
            console.error("Upload failed", error);
            // Even if it fails, let them proceed manually? Or show error.
            alert("Failed to parse resume. You can enter details manually.");
            setStep(2);
        } finally {
            setUploading(false);
        }
    };

    const addCustomSkill = () => {
        if (customSkill.trim() && !skills.includes(customSkill.trim())) {
            setSkills([...skills, customSkill.trim()]);
            setCustomSkill('');
        }
    };

    const handleFinish = async () => {
        setFinishing(true);
        try {
            // Save preferences (In a real app, send to settings/profile API)
            // We sleep to simulate saving
            await new Promise(r => setTimeout(r, 1000));
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setFinishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none" />

            <div className="w-full max-w-3xl relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 shadow-[0_0_30px_-5px_var(--color-indigo-500)]">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Initialize Your Profile</h1>
                    <p className="text-slate-400">Let the Intelligence Engine calibrate your career trajectory.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`relative z-10 flex flex-col items-center transition-all duration-500 ${step >= s ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-500 ${step >= s ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border-white/10 text-slate-500'}`}>
                                {s < step ? <CheckCircle className="w-5 h-5 text-white" /> : s}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Wizard Cards */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8 text-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
                                <p className="text-slate-400 text-sm">PDF or DOCX. We'll extract your skills, experience, and value metrics instantly.</p>
                            </div>

                            <label className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${uploading ? 'border-primary-500/50 bg-primary-500/5' : 'border-white/10 hover:border-indigo-400/50 hover:bg-white/5'}`}>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />

                                {uploading ? (
                                    <div className="flex flex-col items-center text-indigo-400 gap-4">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md animate-pulse opacity-50" />
                                            <Brain className="w-12 h-12 relative z-10 animate-bounce" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg mb-1">Processing via Groq...</p>
                                            <p className="text-sm opacity-70">Extracting semantic entities and mapping skill vectors</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 text-slate-400 group">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:text-indigo-400">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="font-semibold text-slate-300 mb-1">Click to upload or drag & drop</p>
                                        <p className="text-xs">Supports PDF, DOCX (Max 10MB)</p>
                                    </div>
                                )}
                            </label>

                            <div className="flex justify-center">
                                <button onClick={() => setStep(2)} className="text-sm font-medium text-slate-500 hover:text-white transition-colors">
                                    Skip this step for now
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                                    <Brain className="w-6 h-6 text-indigo-400" /> Verify Extracted Data
                                </h2>
                                <p className="text-slate-400 text-sm">Review the skills and insights identified by our intelligence engine.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-3">Core Competencies Identified</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {skills.map((skill, idx) => (
                                            <div key={idx} className="group relative pr-8 pl-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm font-medium flex items-center">
                                                {skill}
                                                <button
                                                    onClick={() => setSkills(skills.filter(s => s !== skill))}
                                                    className="absolute right-2 text-indigo-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customSkill}
                                            onChange={(e) => setCustomSkill(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                                            placeholder="Add missing skill..."
                                            className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                        <button onClick={addCustomSkill} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-colors font-medium">Add</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Experience Summary</label>
                                    <textarea
                                        value={experienceText}
                                        onChange={(e) => setExperienceText(e.target.value)}
                                        rows={3}
                                        placeholder="Briefly describe your professional experience..."
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <button onClick={() => setStep(1)} className="text-slate-400 font-medium hover:text-white transition-colors px-4 py-2">Back</button>
                                <button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                                    Confirm Details <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                                    <Target className="w-6 h-6 text-amber-400" /> Set Your Objective
                                </h2>
                                <p className="text-slate-400 text-sm">Tell us what you're aiming for so we can curate perfectly matched opportunities.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2">Target Title / Role</label>
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-4 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
                                    <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-amber-200 font-medium mb-1">Activating Market Intelligence</p>
                                        <p className="text-sm text-amber-200/70 leading-relaxed">By defining your target role, our engine will instantly analyze job markets, identify your exact skill gaps, and build a tailored learning roadmap to guarantee your success.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <button onClick={() => setStep(2)} className="text-slate-400 font-medium hover:text-white transition-colors px-4 py-2">Back</button>
                                <button
                                    onClick={handleFinish}
                                    disabled={finishing || !targetRole.trim()}
                                    className="bg-white text-slate-950 hover:bg-slate-200 font-bold px-8 py-3.5 rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                                >
                                    {finishing ? (
                                        <><Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> Deploying Node...</>
                                    ) : (
                                        <>Access Intelligence Feed <ChevronRight className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
