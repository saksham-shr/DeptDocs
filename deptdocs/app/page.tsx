"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page after 2.5 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2500);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7FE] p-6 font-sans overflow-hidden">
      <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">

        {/* DeptDocs Custom Logo */}
        <div className="mb-6 drop-shadow-md">
          <Image
            src="/deptdocs-logo.png"
            alt="DeptDocs Logo"
            width={120}
            height={120}
            priority
            className="object-contain rounded-full border-4 border-white shadow-sm"
          />
        </div>

        {/* App Title */}
        <h1 className="text-5xl font-extrabold text-[#112a53] tracking-tight mb-4">
          DeptDocs
        </h1>

        {/* Animated Line */}
        <div className="h-1.5 w-16 bg-[#3168d8] rounded-full mb-6 animate-pulse"></div>

        {/* Subtitle */}
        <p className="text-sm font-bold text-gray-500 tracking-widest uppercase text-center">
          Department of AI, ML & Data Science
        </p>

      </div>
    </main>
  );
}