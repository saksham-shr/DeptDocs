"use client";

import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Upload } from 'lucide-react';

// This is where you will eventually import your Supabase client
// import { supabase } from '@/utils/supabase/client';

export default function PreparedBy({ data, onUpdate, onNext }: any) {
    const [loading, setLoading] = useState(false);

    // Initialize organizersList if not exists, focusing on the first element for this single-step form
    const organizers = data.organizersList || [
        { name: '', designation: '', signatureImage: '' }
    ];

    const updateOrganizer = (field: string, value: string) => {
        const updated = [...organizers];
        updated[0] = { ...updated[0], [field]: value };
        onUpdate({ organizersList: updated });
    };

    // Function to handle "Use saved info from profile"
    const handleToggleProfile = async (checked: boolean) => {
        if (checked) {
            setLoading(true);

            // MOCK DATA (Matches your onboarding inputs)
            const mockProfile = {
                fullName: "Saksham Sharma",
                designation: "B.Tech Student",
                signatureUrl: "/mock-signature.png"
            };

            const updated = [...organizers];
            updated[0] = {
                name: mockProfile.fullName,
                designation: mockProfile.designation,
                signatureImage: mockProfile.signatureUrl
            };

            onUpdate({
                organizersList: updated,
                useProfile: true
            });
            setLoading(false);
        } else {
            const updated = [...organizers];
            updated[0] = { name: '', designation: '', signatureImage: '' };
            onUpdate({
                organizersList: updated,
                useProfile: false
            });
        }
    };

    const handleToggleCollaborators = (checked: boolean) => {
        onUpdate({ useCollaborators: checked });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold text-[#1a365d] border-b-2 border-[#1a365d] inline-block pb-1">
                Report Prepared By
            </h3>

            <div className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Name</label>
                    <input
                        type="text"
                        value={organizers[0].name || ''}
                        onChange={(e) => updateOrganizer('name', e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#3b5998]"
                    />
                </div>

                {/* Designation Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Designation</label>
                    <input
                        type="text"
                        value={organizers[0].designation || ''}
                        onChange={(e) => updateOrganizer('designation', e.target.value)}
                        className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#3b5998]"
                    />
                </div>

                {/* Digital Signature Display */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Digital Signature</label>
                    <div className="border-2 border-dashed border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/30">
                        {organizers[0].signatureImage ? (
                            <div className="flex flex-col items-center text-[#3b5998]">
                                <CheckCircle2 size={32} className="mb-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Signature Loaded</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <button className="bg-[#4F65F6] text-white px-6 py-2 rounded-full font-bold text-xs mb-4">
                                    Upload
                                </button>
                                <p className="text-xs text-gray-400 text-center">
                                    Click to browse or <br /> drag and drop your files
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Checkbox Options */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.useProfile || false}
                            onChange={(e) => handleToggleProfile(e.target.checked)}
                            className="w-5 h-5 accent-[#3b5998] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-black">
                            {loading ? "Fetching Profile..." : "Use saved info from profile"}
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.useCollaborators || false}
                            onChange={(e) => handleToggleCollaborators(e.target.checked)}
                            className="w-5 h-5 accent-[#3b5998] cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-600 group-hover:text-black">
                            Add Collaborators Details
                        </span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button
                    onClick={onNext}
                    className="bg-[#3b5998] text-white px-10 py-3 rounded-lg font-bold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <span>Next</span>
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}