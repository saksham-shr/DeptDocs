"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

export default function SetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        // Supabase updates the user currently in the 'recovery' session
        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            alert("Password updated successfully!");
            router.push('/login');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-black">

                {/* LEFT COLUMN: Form Fields */}
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="flex flex-col space-y-8">
                        <Image src="/christ-logo.png" alt="Logo" width={250} height={80} priority />

                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Set a password</h1>
                            <p className="text-gray-500 mt-2">Your previous password has been reset. Please set a new password for your account.</p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6">
                            {/* Create Password Input */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium">Create Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="7789BM6X@@H&$K_"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5065F6] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Re-enter Password Input */}
                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium">Re-enter Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="7789BM6X@@H&$K_"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5065F6] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#5065F6] text-white py-3 rounded-lg font-semibold hover:bg-[#4054e5] transition-all"
                            >
                                {loading ? "Updating..." : "Set password"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: Illustration (Woman pointing to phone with lock) */}
                <div className="hidden lg:flex justify-center">
                    <Image
                        src="/reset-password-illustration.png"
                        alt="Set Password Illustration"
                        width={600}
                        height={600}
                        className="object-contain"
                    />
                </div>
            </div>
        </main>
    );
}