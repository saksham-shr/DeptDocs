"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Upload, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        designation: '',
        department: '',
        email: '',
    });
    const [signature, setSignature] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();

    // Fetch the user's email and metadata automatically
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Extract the metadata saved during signup
                const firstName = user.user_metadata?.first_name || '';
                const lastName = user.user_metadata?.last_name || '';
                const combinedName = `${firstName} ${lastName}`.trim();

                setFormData(prev => ({
                    ...prev,
                    email: user.email || '',
                    fullName: combinedName // Autofill the combined name!
                }));
            }
        };
        fetchUser();
    }, [supabase]);

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
        setError(null);

        if (!signature) {
            setError("Please upload your digital signature to proceed.");
            return;
        }

        setLoading(true);

        try {
            // 1. Get the current authenticated user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("Could not verify user. Please log in again.");

            // 2. Upload to Supabase Storage ('signatures' bucket)
            const fileExt = signature.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('signatures')
                .upload(filePath, signature);

            if (uploadError) throw uploadError;

            // 3. Get the public URL for the image
            const { data: { publicUrl } } = supabase.storage
                .from('signatures')
                .getPublicUrl(filePath);

            // 4. Save to the 'profiles' table (STRICTLY MATCHING YOUR SCHEMA)
            const { error: dbError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: formData.fullName,
                    designation: formData.designation,
                    department: formData.department,
                    email: formData.email,
                    signature_url: publicUrl
                });

            if (dbError) throw dbError;

            // Optional: Log the activity to your activity_logs table
            await supabase.from('activity_logs').insert({
                user_id: user.id,
                user_name: formData.fullName,
                action_type: 'USER_ONBOARDED',
                description: `${formData.fullName} completed profile setup.`
            });

            // Success! Move to Dashboard
            router.push('/home');

        } catch (err: any) {
            console.error("Save Error:", err.message);
            setError(err.message || "Something went wrong while saving.");
        } finally {
            setLoading(false);
        }
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

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3b5998] outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Designation</label>
                                <input
                                    name="designation"
                                    required
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Student / Faculty"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3b5998] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Department</label>
                            <input
                                name="department"
                                required
                                value={formData.department}
                                onChange={handleInputChange}
                                placeholder="e.g. Department of AI, ML & Data Science"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#3b5998] outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">Digital Signature</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${signature ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#3b5998] hover:bg-blue-50'
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
                            className="w-full bg-[#3b5998] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#2d4373] transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
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