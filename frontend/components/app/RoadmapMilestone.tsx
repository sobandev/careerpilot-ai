import { cn } from "@/lib/utils";
import { Check, ArrowRight, PlayCircle, BookOpen, Lightbulb, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Resource {
    title: string;
    type: 'video' | 'article' | 'course';
    cost: 'free' | 'paid';
    url: string;
    duration?: string;
}

interface RoadmapMilestoneProps {
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming';
    weekRange: string;
    aiHint?: string;
    resources?: Resource[];
    isLast?: boolean;
    onComplete?: () => void;
}

export function RoadmapMilestone({
    title,
    description,
    status,
    weekRange,
    aiHint,
    resources = [],
    isLast = false,
    onComplete
}: RoadmapMilestoneProps) {

    const [isOpen, setIsOpen] = useState(status === 'current');

    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';
    const isUpcoming = status === 'upcoming';

    return (
        <div className="relative flex gap-6 sm:gap-8 w-full group">
            {/* Visual Timeline Spine (Left edge) */}
            <div className="flex flex-col items-center">
                {/* Node */}
                <div className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500",
                    isCompleted ? "bg-sky-500 text-white shadow-sm" :
                        isCurrent ? "bg-white border-[3px] border-sky-500 text-sky-600 shadow-[0_0_20px_rgba(14,165,233,0.2)]" :
                            "bg-slate-50 border border-slate-200 text-slate-300"
                )}>
                    {isCompleted && <Check className="h-4 w-4 stroke-[3]" />}
                    {isCurrent && (
                        <>
                            <div className="absolute inset-0 rounded-full border border-sky-400 animate-[ping_2s_ease-in-out_infinite] opacity-50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                        </>
                    )}
                    {isUpcoming && <div className="h-2 w-2 rounded-full bg-slate-200" />}
                </div>

                {/* Vertical Line */}
                {!isLast && (
                    <div className={cn(
                        "w-0.5 flex-1 my-2 rounded-full transition-all duration-500",
                        isCompleted ? "bg-sky-500" :
                            isCurrent ? "bg-gradient-to-b from-sky-500 via-sky-200 to-slate-100" :
                                "bg-slate-100"
                    )} />
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 pb-12 transition-all duration-500">
                <div className={cn(
                    "rounded-[1.5rem] border p-6 sm:p-8 transition-all duration-300",
                    isCompleted ? "bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50/50" :
                        isCurrent ? "bg-white border-sky-100 shadow-[0_15px_40px_-15px_rgba(14,165,233,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(14,165,233,0.15)]" :
                            "bg-[#FAFAFC] border-slate-100/60 hover:bg-white hover:shadow-sm cursor-pointer",
                    !isUpcoming && "hover:-translate-y-0.5"
                )} onClick={() => { if (isUpcoming || isCompleted) setIsOpen(!isOpen) }}>
                    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-3">
                        <div className="space-y-1.5 flex-1">
                            <span className={cn(
                                "inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg",
                                isCompleted ? "text-emerald-700 bg-emerald-100/50" :
                                    isCurrent ? "text-sky-700 bg-sky-50 border border-sky-100/50" :
                                        "text-slate-500 bg-slate-200/50"
                            )}>
                                Week {weekRange}
                            </span>
                            <div className="flex items-center justify-between">
                                <h3 className={cn(
                                    "text-[1.35rem] font-bold tracking-tight transition-colors",
                                    isCompleted ? "text-slate-500 line-through decoration-slate-300" :
                                        isCurrent ? "text-slate-900" :
                                            "text-slate-600"
                                )}>
                                    {title}
                                </h3>
                                {(isUpcoming || isCompleted) && (
                                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform xl:hidden", isOpen && "rotate-180")} />
                                )}
                            </div>
                        </div>

                        {status !== 'upcoming' && (
                            <Button
                                variant={isCompleted ? "outline" : "default"}
                                size="sm"
                                className={cn(
                                    "shrink-0 rounded-xl h-10 px-5 font-semibold transition-all",
                                    isCurrent && "bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 z-20 relative"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isCompleted && onComplete) onComplete();
                                }}
                            >
                                {isCompleted ? "Review Material" : "Mark as Completed"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                        {(isUpcoming || isCompleted) && (
                            <ChevronDown className={cn("hidden xl:block w-5 h-5 text-slate-400 transition-transform mt-2", isOpen && "rotate-180")} />
                        )}
                    </div>

                    <p className={cn(
                        "text-[15px] leading-relaxed max-w-2xl",
                        isCurrent ? "text-slate-600" : "text-slate-500"
                    )}>
                        {description}
                    </p>

                    {/* Active Insights & Resources */}
                    {(isOpen || isCurrent) && (
                        <div className="mt-8 space-y-6">
                            {/* AI Rationale */}
                            {aiHint && (
                                <div className="bg-[#FAFAFC] border-l-2 border-sky-200 p-4 rounded-r-xl flex gap-3 text-sm">
                                    <Lightbulb className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                                    <div className="text-slate-600 leading-relaxed">
                                        <strong className="text-slate-900 font-semibold mr-1">Why this?</strong>
                                        {aiHint}
                                    </div>
                                </div>
                            )}

                            {/* Resource Links (Elegant Rows instead of blocky cards) */}
                            {resources.length > 0 && (
                                <div className="space-y-2.5">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1 mb-2">Curated Deep-Dives</h4>
                                    <div className="flex flex-col gap-2">
                                        {resources.map((res, idx) => (
                                            <a key={idx} href={res.url} target="_blank" rel="noreferrer"
                                                className="group/res flex items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 px-4 py-3 transition-colors border border-transparent hover:border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-slate-400 group-hover/res:text-sky-500 transition-colors">
                                                        {res.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                                    </div>
                                                    <span className="text-[14px] font-medium text-slate-700 group-hover/res:text-slate-900 transition-colors">
                                                        {res.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className={cn(
                                                        "uppercase font-bold tracking-wider",
                                                        res.cost === 'free' ? "text-emerald-600" : "text-amber-600"
                                                    )}>{res.cost}</span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover/res:text-slate-600 group-hover/res:translate-x-1 transition-all" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
