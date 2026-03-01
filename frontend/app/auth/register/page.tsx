'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        setError('');
        try {
            await register(email, password, fullName, role);
            router.push(role === 'employer' ? '/employer' : '/dashboard'); // Routing directly to save friction
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans flex flex-col lg:flex-row bg-white selection:bg-sky-500/20 selection:text-slate-900">
            {/* Left Panel: The Promise */}
            <div className="hidden lg:flex lg:w-5/12 bg-[#FAFAFC] relative flex-col justify-between p-16 border-r border-slate-100 overflow-hidden">
                {/* Subtle Background Node/Glow */}
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-sky-50 rounded-full mix-blend-multiply blur-[100px] opacity-70 pointer-events-none" />

                <Link href="/" className="relative z-10 flex items-center gap-1.5 group w-fit">
                    <span className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none">
                        CareerPilot
                    </span>
                    <div className="w-2 h-2 rounded-full bg-sky-500 mb-2" />
                </Link>

                <div className="relative z-10 max-w-sm">
                    <h2 className="text-[2.75rem] font-bold text-slate-900 tracking-tight leading-tight mb-8">
                        Your unfair edge <br /> starts here.
                    </h2>

                    {/* Abstract Data Visual */}
                    <div className="bg-white/60 p-6 rounded-3xl border border-white shadow-[0_20px_40px_-20px_rgba(14,165,233,0.1)] mb-12 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-sky-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 leading-none mb-1">AI Diagnostics Active</p>
                                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Calibration Phase</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1/3 h-1.5 bg-sky-500 rounded-full shadow-[0_0_10px_-2px_rgba(14,165,233,0.5)]" />
                                <div className="flex-1 h-1.5 bg-slate-200 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2/3 h-1.5 bg-slate-300 rounded-full" />
                                <div className="flex-1 h-1.5 bg-slate-200 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-500 text-lg leading-relaxed font-light">
                        Join 10,000+ top-tier South Asian professionals accelerating their careers with intelligent performance data.
                    </p>
                </div>

                <p className="relative z-10 text-slate-400 font-medium text-xs">© 2026 NextStep Careers Pvt Ltd</p>
            </div>

            {/* Right Panel: The Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-12">
                        <Link href="/" className="flex items-center gap-1.5 group">
                            <span className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none">
                                CareerPilot
                            </span>
                            <div className="w-2 h-2 rounded-full bg-sky-500 mb-2" />
                        </Link>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">
                            Welcome to the new standard
                        </p>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your free account.</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50/50 border border-rose-100/50 text-rose-600 text-sm px-5 py-4 rounded-xl flex items-start gap-3 animate-[fade-in_0.3s_ease-out]">
                                <span className="font-bold flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 shrink-0 text-xs">!</span>
                                <p className="leading-snug pt-0.5">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2.5">
                            <label className="text-sm font-medium text-slate-600">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Ahmed Rahman"
                                required
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all text-base"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-sm font-medium text-slate-600">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all text-base"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-sm font-medium text-slate-600">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all font-mono text-base"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="text-sm font-medium text-slate-600 block mb-3">How are you using CareerPilot?</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('jobseeker')}
                                    className={`py-4 rounded-xl text-sm font-semibold transition-all border ${role === 'jobseeker' ? 'bg-sky-50 text-sky-700 border-sky-200 ring-2 ring-sky-500/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                >
                                    I&apos;m a Professional
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('employer')}
                                    className={`py-4 rounded-xl text-sm font-semibold transition-all border ${role === 'employer' ? 'bg-sky-50 text-sky-700 border-sky-200 ring-2 ring-sky-500/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                >
                                    I&apos;m Hiring
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group bg-slate-900 text-white font-medium px-8 py-4 rounded-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-slate-800 hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-px active:shadow-none flex items-center justify-center gap-3 text-[15px] mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                    <span>Creating Profile...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account & Analyze Resume</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-[13px] text-slate-500 font-medium">
                        By signing up, you agree to our <a href="#" className="underline hover:text-slate-900">Terms</a> and <a href="#" className="underline hover:text-slate-900">Privacy Policy</a>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center text-[13px] text-slate-500">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-slate-900 font-semibold border-b border-slate-200 hover:border-slate-900 pb-0.5 transition-colors">
                            Log in securely
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
