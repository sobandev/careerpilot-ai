'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            const userStr = localStorage.getItem('cp_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                router.push(user.role === 'employer' ? '/employer' : '/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFC] font-sans flex flex-col justify-center items-center relative overflow-hidden selection:bg-sky-500/20 selection:text-slate-900 px-6 sm:px-12 py-12">

            {/* Extremely subtle background AI mesh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-sky-50 rounded-full blur-[120px] opacity-60 pointer-events-none mix-blend-multiply" />

            {/* Header/Logo */}
            <div className="absolute top-8 sm:top-12 left-0 right-0 flex justify-center z-20">
                <Link href="/" className="flex items-center gap-1.5 group">
                    <span className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none">
                        CareerPilot
                    </span>
                    <div className="w-2 h-2 rounded-full bg-sky-500 mb-2" />
                </Link>
            </div>

            {/* Central Auth Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3 block">
                        Welcome back to clarity
                    </p>
                    <h1 className="text-3xl sm:text-[2rem] font-bold text-slate-900 tracking-tight leading-tight">
                        Log in to your workspace.
                    </h1>
                </div>

                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-50/50 border border-rose-100/50 text-rose-600 text-sm px-5 py-4 rounded-xl flex items-start gap-3 animate-[fade-in_0.3s_ease-out]">
                                <span className="font-bold flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 shrink-0 text-xs">!</span>
                                <p className="leading-snug pt-0.5">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2.5">
                            <label className="text-sm font-medium text-slate-600 block flex justify-between">
                                Email Address
                            </label>
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
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-600">Password</label>
                                <button type="button" className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all font-mono text-base"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group bg-slate-900 text-white font-medium px-8 py-4 rounded-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-slate-800 hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 active:translate-y-px active:shadow-none flex items-center justify-center gap-3 text-[15px] mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                                    <span>Authenticating</span>
                                </>
                            ) : (
                                <>
                                    <span>Access Workspace</span>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[13px] text-slate-500 font-medium">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-slate-900 font-semibold border-b border-slate-200 hover:border-slate-900 pb-0.5 transition-colors">
                            Request Access
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
