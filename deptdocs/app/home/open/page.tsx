"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Home, FileText, FolderOpen, Search, UserCircle, Menu, Users, FileEdit
} from 'lucide-react';
import ManageAccessModal from '@/components/ManageAccessModal';
import { createClient } from '@/utils/supabase/client';

export default function OpenFileDashboard() {
    const router = useRouter();
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState<'Recent' | 'Drafts' | 'Completed' | 'Shared' | 'Upload'>('Recent');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

    // NEW: Track which report was clicked for the access modal
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    // Dynamic Database State
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs = ['Recent', 'Drafts', 'Completed', 'Shared', 'Upload'];

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/');
            return;
        }

        // Fetch reports owned by the logged-in user, newest first
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('updated_at', { ascending: false });

        if (!error && data) {
            setReports(data);
        }
        setLoading(false);
    };

    // Filter logic based on tabs
    const getFilteredReports = () => {
        if (activeTab === 'Recent') return reports;
        if (activeTab === 'Drafts') return reports.filter(r => r.status === 'draft');
        if (activeTab === 'Completed') return reports.filter(r => r.status === 'completed');
        // 'Shared' will be populated later when we link the collaborators table
        if (activeTab === 'Shared') return [];
        return reports; // Fallback for 'Upload' or others
    };

    const handleOpenReport = (id: string) => {
        router.push(`/home/new?id=${id}`); // Route to editor with the ID
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const filteredReports = getFilteredReports();

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden text-gray-900">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#112a53] text-white flex flex-col shrink-0 relative z-50">
                <div className="p-6 flex items-start space-x-4">
                    <button className="text-white/70 hover:text-white mt-1">
                        <Menu size={24} />
                    </button>
                    <Image
                        src="/christ-logo-white.png"
                        alt="Christ University"
                        width={140}
                        height={40}
                        className="brightness-0 invert object-contain"
                    />
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <button onClick={() => router.push('/home')} className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                        <Home size={20} />
                        <span>Home</span>
                    </button>

                    <button onClick={() => router.push('/home/new')} className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                        <FileText size={20} />
                        <span>New</span>
                    </button>

                    <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium bg-[#3168d8] text-white shadow-md transition-colors">
                        <FolderOpen size={20} />
                        <span>Open</span>
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                <div className="bg-gray-100 text-center py-1.5 text-xs font-bold text-gray-500 tracking-wide border-b border-gray-200">
                    Department of AI, ML & Data Science
                </div>

                <header className="px-10 py-8 flex items-center justify-between shrink-0">
                    <h1 className="text-3xl font-bold text-[#112a53]">Open a file</h1>

                    <div className="flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                            <Search size={24} />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none">
                                <UserCircle size={28} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 z-50">
                                    <button onClick={() => router.push('/setting')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">Profile</button>
                                    <button onClick={() => router.push('/setting')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">Requests</button>
                                    <button onClick={() => router.push('/setting')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">Settings</button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600">Log Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-10 flex flex-col overflow-hidden">

                    {/* Centered Tabs */}
                    <div className="flex justify-center border-b border-gray-200 mb-6 shrink-0">
                        <div className="flex space-x-12">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#3168d8]' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3168d8] rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Area */}
                    <div className="flex-1 bg-white border border-gray-200 rounded-t-xl shadow-sm overflow-hidden flex flex-col">

                        {/* Table Header */}
                        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-6 py-4 shrink-0">
                            <div className="text-sm font-bold text-gray-700">Name</div>
                            <div className="text-sm font-bold text-gray-700">Date Modified</div>
                            <div className="text-sm font-bold text-gray-700">Status</div>
                            <div className="text-sm font-bold text-gray-700 text-center">Manage Access</div>
                        </div>

                        {/* Table Body (Scrollable) */}
                        <div className="flex-1 overflow-y-auto">

                            {loading ? (
                                <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                                    Loading your files...
                                </div>
                            ) : filteredReports.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <FolderOpen size={48} className="mb-4 opacity-50" />
                                    <p>No files found in {activeTab}</p>
                                </div>
                            ) : (
                                filteredReports.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => handleOpenReport(file.id)}
                                        className="grid grid-cols-4 items-center border-b border-gray-100 px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                                    >
                                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-3">
                                            <FileEdit size={16} className="text-[#3168d8]" />
                                            <span className="truncate pr-4">{file.title || "Untitled Report"}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(file.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${file.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {file.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents the row click from triggering
                                                    setSelectedReportId(file.id); // Set the ID for the modal!
                                                    setIsAccessModalOpen(true);
                                                }}
                                                className="text-xs font-bold text-[#3168d8] bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                Manage Access
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <ManageAccessModal
                isOpen={isAccessModalOpen}
                onClose={() => {
                    setIsAccessModalOpen(false);
                    setSelectedReportId(null); // Clear it when closing
                }}
                reportId={selectedReportId} // Pass the ID into the modal
            />
        </div>
    );
}