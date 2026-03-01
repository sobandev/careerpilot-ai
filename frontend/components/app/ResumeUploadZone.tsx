'use client';

import { UploadCloud, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ResumeUploadZoneProps {
    onUpload: (file: File) => Promise<void>;
    isUploading: boolean;
}

export function ResumeUploadZone({ onUpload, isUploading }: ResumeUploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await onUpload(file);
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await onUpload(file);
        }
    }

    return (
        <div className="mx-auto max-w-2xl w-full">
            <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-200 cursor-pointer",
                    isDragging ? "border-primary-500 bg-primary-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300",
                    isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/5">
                    <UploadCloud className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-slate-900">Upload your resume</h3>
                <p className="mb-6 text-sm text-slate-500">Drag and drop your PDF or DOCX file here, up to 10MB</p>

                <Button
                    onClick={(e) => { e.stopPropagation(); !isUploading && fileInputRef.current?.click(); }}
                    disabled={isUploading}
                    className="min-w-[140px] shadow-sm"
                >
                    {isUploading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                        "Browse Files"
                    )}
                </Button>
            </div>
        </div>
    )
}
