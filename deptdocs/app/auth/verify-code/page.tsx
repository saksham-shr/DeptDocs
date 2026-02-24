"use client";

import React, { useState, Suspense } from 'react'; // Added Suspense
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft } from 'lucide-react';

// 1. Move the search params logic into a child component
function VerifyCodeForm() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const router = useRouter();
    const supabase = createClient();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'recovery',
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push('/auth/reset-password');
        }
    };

    return (
        <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Enter Code</label>
                <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="7789BM6X"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5065F6] outline-none"
                />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#5065F6] text-white py-3 rounded-lg font-semibold">
                {loading ? "Verifying..." : "Verify"}
            </button>
        </form>
    );
}

// 2. Wrap that component in Suspense in the main page
export default function VerifyCodePage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-black">
                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <Link href="/login" className="flex items-center text-sm text-gray-600 hover:text-black mb-8">
                        <ChevronLeft size={16} /> Back to login
                    </Link>
                    <Image src="/christ-logo.png" alt="Logo" width={250} height={80} priority className="mb-8" />
                    <h1 className="text-4xl font-bold text-gray-900">Verify code</h1>
                    <p className="text-gray-500 mt-2 mb-8">An authentication code has been sent to your email.</p>

                    <Suspense fallback={<p>Loading...</p>}>
                        <VerifyCodeForm />
                    </Suspense>
                </div>
                <div className="hidden lg:flex justify-center">
                    <Image src="/verify-code-phone.png" alt="Illustration" width={400} height={700} className="object-contain" />
                </div>
            </div>
        </main>
    );
}