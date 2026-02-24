"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push(`/auth/verify-code?email=${encodeURIComponent(email)}`);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-black">
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <Link href="/login" className="flex items-center text-sm text-gray-600 hover:text-black mb-8">
                        <ChevronLeft size={16} /> Back to login
                    </Link>
                    <Image src="/christ-logo.png" alt="Logo" width={250} height={80} priority className="mb-8" />
                    <h1 className="text-4xl font-bold text-gray-900">Forgot your password?</h1>
                    <p className="text-gray-500 mt-2 mb-8">Don’t worry, happens to all of us. Enter your email below to recover your password</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john.doe@gmail.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5065F6] outline-none"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#5065F6] text-white py-3 rounded-lg font-semibold hover:bg-[#4054e5] transition-all">
                            {loading ? "Sending..." : "Submit"}
                        </button>
                    </form>
                </div>
                {/* Illustration: Man thinking next to blue ID card */}
                <div className="hidden lg:flex justify-center">
                    <Image src="/forgot-password.png" alt="Forgot Password Illustration" width={600} height={600} className="object-contain" />
                </div>
            </div>
        </main>
    );
}