"use client";

import React from 'react';
import { PlusCircle, Trash2, ChevronRight, UserCircle } from 'lucide-react';

export default function SpeakerDetails({ data, onUpdate, onNext }: any) {
    // Ensure we always have at least one speaker card
    const speakers = data.speakers || [
        { id: Date.now(), name: '', designation: '', organization: '', contact: '', presentationTitle: '' }
    ];

    const updateSpeaker = (id: number, field: string, value: string) => {
        const updated = speakers.map((s: any) =>
            s.id === id ? { ...s, [field]: value } : s
        );
        onUpdate({ speakers: updated });
    };

    const addSpeaker = () => {
        onUpdate({
            speakers: [
                ...speakers,
                { id: Date.now(), name: '', designation: '', organization: '', contact: '', presentationTitle: '' }
            ]
        });
    };

    const removeSpeaker = (id: number) => {
        if (speakers.length > 1) {
            onUpdate({ speakers: speakers.filter((s: any) => s.id !== id) });
        }
    };

    return (
        <div className="space-y-10 animate-in slide-in-from-right duration-500">
            <h3 className="text-xl font-bold text-[#1a365d] mb-6 border-b-2 border-[#1a365d] inline-block pb-1">
                Speaker/Guest Details
            </h3>

            <div className="space-y-12">
                {speakers.map((speaker: any, index: number) => (
                    <div key={speaker.id} className="relative p-8 border border-gray-200 rounded-2xl bg-gray-50/50">
                        {/* Header with Speaker Index and Delete Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-[#1a365d] flex items-center gap-2">
                                <UserCircle size={20} />
                                Speaker {index + 1}:
                            </h4>
                            {speakers.length > 1 && (
                                <button
                                    onClick={() => removeSpeaker(speaker.id)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}
                        </div>

                        {/* Input Grid matching image_9098d3.png */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Name of the Speaker/Guest/Presenter</label>
                                <input
                                    type="text"
                                    value={speaker.name}
                                    onChange={(e) => updateSpeaker(speaker.id, 'name', e.target.value)}
                                    className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#3b5998]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Title/Position</label>
                                <input
                                    type="text"
                                    value={speaker.designation}
                                    onChange={(e) => updateSpeaker(speaker.id, 'designation', e.target.value)}
                                    className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#3b5998]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Organization</label>
                                <input
                                    type="text"
                                    value={speaker.organization}
                                    onChange={(e) => updateSpeaker(speaker.id, 'organization', e.target.value)}
                                    className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#3b5998]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Contact Info</label>
                                <input
                                    type="text"
                                    value={speaker.contact}
                                    onChange={(e) => updateSpeaker(speaker.id, 'contact', e.target.value)}
                                    className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#3b5998]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600">Title of Presentation</label>
                                <input
                                    type="text"
                                    value={speaker.presentationTitle}
                                    onChange={(e) => updateSpeaker(speaker.id, 'presentationTitle', e.target.value)}
                                    className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#3b5998]"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex justify-between items-center">
                <button
                    onClick={addSpeaker}
                    className="flex items-center gap-2 bg-[#3b5998] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#2d4373] transition-all"
                >
                    <PlusCircle size={18} />
                    Add Speaker
                </button>

                <button
                    onClick={onNext}
                    className="bg-[#1a365d] text-white px-10 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all"
                >
                    <span>Next</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}