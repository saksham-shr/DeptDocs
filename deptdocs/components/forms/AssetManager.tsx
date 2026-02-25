"use client";

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, Loader2, FileText, Users, CheckSquare, PieChart, Paperclip, Image as ImageIcon } from 'lucide-react';

export default function AssetManager({
    reportId,
    onDataExtracted,
    onFilesUpdated,
    currentFiles
}: {
    reportId: string | null,
    onDataExtracted: (data: any) => void,
    onFilesUpdated: (type: string, newFiles: any[]) => void,
    currentFiles: any
}) {
    const supabase = createClient();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    const assetTypes = [
        { id: 'activityPhotos', label: 'Activity Photos', icon: <ImageIcon className="text-gray-300" size={40} strokeWidth={1.5} />, bucket: 'reports' },
        { id: 'attendanceFiles', label: 'Attendance List', icon: <Users className="text-gray-300" size={40} strokeWidth={1.5} />, bucket: 'reports' },
        { id: 'brochureFiles', label: 'Brochure', icon: <FileText className="text-gray-300" size={40} strokeWidth={1.5} />, bucket: 'reports' },
        { id: 'approvalFiles', label: 'NFA', icon: <CheckSquare className="text-gray-300" size={40} strokeWidth={1.5} />, bucket: 'reports' },
        { id: 'feedbackFiles', label: 'Feedback', icon: <PieChart className="text-gray-300" size={40} strokeWidth={1.5} />, bucket: 'reports' },
    ];

    const handleFileUpload = async (typeId: string, bucket: string, file: File) => {
        setUploadingId(typeId);
        try {
            const folder = reportId || 'temp_uploads';
            const filePath = `${folder}/${typeId}/${Date.now()}_${file.name}`;

            const { error } = await supabase.storage.from(bucket).upload(filePath, file);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);

            const newFileObject = {
                id: Date.now().toString(),
                name: file.name,
                type: file.type,
                url: publicUrl
            };

            const updatedArray = [...(currentFiles[typeId] || []), newFileObject];
            onFilesUpdated(typeId, updatedArray);

        } catch (err) {
            console.error("Upload error:", err);
            alert("Error uploading file to storage.");
        } finally {
            setUploadingId(null);
        }
    };

    const runAI = async () => {
        const allFileUrls = Object.values(currentFiles).flat().map((f: any) => f.url);
        if (allFileUrls.length === 0) return alert("Please upload assets before running AI.");

        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/ai/extract", {
                method: "POST",
                body: JSON.stringify({ urls: allFileUrls }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            onDataExtracted(data);
        } catch (err) {
            alert("AI Analysis failed. Please verify your Gemini API key.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-10 rounded-xl min-h-[500px]">

            {/* Title with Figma's Blue Underline */}
            <div className="border-b-2 border-[#3358a8] pb-2 mb-10 w-fit pr-10">
                <h2 className="text-xl font-bold text-[#2d4373]">Upload Assets</h2>
            </div>

            {/* FIXED RESPONSIVE GRID - Matches Figma exactly */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
                {assetTypes.map((type) => (
                    <div
                        key={type.id}
                        className="w-[180px] sm:w-[220px] bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-between shadow-[0_2px_15px_rgba(0,0,0,0.03)] relative"
                    >
                        {/* Status Badge */}
                        {currentFiles[type.id]?.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-sm">
                                {currentFiles[type.id].length}
                            </span>
                        )}

                        {/* Icon & Label */}
                        <div className="flex flex-col items-center mt-2 mb-6">
                            {type.icon}
                            <span className="text-xs font-semibold text-gray-500 mt-3 text-center leading-tight">
                                {type.label}
                            </span>
                        </div>

                        {/* Constrained Upload Button */}
                        <label className="w-full cursor-pointer">
                            <div className="w-full bg-[#3358a8] text-white py-2 rounded-full flex items-center justify-center gap-2 text-xs font-medium hover:bg-[#254385] transition-colors shadow-sm">
                                {uploadingId === type.id ? (
                                    <Loader2 className="animate-spin" size={14} />
                                ) : (
                                    <Paperclip size={14} />
                                )}
                                Upload
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(type.id, type.bucket, e.target.files[0])}
                            />
                        </label>
                    </div>
                ))}
            </div>

            {/* AI Extraction Trigger */}
            <div className="mt-14 flex justify-center">
                <button
                    onClick={runAI}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-indigo-600 to-[#3358a8] text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-3 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {isAnalyzing ? "AI is Extracting Data..." : "Auto-Fill with AI"}
                </button>
            </div>

        </div>
    );
}