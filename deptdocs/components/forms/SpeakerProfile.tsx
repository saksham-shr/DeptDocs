"use client";

import React, { useState } from 'react';
import { ChevronRight, Upload, User, X, Image as ImageIcon } from 'lucide-react';

export default function SpeakerProfile({ data, onUpdate, onNext }: any) {
    const [isProcessing, setIsProcessing] = useState<number | null>(null);
    const [dragActive, setDragActive] = useState<number | null>(null);

    // Pulling speakers from the master state
    const speakers = data.speakers || [];

    const updateProfile = (id: number, field: string, value: string) => {
        const updated = speakers.map((s: any) =>
            s.id === id ? { ...s, [field]: value } : s
        );
        onUpdate({ speakers: updated });
    };

    // Handle Drag Events for styling
    const handleDrag = (e: React.DragEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(id);
        } else if (e.type === "dragleave") {
            setDragActive(null);
        }
    };

    // Handle Real File Upload and Base64 Conversion
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent, id: number) => {
        e.preventDefault();
        setDragActive(null);

        let selectedFile: File | null = null;
        if ('dataTransfer' in e) {
            selectedFile = e.dataTransfer.files[0];
        } else {
            selectedFile = e.target.files ? e.target.files[0] : null;
        }

        if (!selectedFile || !selectedFile.type.startsWith('image/')) return;

        setIsProcessing(id);

        try {
            const base64String = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(selectedFile!);
            });

            // Update the specific speaker's photo in the master state
            const updated = speakers.map((s: any) =>
                s.id === id ? { ...s, photo: base64String } : s
            );
            onUpdate({ speakers: updated });

        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image.");
        } finally {
            setIsProcessing(null);
        }
    };

    const removePhoto = (id: number) => {
        const updated = speakers.map((s: any) =>
            s.id === id ? { ...s, photo: null } : s
        );
        onUpdate({ speakers: updated });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 max-w-3xl">
            <h3 className="text-xl font-bold text-[#1a365d] border-b-2 border-[#1a365d] inline-block pb-1">
                Speaker Profile
            </h3>

            <div className="space-y-12">
                {speakers.map((speaker: any) => (
                    <div key={speaker.id} className="p-8 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-6 shadow-sm">
                        {/* Dynamic Name Header */}
                        <h4 className="font-bold text-[#1a365d] text-lg underline flex items-center gap-2">
                            <User size={20} />
                            {speaker.name || `Speaker ${speaker.id}`}
                        </h4>

                        {/* About Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">About the Speaker</label>
                            <textarea
                                rows={4}
                                value={speaker.about || ''}
                                onChange={(e) => updateProfile(speaker.id, 'about', e.target.value)}
                                placeholder={`Brief biography of ${speaker.name || 'the speaker'}...`}
                                className="w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-[#4F65F6] outline-none transition-all text-sm leading-relaxed"
                            />
                        </div>

                        {/* Photo Upload Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Speaker Photo</label>

                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all group min-h-[200px]
                                    ${dragActive === speaker.id ? 'border-[#4F65F6] bg-[#4F65F6]/5' : 'border-gray-200 bg-white hover:border-[#4F65F6]'}`}
                                onDragOver={(e) => handleDrag(e, speaker.id)}
                                onDragLeave={(e) => handleDrag(e, speaker.id)}
                                onDrop={(e) => handleFileChange(e, speaker.id)}
                            >
                                {speaker.photo ? (
                                    <div className="relative group/img w-32 h-32 rounded-lg overflow-hidden border shadow-sm">
                                        <img src={speaker.photo} alt="Speaker" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removePhoto(speaker.id)}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                        >
                                            <X size={20} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            id={`speaker-photo-${speaker.id}`}
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, speaker.id)}
                                            disabled={isProcessing === speaker.id}
                                        />
                                        <div className="mb-3 p-3 bg-gray-50 rounded-full group-hover:scale-110 transition-transform">
                                            <Upload size={20} className={dragActive === speaker.id ? "text-[#4F65F6]" : "text-gray-400"} />
                                        </div>
                                        <div className="bg-[#4F65F6] text-white px-6 py-2 rounded-full font-bold text-xs mb-2 shadow-sm group-hover:bg-[#3d50c2]">
                                            {isProcessing === speaker.id ? "Processing..." : "Upload Photo"}
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium">JPG, PNG or WEBP</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={onNext}
                    className="bg-[#4F65F6] text-white px-10 py-3 rounded-lg font-bold flex items-center space-x-2 hover:bg-[#3d50c2] transition-all shadow-md active:scale-95"
                >
                    <span>Next</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}