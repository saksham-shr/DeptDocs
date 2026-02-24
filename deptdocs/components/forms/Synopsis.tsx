"use client";

import React from 'react';
import { ChevronRight, List, Type } from 'lucide-react';

export default function Synopsis({ data, onUpdate, onNext }: any) {
    // Note: Changed 'followUp' to 'followUpPlan' so it correctly maps to the PDF Engine
    const fields = [
        { id: 'highlights', label: 'Highlights of the activity' },
        { id: 'takeaways', label: 'Key Takeaways' },
        { id: 'summary', label: 'Summary of the Activity' },
        { id: 'followUpPlan', label: 'Follow Up Plan' },
    ];

    // Helper to insert a bullet point at the end of the current text
    const insertBullet = (fieldId: string) => {
        const currentText = data[fieldId] || '';
        // If there's already text and it doesn't end with a newline, add one first
        const newText = currentText + (currentText && !currentText.endsWith('\n') ? '\n• ' : '• ');
        onUpdate({ [fieldId]: newText });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
            <h3 className="text-xl font-bold text-[#1a365d] border-b-2 border-[#1a365d] inline-block pb-1">
                Synopsis
            </h3>

            <div className="space-y-8">
                {fields.map((field) => (
                    <div key={field.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700">{field.label}</label>

                            {/* Simple Formatting Toolbar */}
                            <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
                                <button
                                    type="button"
                                    title="Standard Text"
                                    className="p-1.5 hover:bg-white rounded shadow-sm text-gray-600 transition-all focus:outline-none"
                                >
                                    <Type size={14} />
                                </button>
                                <button
                                    type="button"
                                    title="Add Bullet Point"
                                    onClick={() => insertBullet(field.id)}
                                    className="p-1.5 hover:bg-white hover:text-[#4F65F6] rounded shadow-sm text-gray-600 transition-all focus:outline-none"
                                >
                                    <List size={14} />
                                </button>
                            </div>
                        </div>

                        <textarea
                            rows={4}
                            value={data[field.id] || ''}
                            onChange={(e) => onUpdate({ [field.id]: e.target.value })}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            className="w-full p-4 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#4F65F6] outline-none transition-all text-sm leading-relaxed"
                        />
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