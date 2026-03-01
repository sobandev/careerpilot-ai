'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500/20 selection:text-slate-900 overflow-x-hidden">
      <Navbar />

      {/* 1. THE HOOK (Typography-First Hero & Asymmetric Glass Nodes) */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 px-6 lg:px-12 max-w-[90rem] mx-auto min-h-[90vh] flex items-center">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-sky-50 rounded-full blur-[120px] opacity-70 pointer-events-none transform translate-x-1/4 -translate-y-1/4 mix-blend-multiply" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10 w-full">
          {/* Left: Pure Typography */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-12">
            <div className="inline-flex items-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">The New Standard for Career Growth</span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.02] text-slate-900 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              Stop guessing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Start rising.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-500 leading-relaxed font-light mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              The job hunt is broken. Let our AI uncover your true market value, map your skills to global standards, and curate roles where you possess an unfair edge.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Link href="/auth/register" className="group w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-medium transition-all hover:bg-slate-800 hover:shadow-[0_10px_40px_-10px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg">
                Upload Resume to Begin
              </Link>
              <a href="#demo" className="text-slate-500 hover:text-slate-900 font-medium transition-colors flex items-center gap-2 group">
                Watch the demo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <p className="mt-6 text-[13px] text-slate-400 font-medium animate-in fade-in duration-1000 delay-700">
              Analysis takes 2.4s. Always free for talent.
            </p>
          </div>

          {/* Right: Delicate AI Abstract Path Graphic */}
          <div className="lg:col-span-5 relative hidden lg:block animate-in fade-in zoom-in-[0.98] duration-1000 delay-500">
            <div className="relative w-full aspect-[4/5]">
              {/* Abstract connection lines */}
              <svg className="absolute inset-0 w-full h-full text-slate-200 stroke-[1px]" fill="none">
                <path d="M 100,400 C 150,400 200,300 300,300 C 400,300 450,150 500,100" />
                <path d="M 200,450 C 250,450 300,350 400,350 C 500,350 550,200 600,150" strokeDasharray="4 4" className="text-sky-200" />
              </svg>

              {/* Node 1: Origin */}
              <div className="absolute bottom-[20%] left-[10%] bg-white p-4 rounded-full border border-slate-100 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold tracking-wider text-slate-400">JUNIOR</div>
              </div>

              {/* Node 2: Catalyst */}
              <div className="absolute top-[40%] left-[40%] bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white shadow-[0_30px_60px_-20px_rgba(14,165,233,0.15)] transform translate-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest">Skill Injection</p>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-2">+ Cloud Architecture</p>
              </div>

              {/* Node 3: Target */}
              <div className="absolute top-[10%] right-[10%] bg-slate-900 p-6 rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(15,23,42,0.4)] transform hover:scale-105 transition-transform duration-500 cursor-default">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">Target Reached</span>
                </div>
                <p className="text-xl font-medium text-white">Senior Backend</p>
                <p className="text-sm text-slate-400 font-light mt-1">Remote • $120k</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TRUTH (Minimal Pain Points) */}
      <section className="py-24 border-y border-slate-100 bg-white">
        <div className="max-w-[80rem] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-slate-900 leading-snug tracking-tight">
              Applying to 100 jobs and hearing nothing back isn&apos;t a reflection of your talent. <span className="font-semibold text-slate-400">It&apos;s an information gap.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
            {/* Cell 1 */}
            <div className="bg-white p-10 lg:p-16 hover:bg-[#FAFAFC] transition-colors">
              <div className="w-6 h-6 border border-slate-900 rotate-45 flex items-center justify-center mb-8" />
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">The Keyword Black Hole</h3>
              <p className="text-slate-500 leading-relaxed font-light text-lg">You&apos;re throwing PDFs at filters that don&apos;t understand context, impact, or human trajectory. The system is designed to reject.</p>
            </div>
            {/* Cell 2 */}
            <div className="bg-white p-10 lg:p-16 hover:bg-[#FAFAFC] transition-colors">
              <div className="w-6 h-6 border border-slate-300 rounded mb-8" />
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">The Skill Blindspot</h3>
              <p className="text-slate-500 leading-relaxed font-light text-lg">You might be one modern framework away from a 2x salary bump, but traditional job boards will never tell you what that missing piece is.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE AI REVEAL (Clinical UI Mockup) */}
      <section id="demo" className="py-32 bg-[#FAFAFC]">
        <div className="max-w-[70rem] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-4">The Engine</h2>
          <h3 className="text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight mb-20">Meet your unfair advantage.</h3>

          {/* Ultra-clean MacOS Window */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] overflow-hidden text-left mx-auto relative group">

            {/* Animated Scanline Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.03] to-transparent h-1/4 w-full -translate-y-full group-hover:animate-[scan_3s_ease-in-out_infinite] pointer-events-none z-20" />

            {/* Top Bar */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide">Analysis Engine • Resume_V4.pdf</p>
              <div className="w-10"></div> {/* Spacer for balance */}
            </div>

            {/* Content */}
            <div className="p-8 sm:p-14">
              <div className="space-y-6">
                {/* Success Block */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)]">
                  <CheckCircle className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 tracking-tight">High Impact Detected</p>
                    <p className="text-slate-500 font-light mt-1">Strong proficiency in full-stack architecture and team leadership over 3 years.</p>
                  </div>
                </div>

                {/* Warning Block */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#FAFAFC] border border-slate-100/50">
                  <div className="w-5 h-5 flex items-center justify-center font-bold text-slate-400 shrink-0 mt-0.5">!</div>
                  <div>
                    <p className="font-semibold text-slate-600 tracking-tight">Growth Area Identified</p>
                    <p className="text-slate-400 font-light mt-1">Missing modern DevOps deployment experience required by 78% of target remote roles.</p>
                  </div>
                </div>

                {/* Magic Action Block */}
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-sky-50 border border-sky-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out" />
                  <div className="w-5 h-5 rounded-full bg-sky-500 shrink-0 mt-0.5 relative z-10" />
                  <div className="relative z-10">
                    <p className="font-semibold text-sky-900 tracking-tight">Generating Precision Learning Path...</p>
                    <p className="text-sky-700/70 font-medium text-sm mt-1">Acquiring this skill will unlock 45+ new Senior Remote opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNFAIR EDGE (Refined Bento Grid) */}
      <section className="py-32 bg-[#FAFAFC]">
        <div className="max-w-[80rem] mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <h2 className="text-4xl lg:text-5xl font-medium text-slate-900 tracking-tight">Designed for the Top 1%.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Upper Left */}
            <div className="md:col-span-5 bg-white rounded-[2rem] p-10 lg:p-14 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-500">
              <span className="text-[11px] font-bold tracking-widest text-slate-300 block mb-6">01</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Skill Gap Radar</h3>
              <p className="text-slate-500 leading-relaxed font-light text-lg">See exactly where you trail the modern market based on live data. Stop getting rejected for secret requirements.</p>
            </div>

            {/* Upper Right */}
            <div className="md:col-span-7 bg-white rounded-[2rem] p-10 lg:p-14 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden">
              <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-slate-50 rounded-full blur-3xl pointer-events-none" />
              <span className="text-[11px] font-bold tracking-widest text-slate-300 block mb-6">02</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Dynamic Growth Paths</h3>
              <p className="text-slate-500 leading-relaxed font-light text-lg max-w-lg mb-10">We generate step-by-step learning roadmaps. Don&apos;t just find a job—engineer a career trajectory with precision.</p>

              {/* Refined Visual Metaphor */}
              <div className="flex gap-1 h-3 mt-auto">
                <div className="w-1/4 h-full bg-slate-100 rounded-full" />
                <div className="w-12 h-full bg-slate-200 rounded-full mx-1" />
                <div className="flex-1 h-full bg-sky-500 rounded-full relative shadow-[0_0_15px_-3px_rgba(14,165,233,0.4)]" />
              </div>
            </div>

            {/* Bottom Full Row */}
            <div className="md:col-span-12 bg-white rounded-[2rem] p-10 lg:p-16 border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-500 flex flex-col md:flex-row gap-12 items-center justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] font-bold tracking-widest text-slate-300">03</span>
                  <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase font-bold tracking-widest rounded-full">98% Accuracy</span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">Intelligent Match Feed</h3>
                <p className="text-slate-500 leading-relaxed font-light text-xl">Know your exact match percentage before clicking &quot;Apply&quot;. Our engine curates a pristine feed where you are mathematically guaranteed to rank in the upper echelon of candidates.</p>
              </div>

              {/* Mock UI Component */}
              <div className="w-full md:w-80 shrink-0 bg-[#FAFAFC] p-5 rounded-2xl border border-slate-100 shadow-inner">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-50 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-xs">A</div>
                    <span className="text-sky-500 font-bold text-sm">96%</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">Software Engineer II</p>
                  <p className="text-xs text-slate-400 mt-1">Remote • $110k</p>
                </div>
                <div className="bg-white/50 p-5 rounded-xl border border-slate-50 opacity-60">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-8 h-8 rounded bg-slate-200" />
                    <span className="text-slate-400 font-bold text-sm">82%</span>
                  </div>
                  <div className="w-3/4 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-1/2 h-3 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BRIDGING SOUTH ASIA */}
      <section className="py-32 bg-[#111827] text-white">
        <div className="max-w-[70rem] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-light tracking-tight mb-8">Bridging <span className="font-semibold">South Asia</span> <br />to the global stage.</h2>
            <p className="text-slate-400 leading-relaxed font-light text-xl mb-12">
              Whether you aim to lead engineering teams in Karachi and Lahore or secure a six-figure remote startup role in San Francisco, our models natively translate your regional experience into universal market value.
            </p>

            <div className="space-y-4 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-4"><div className="w-1 h-1 bg-sky-500 rounded-full" /> Global Salary Mapping</div>
              <div className="flex items-center gap-4"><div className="w-1 h-1 bg-sky-500 rounded-full" /> US/EU Remote Filters</div>
              <div className="flex items-center gap-4"><div className="w-1 h-1 bg-sky-500 rounded-full" /> International ATS Formatting</div>
            </div>
          </div>
          {/* Abstract Global Visual */}
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border border-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border border-white/5 rounded-full" />
            <div className="absolute top-[30%] right-[30%] w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_20px_4px_rgba(56,189,248,0.5)]" />
            <div className="absolute bottom-[30%] left-[30%] w-1.5 h-1.5 bg-slate-400 rounded-full" />
            {/* Connecting Line */}
            <svg className="absolute inset-0 w-full h-full text-white/20 stroke-[0.5px]" fill="none">
              <path d="M 30%,70% C 40%,60% 60%,50% 70%,30%" strokeDasharray="2 4" />
            </svg>
          </div>
        </div>
      </section>

      {/* 6. VALIDATION (Immaculate Avatars & Serifs) */}
      <section className="py-32 bg-white border-b border-slate-100">
        <div className="max-w-[70rem] mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-20">10,000+ Success Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 text-left">
            <div className="flex flex-col">
              <p className="text-2xl font-serif italic text-slate-700 leading-relaxed mb-8">
                &quot;The AI showed me I was severely underselling my Python skills. Fixed my CV structure, got 3 interviews in a week, and leveled up my compensation.&quot;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-sm">ZH</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Zaid H.</p>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Backend Lead, Lahore</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-2xl font-serif italic text-slate-700 leading-relaxed mb-8">
                &quot;The roadmap gave me the exact cloud foundation I was missing. It gave me the confidence to apply for US remote roles, and it actually worked.&quot;
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-semibold text-sm">AS</div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Ayesha S.</p>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Product Design, Karachi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EMPLOYER TEASER */}
      <section className="py-20 bg-[#FAFAFC] text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-xl font-medium text-slate-900 mb-3">Are you hiring? Start interviewing the top 1%.</h2>
          <p className="text-slate-500 font-light mb-8">CareerPilot scores technical integrity automatically. Stop reading bad CVs.</p>
          <Link href="/auth/register" className="text-sm font-semibold tracking-wide text-slate-900 border-b border-slate-300 hover:border-slate-900 pb-1 transition-colors">
            Switch to Employer Portal →
          </Link>
        </div>
      </section>

      {/* 8. THE DECISIVE CTA */}
      <section className="py-40 bg-white text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen max-w-[1200px] h-[400px] bg-gradient-to-t from-sky-50 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">Your next level <br />is waiting.</h2>
          <p className="text-xl text-slate-500 font-light mb-12">Stop applying blind. Unfair advantages await.</p>

          <Link href="/auth/register" className="inline-flex items-center justify-center bg-slate-900 text-white px-12 py-5 rounded-2xl font-medium text-lg hover:bg-slate-800 transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.3)] hover:-translate-y-1">
            Upload Resume & Get Analyzed
          </Link>
          <p className="mt-8 text-xs font-medium tracking-widest uppercase text-slate-400">Analysis is free • Connects in seconds</p>
        </div>
      </section>

      {/* 9. ULTRA-CLEAN FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-[80rem] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-2">
            <Link href="/" className="font-extrabold text-lg text-slate-900 tracking-tight mb-4 block">
              CareerPilot <span className="text-sky-500">·</span>
            </Link>
            <p className="text-slate-400 max-w-xs font-light leading-relaxed">The Intelligence Engine for Modern Careers. Empowering talent across South Asia and globally.</p>
          </div>

          <div>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link></li>
              <li><Link href="/jobs" className="hover:text-slate-900 transition-colors">Job Feed</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Career Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link href="/employer" className="hover:text-slate-900 transition-colors">For Employers</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[80rem] mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
          <p>© 2026 NextStep Careers Pvt Ltd.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
