"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    Users, Activity, ArrowLeft, Clock, UserCheck, ShieldAlert, FileCheck, ExternalLink, CloudUpload, Loader2, X
} from 'lucide-react';

// IMPORT YOUR EXISTING PREVIEW COMPONENT
import LivePreview from '@/components/LivePreview';

export default function AdminDashboard() {
    const router = useRouter();
    const supabase = createClient();

    const [activeTab, setActiveTab] = useState<'Reports' | 'Feed'>('Reports');
    const [logs, setLogs] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [completedReports, setCompletedReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<string | null>(null);

    // STATE: Holds the report currently being previewed
    const [previewReport, setPreviewReport] = useState<any | null>(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const { data: profilesData } = await supabase.from('profiles').select('*');
            if (profilesData) setProfiles(profilesData);

            const { data: logsData } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
            if (logsData) setLogs(logsData);

            const { data: reportsData } = await supabase
                .from('reports')
                .select('*, profiles(full_name, department)')
                .eq('status', 'completed')
                .order('updated_at', { ascending: false });

            if (reportsData) setCompletedReports(reportsData);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(dateString));
    };

    // --- 👈 THE REAL API INTEGRATION ---
    const handlePushToDrive = async (reportId: string) => {
        setUploadingId(reportId);
        try {
            // Call the Next.js API route we built earlier
            // Note: Ensure this URL matches the exact folder path of your API route
            const response = await fetch('/api/drive/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to push to Google Drive");
            }

            alert(`Success! Report pushed to Christ University Google Drive.\n\nLink: ${data.link}`);

            // Refresh the dashboard to remove this report from the queue
            fetchAdminData();
        } catch (error: any) {
            console.error("Upload Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setUploadingId(null);
            setPreviewReport(null); // Safely close the modal if it was open
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] font-sans text-black relative overflow-x-hidden">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center space-x-6">
                    <button onClick={() => router.push('/home')} className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-200">
                        <ArrowLeft size={20} />
                    </button>
                    <Image src="/christ-logo.png" alt="Christ University" width={140} height={40} className="object-contain" />
                </div>
                <div className="flex items-center space-x-3">
                    <ShieldAlert size={20} className="text-red-500" />
                    <h1 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Department Admin</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto pt-8 px-6 pb-20">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                            <FileCheck size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-bold">Pending Review</p>
                            <h2 className="text-3xl font-black text-gray-900">{completedReports.length}</h2>
                        </div>
                    </div>
                    {/* ... other stats omitted for brevity, keep your existing ones! ... */}
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-2 mb-6 border-b border-gray-200">
                    <button onClick={() => setActiveTab('Reports')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'Reports' ? 'border-[#3b5998] text-[#3b5998]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                        Report Review Queue
                    </button>
                    <button onClick={() => setActiveTab('Feed')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'Feed' ? 'border-[#3b5998] text-[#3b5998]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                        Live Activity Feed
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Content Area */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">

                        {/* VIEW 1: REPORT REVIEW QUEUE */}
                        {activeTab === 'Reports' && (
                            <div className="flex-1 flex flex-col">
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <FileCheck size={20} className="text-[#3b5998]" /> Submitted Reports
                                    </h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {loading ? (
                                        <p className="text-center text-gray-400 font-medium py-10">Loading reports...</p>
                                    ) : completedReports.length === 0 ? (
                                        <p className="text-center text-gray-400 font-medium py-10">No completed reports awaiting review.</p>
                                    ) : (
                                        completedReports.map((report) => (
                                            <div key={report.id} className="border border-gray-200 rounded-2xl p-5 hover:border-[#3b5998] transition-colors flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{report.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Submitted by <span className="font-bold text-gray-700">{report.profiles?.full_name || 'Unknown'}</span> • {formatTime(report.updated_at)}
                                                    </p>
                                                </div>
                                                <div className="flex space-x-3">

                                                    {/* THE NEW PREVIEW TRIGGER */}
                                                    <button
                                                        onClick={() => setPreviewReport(report)}
                                                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 flex items-center gap-2 transition-colors"
                                                    >
                                                        <ExternalLink size={16} /> Review
                                                    </button>

                                                    <button
                                                        onClick={() => handlePushToDrive(report.id)}
                                                        disabled={uploadingId === report.id}
                                                        className="px-4 py-2 bg-[#3b5998] text-white rounded-xl text-sm font-bold hover:bg-[#2d4373] flex items-center gap-2 transition-colors disabled:opacity-70 w-[160px] justify-center"
                                                    >
                                                        {uploadingId === report.id ? (
                                                            <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                                                        ) : (
                                                            <><CloudUpload size={16} /> Push to Drive</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* VIEW 2: ACTIVITY FEED */}
                        {activeTab === 'Feed' && (
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Keep your existing feed map logic here */}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: User Directory */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                        {/* Keep your existing profiles map logic here */}
                    </div>
                </div>
            </main>

            {/* --- PDF PREVIEW MODAL --- */}
            {previewReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{previewReport.title}</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">
                                    Author: {previewReport.profiles?.full_name} • Dept: {previewReport.profiles?.department}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handlePushToDrive(previewReport.id)}
                                    disabled={uploadingId === previewReport.id}
                                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                                >
                                    {uploadingId === previewReport.id ? (
                                        <><Loader2 size={18} className="animate-spin" /> Uploading...</>
                                    ) : (
                                        <><CloudUpload size={18} /> Approve & Push</>
                                    )}
                                </button>
                                <button
                                    onClick={() => setPreviewReport(null)}
                                    className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: The PDF Viewer */}
                        <div className="flex-1 bg-gray-100 p-6 overflow-hidden">
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                                <LivePreview data={previewReport.data} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}