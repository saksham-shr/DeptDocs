"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client'; // Your Supabase client setup

export default function ChangePasswordPage() {
    const router = useRouter();
    const supabase = createClient();

    // Form State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Status State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 1. Basic Validation
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // 2. Supabase Update Password Call (For already logged-in users)
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            // 3. Success State
            setSuccess(true);
            setTimeout(() => {
                router.push('/setting'); // Route back to settings after 2 seconds
            }, 2000);

        } catch (err: any) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex flex-col font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors"
                        title="Back to Settings"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <Image src="/christ-logo.png" alt="Christ University" width={140} height={40} className="object-contain" />
                </div>
                <h1 className="text-sm font-bold text-gray-500 hidden md:block tracking-wide">
                    Department of AI, ML & Data Science
                </h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-300">

                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Lock size={32} className="text-[#3b5998]" />
                    </div>

                    <h1 className="text-2xl font-extrabold text-center text-[#112a53] mb-2">
                        Change Password
                    </h1>
                    <p className="text-sm text-gray-500 text-center mb-8">
                        Enter a new secure password for your account.
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start space-x-3 mb-6 text-sm font-medium">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start space-x-3 mb-6 text-sm font-medium">
                            <CheckCircle size={18} className="shrink-0 mt-0.5" />
                            <span>Password updated successfully! Redirecting to settings...</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3.5 pr-12 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#3b5998] transition-shadow"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3.5 pr-12 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#3b5998] transition-shadow"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-[#3b5998] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#2d4373] transition-colors shadow-md active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-4"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>

                </div>
            </main>
        </div>
    );
}