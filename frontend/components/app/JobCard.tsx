import { MapPin, Briefcase, Sparkles, Building2, CheckCircle2, Bookmark, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface JobCardProps {
    id?: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    matchScore: number;
    skills: string[];
    isPremium?: boolean;
}

export function JobCard({ title, company, location, salary, matchScore, skills, isPremium = false }: JobCardProps) {
    const isHighMatch = matchScore >= 90;
    const isGoodMatch = matchScore >= 75 && matchScore < 90;

    return (
        <div className={cn(
            "group relative flex flex-col gap-6 rounded-[1.5rem] border bg-white p-6 md:p-8 transition-all duration-300",
            isHighMatch
                ? "border-sky-100 shadow-[0_15px_40px_-15px_rgba(14,165,233,0.06)] hover:border-sky-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(14,165,233,0.12)]"
                : "border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.02)] hover:border-slate-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)]"
        )}>
            {/* Top row: Company, Location, Match Score */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-[#FAFAFC] text-slate-400 group-hover:border-sky-100 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors shadow-inner">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-1 tracking-wide">
                            {company}
                            {isPremium && (
                                <Sparkles className="h-3 w-3 text-sky-400 fill-sky-400 animate-pulse" />
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate text-xl sm:text-2xl tracking-tight leading-none">
                            {title}
                        </h3>
                    </div>
                </div>

                {/* AI Match Ring Indicator */}
                <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative">
                        {/* Circular Progress (simplified CSS representation) */}
                        <svg className="w-14 h-14 transform -rotate-90">
                            <circle
                                cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent"
                                className={cn(isHighMatch ? "text-sky-100" : isGoodMatch ? "text-slate-100" : "text-slate-50")}
                            />
                            <circle
                                cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray={`${matchScore * 1.5} 150`}
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    isHighMatch ? "text-sky-500" : isGoodMatch ? "text-sky-400" : "text-slate-300"
                                )}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className={cn(
                                "text-[15px] font-bold tracking-tighter leading-none mt-0.5",
                                isHighMatch ? "text-sky-700" : "text-slate-700"
                            )}>
                                {matchScore}<span className="text-[10px] text-slate-400">%</span>
                            </span>
                        </div>
                        {isHighMatch && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-100" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Middle Row: Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500 font-medium tracking-wide">
                <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" /> {location}
                </span>
                {salary && (
                    <>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="flex items-center gap-1.5 text-slate-700">
                            <Briefcase className="h-4 w-4 text-slate-400" /> {salary}/yr
                        </span>
                    </>
                )}
                {location.toLowerCase().includes('remote') && (
                    <>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="flex items-center gap-1.5 text-emerald-600">
                            Remote Available
                        </span>
                    </>
                )}
            </div>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-2">
                {skills.slice(0, 5).map(skill => (
                    <span key={skill} className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 text-xs rounded-lg font-semibold tracking-wide">
                        {skill}
                    </span>
                ))}
                {skills.length > 5 && (
                    <span className="bg-[#FAFAFC] text-slate-400 border border-slate-100 px-3 py-1 text-xs rounded-lg font-semibold">
                        +{skills.length - 5}
                    </span>
                )}
            </div>

            {/* Bottom Row: AI Explainer & Actions */}
            <div className="mt-2 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {isHighMatch ? (
                        <div className="bg-sky-50/50 border-l-2 border-sky-300 text-slate-600 text-[13px] italic px-4 py-2.5 rounded-r-xl truncate flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                            <span className="truncate">This is your velocity sweet spot based on recent trajectory.</span>
                        </div>
                    ) : isGoodMatch ? (
                        <div className="text-slate-500 text-[13px] italic px-2 flex items-center gap-2">
                            <span className="truncate">Stretch role. Requires a few skills you don't possess yet.</span>
                        </div>
                    ) : (
                        <div />
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-2 h-10 px-5 rounded-xl bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition-colors">
                        Apply <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
