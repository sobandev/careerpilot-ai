import { cn } from "@/lib/utils";
import { Sparkles, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MatchScoreProps {
    score: number;
    explanation?: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function MatchScore({ score, explanation, size = 'md', showLabel = true }: MatchScoreProps) {
    const isHighMatch = score >= 80;
    const isMediumMatch = score >= 60 && score < 80;

    const colorClass = isHighMatch
        ? "text-emerald-600 border-emerald-500 bg-emerald-50"
        : isMediumMatch
            ? "text-amber-600 border-amber-500 bg-amber-50"
            : "text-slate-600 border-slate-300 bg-slate-50";

    const glowClass = isHighMatch ? "shadow-[0_0_15px_rgba(5,150,105,0.3)] ring-4 ring-emerald-500/20" : "";

    const sizeClasses = {
        sm: "h-12 w-12 text-base",
        md: "h-16 w-16 text-xl",
        lg: "h-24 w-24 text-3xl",
    };

    const Content = (
        <div className={cn(
            "relative flex flex-col items-center justify-center rounded-full border-4 transition-all duration-500",
            colorClass,
            glowClass,
            sizeClasses[size]
        )}>
            {isHighMatch && size !== 'sm' && (
                <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm animate-pulse flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-white" />
                </span>
            )}
            <span className="font-bold tracking-tighter leading-none">{score}%</span>
            {showLabel && size !== 'sm' && (
                <span className="text-[10px] font-semibold uppercase tracking-widest mt-1 opacity-80">Match</span>
            )}
        </div>
    );

    if (explanation) {
        return (
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="cursor-help inline-flex items-center gap-3 group">
                            {Content}
                            {showLabel && size !== 'sm' && (
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                                    <Info className="h-4 w-4" /> Why this score?
                                </div>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-4 bg-slate-900 border-slate-800 text-slate-50 shadow-xl rounded-xl">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 font-semibold text-emerald-400">
                                <Sparkles className="h-4 w-4" /> AI Insight
                            </div>
                            <p className="text-sm leading-relaxed text-slate-300">
                                {explanation}
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return Content;
}
