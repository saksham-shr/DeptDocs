"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Upload, X, CheckCircle2, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        designation: '',
        department: '',
        email: '', // Pre-filled later from Auth
    });
    const [signature, setSignature] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSignature(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signature) {
            alert("Please upload your digital signature to proceed.");
            return;
        }
        setLoading(true);

        // Logic for DeptDocs:
        // 1. Get the current authenticated user
        // 2. Upload the signature file to Supabase Storage
        // 3. Update the user's profile metadata

        console.log("Onboarding Data:", { ...formData, signature: signature.name });

        // After saving, move to the Home Dashboard
        router.push('/home');
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-6 text-black">
            <div className="max-w-2xl w-full">
                <div className="flex justify-center mb-8">
                    <Image src="/christ-logo.png" alt="Christ University" width={280} height={90} priority />
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                    <header className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Setup Your Profile</h1>
                        <p className="text-gray-500 mt-2">These details will be used for your official reports.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Input Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                <input
                                    name="fullName"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5065F6] outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600">Designation</label>
                                <input
                                    name="designation"
                                    required
                                    onChange={handleInputChange}
                                    placeholder="e.g. Student / Faculty"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5065F6] outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-600">Department</label>
                            <input
                                name="department"
                                required
                                onChange={handleInputChange}
                                placeholder="e.g. Department of AI, ML & Data Science"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5065F6] outline-none"
                            />
                        </div>

                        {/* Signature Upload Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-600">Digital Signature</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${signature ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#5065F6] hover:bg-blue-50'
                                    }`}
                            >
                                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />

                                {signature ? (
                                    <div className="flex flex-col items-center text-green-700">
                                        <CheckCircle2 size={40} className="mb-2" />
                                        <span className="font-medium text-sm">{signature.name}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setSignature(null); }}
                                            className="mt-2 text-xs text-red-500 hover:underline font-bold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={32} className="text-gray-400 mb-2" />
                                        <p className="text-gray-500 text-sm text-center">
                                            Click to upload an image of your signature <br />
                                            <span className="text-xs">(PNG or JPG recommended)</span>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5065F6] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4054e5] transition-all flex items-center justify-center space-x-2"
                        >
                            <span>{loading ? "Saving Details..." : "Save and Continue"}</span>
                            {!loading && <ChevronRight size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}