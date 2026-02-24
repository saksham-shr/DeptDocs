"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Home,
    FilePlus,
    FolderOpen,
    Search,
    UserCircle,
    FileText,
    User,
    Settings as SettingsIcon,
    LogOut
} from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F4F7FE] text-black font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#112a53] text-white flex flex-col shrink-0 relative z-50">
                <div className="p-6 flex items-center justify-center border-b border-white/10">
                    <Image
                        src="/christ-logo-white.png"
                        alt="Christ University"
                        width={160}
                        height={50}
                        className="brightness-0 invert object-contain"
                    />
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    {/* Active State (Home) */}
                    <button
                        onClick={() => router.push('/home')}
                        className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl bg-[#3168d8] text-white shadow-md transition-colors"
                    >
                        <Home size={20} />
                        <span className="font-medium text-sm">Home</span>
                    </button>

                    <button
                        onClick={() => router.push('/home/new')} // Make sure this matches your new form route
                        className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <FilePlus size={20} />
                        <span className="font-medium text-sm">New</span>
                    </button>

                    <button
                        onClick={() => router.push('/home/open')}
                        className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <FolderOpen size={20} />
                        <span className="font-medium text-sm">Open</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0 relative z-40">
                    <h2 className="text-gray-500 font-bold text-sm uppercase tracking-wider">
                        Department of AI, ML & Data Science
                    </h2>

                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Search size={24} />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="text-gray-500 hover:text-gray-900 transition-colors focus:outline-none flex items-center"
                            >
                                <UserCircle size={28} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 z-50">
                                    <button onClick={() => { setIsProfileOpen(false); router.push('/setting'); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3 text-sm font-medium text-gray-700">
                                        <User size={16} className="text-gray-400" /> <span>Profile</span>
                                    </button>
                                    <button onClick={() => { setIsProfileOpen(false); router.push('/setting'); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3 text-sm font-medium text-gray-700">
                                        <FileText size={16} className="text-gray-400" /> <span>Requests</span>
                                    </button>
                                    <button onClick={() => { setIsProfileOpen(false); router.push('/setting'); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center space-x-3 text-sm font-medium text-gray-700">
                                        <SettingsIcon size={16} className="text-gray-400" /> <span>Settings</span>
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            router.push('/');
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center space-x-3 text-sm font-medium text-red-600 transition-colors"
                                    >
                                        <LogOut size={16} /> <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Welcome Dashboard Content */}
                <main className="flex-1 p-12 overflow-y-auto flex items-center justify-center">

                    <div className="max-w-3xl w-full flex flex-col items-center text-center animate-in slide-in-from-bottom-4 fade-in duration-700 pb-20">
                        {/* Big Icon */}
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                            <FileText size={48} className="text-[#3168d8]" />
                        </div>

                        {/* Headings */}
                        <h1 className="text-5xl font-extrabold text-[#112a53] mb-6 tracking-tight">
                            Welcome to DeptDocs
                        </h1>
                        <p className="text-lg text-gray-500 mb-12 max-w-xl leading-relaxed">
                            A streamlined, real-time activity report generator built exclusively for the Department of AI, ML & Data Science.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button
                                onClick={() => router.push('/home/new')} // Adjust to your form route
                                className="bg-[#3168d8] hover:bg-[#2552b0] text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto justify-center"
                            >
                                <FilePlus size={24} />
                                <span>Create New Report</span>
                            </button>

                            <button
                                onClick={() => router.push('/home/open')}
                                className="bg-white border-2 border-gray-200 text-gray-700 hover:border-[#3168d8] hover:text-[#3168d8] px-8 py-4 rounded-2xl font-bold text-lg flex items-center space-x-3 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 w-full sm:w-auto justify-center"
                            >
                                <FolderOpen size={24} />
                                <span>Open Existing</span>
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}