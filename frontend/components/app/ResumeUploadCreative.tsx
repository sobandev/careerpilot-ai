'use client';

import { FileText, Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ResumeUploadCreativeProps {
    onUpload: (file: File) => Promise<void>;
    isUploading: boolean;
}

export function ResumeUploadCreative({ onUpload, isUploading }: ResumeUploadCreativeProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [dragCounter, setDragCounter] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragIn = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragCounter(prev => prev + 1)
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true)
        }
    }

    const handleDragOut = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragCounter(prev => prev - 1)
        if (dragCounter - 1 === 0) {
            setIsDragging(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        setDragCounter(0)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0]
            await onUpload(file)
            e.dataTransfer.clearData()
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            await onUpload(e.target.files[0])
        }
    }

    return (
        <div className="w-full animate-[fade-in_0.6s_ease-out_forwards]">
            <input
                type="file"
                accept=".pdf,.docx,.doc"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight text-slate-900 mb-4 leading-tight">
                    Your career story is about to <br className="hidden sm:block" /> become visible.
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Upload your baseline data to generate your personalized intelligence graph.
                </p>
            </div>

            {/* Container */}
            <div className="relative isolate group max-w-2xl mx-auto">
                {/* Background Teaser: Faint abstract node graph watermark */}
                <div className="absolute inset-0 z-[-1] pointer-events-none opacity-[0.03] flex items-center justify-center">
                    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="200" r="180" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="8 8" />
                        <circle cx="100" cy="150" r="12" fill="#0EA5E9" />
                        <circle cx="280" cy="120" r="16" fill="#0EA5E9" />
                        <circle cx="220" cy="280" r="14" fill="#0EA5E9" />
                        <path d="M100 150L280 120" stroke="#0EA5E9" strokeWidth="2" />
                        <path d="M280 120L220 280" stroke="#0EA5E9" strokeWidth="2" />
                        <path d="M100 150L220 280" stroke="#0EA5E9" strokeWidth="2" />
                    </svg>
                </div>

                <div
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={cn(
                        "relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] p-16 sm:p-24 text-center transition-all duration-500 cursor-pointer bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border",
                        isDragging
                            ? "border-sky-300 scale-[1.02] shadow-[0_30px_60px_-15px_rgba(14,165,233,0.1)]"
                            : "border-slate-100 hover:border-sky-200 hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.05)]",
                        isUploading && "pointer-events-none opacity-90 scale-[0.98] border-slate-100 bg-slate-50/50"
                    )}
                >
                    <div className="relative flex flex-col items-center">
                        {isUploading ? (
                            <div className="relative mb-8">
                                <div className="absolute inset-0 rounded-full bg-sky-100 animate-ping opacity-60" />
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md border border-slate-100">
                                    <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border border-slate-100/50 group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.2)] transition-all duration-500">
                                <FileText className="h-8 w-8 text-slate-400 group-hover:text-sky-500 transition-colors" />
                                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-sky-400 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0" />
                            </div>
                        )}

                        <div className="space-y-6 flex flex-col items-center">
                            {isUploading ? (
                                <>
                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        Extracting Intelligence...
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100/50">
                                        <CheckCircle2 className="h-4 w-4" /> DeepParse AI Active
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-slate-700 font-medium text-lg">
                                        {isDragging ? "Drop it right here" : "Drag and drop your latest PDF resume here"}
                                    </p>

                                    <button
                                        className="bg-sky-500 text-white hover:bg-sky-400 px-8 py-3.5 rounded-xl font-semibold shadow-[0_10px_20px_-10px_rgba(14,165,233,0.4)] transition-all hover:-translate-y-0.5"
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        type="button"
                                    >
                                        Browse Files
                                    </button>

                                    <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mt-4">
                                        PDF, DOCX up to 5MB • Secured & Parsed by DeepParse AI
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
