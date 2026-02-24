"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Home, FolderOpen, Save, UserPlus, Download, Menu, Eye, UserCircle, X, AlertCircle, FileText, File as FileWord, CheckCircle, User, Settings as SettingsIcon, LogOut
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';

// IMPORT THE NEW PDF COMPONENT WE CREATED
import LivePreview from './LivePreview';
// IMPORT THE PDF TEMPLATE FOR DOWNLOADING
import { ReportPDF } from './ReportPDF';
// IMPORT THE NEW REUSABLE MANAGE ACCESS MODAL
import ManageAccessModal from './ManageAccessModal';

interface Props {
    children: React.ReactNode;
    activeSection: string;
    onSectionChange: (name: string) => void;
    sections: any[];
    previewData: any;
    onSaveDraft?: (data: any) => void;
    onMarkCompleted?: (data: any) => void;
    reportId?: string | null; // <--- ADDED THIS LINE
}

export default function ReportLayout({ children, activeSection, onSectionChange, sections, previewData, onSaveDraft, onMarkCompleted, reportId }: Props) { // <--- DESTRUCTURED IT HERE
    const router = useRouter();

    // Modal & Menu States
    const [showCollabModal, setShowCollabModal] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Profile Dropdown State
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // 1. Validation Logic
    const isReportComplete = () => {
        const requiredFields = [previewData.activityTitle, previewData.activityType, previewData.date];
        return requiredFields.every(field => field && field.toString().trim() !== "");
    };

    // 2. Download Handlers
    const handleDownloadClick = () => {
        if (!isReportComplete()) {
            setShowWarningModal(true);
            setShowDownloadMenu(false);
        } else {
            setShowDownloadMenu(!showDownloadMenu);
        }
    };

    const handleProceedToDownload = () => {
        setShowWarningModal(false);
        setShowDownloadMenu(true);
    };

    const downloadAsPDF = async () => {
        setIsDownloading(true);
        try {
            const blob = await pdf(<ReportPDF data={previewData} />).toBlob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${previewData.activityTitle ? previewData.activityTitle.replace(/\s+/g, '_') : 'Activity'}_Report.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Error generating PDF. Please check your data.");
        } finally {
            setIsDownloading(false);
            setShowDownloadMenu(false);
        }
    };

    const downloadAsDocs = () => {
        alert("DOCX generation feature coming soon!");
        setShowDownloadMenu(false);
    };

    return (
        <div className="flex h-screen bg-[#F4F7FE] text-black overflow-hidden font-sans">

            {/* COLUMN 1: UTILITY BAR */}
            <aside className="w-16 bg-[#0B2244] flex flex-col items-center py-6 shrink-0 space-y-8 border-r border-white/5 relative z-50">
                <button className="text-white/60 hover:text-white transition-colors" title="Menu"><Menu size={24} /></button>

                {/* Routing Buttons */}
                <button onClick={() => router.push('/home')} className="text-white/60 hover:text-white transition-colors" title="Home"><Home size={24} /></button>
                <button onClick={() => router.push('/home/open')} className="text-white/60 hover:text-white transition-colors" title="Completed Reports"><FolderOpen size={24} /></button>

                {/* Action Buttons */}
                <button onClick={() => onSaveDraft && onSaveDraft(previewData)} className="text-white/60 hover:text-white transition-colors" title="Save Draft"><Save size={24} /></button>
                <button onClick={() => onMarkCompleted && onMarkCompleted(previewData)} className="text-white/60 hover:text-green-400 transition-colors" title="Mark as Completed"><CheckCircle size={24} /></button>
                <button onClick={() => setShowCollabModal(true)} className="text-white/60 hover:text-white transition-colors" title="Add Collaborator"><UserPlus size={24} /></button>

                {/* Download Menu */}
                <div className="relative flex flex-col items-center">
                    <button onClick={handleDownloadClick} className="text-white/60 hover:text-white transition-colors" title="Download"><Download size={24} /></button>

                    {showDownloadMenu && (
                        <div className="absolute left-14 top-0 bg-white shadow-xl rounded-xl py-2 w-48 border border-gray-100 animate-in fade-in zoom-in-95">
                            <button onClick={downloadAsPDF} disabled={isDownloading} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                                <FileText size={16} className="text-red-500" />
                                <span className="font-medium">{isDownloading ? "Generating..." : "Download PDF"}</span>
                            </button>
                            <button onClick={downloadAsDocs} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 border-t border-gray-50">
                                <FileWord size={16} className="text-blue-600" />
                                <span className="font-medium">Download Word</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* COLUMN 2: SECTION NAVIGATION */}
            <aside className="w-64 bg-[#1a365d] text-white flex flex-col shrink-0">
                <div className="p-6 border-b border-white/10 flex justify-center">
                    <Image src="/christ-logo-white.png" alt="Christ University" width={150} height={40} className="brightness-0 invert object-contain" />
                </div>
                <nav className="flex-1 py-4 overflow-y-auto">
                    {sections.map((sec) => (
                        <button
                            key={sec.name}
                            onClick={() => onSectionChange(sec.name)}
                            className={`w-full flex items-center space-x-3 px-6 py-4 transition-all text-xs font-medium text-left ${activeSection === sec.name ? 'bg-[#3b5998] border-l-4 border-white' : 'hover:bg-white/5 opacity-60'}`}
                        >
                            <sec.icon size={16} />
                            <span>{sec.name}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* RIGHT AREA: HEADER + FORM + PREVIEW */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-14 bg-white border-b flex items-center justify-between px-8 shrink-0 relative z-40">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                        {previewData.activityTitle || "Untitled Activity Report"}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-500 hover:bg-gray-200 transition-colors">
                            <span>LIVE PREVIEW</span>
                            <Eye size={14} />
                        </button>

                        {/* Clickable Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 hover:ring-2 hover:ring-gray-300 transition-all focus:outline-none"
                            >
                                <UserCircle size={20} className="text-gray-500" />
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
                                            router.push('/'); // Navigate to Login/Home
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

                <main className="flex-1 p-6 flex space-x-6 overflow-hidden">
                    <div className="w-[450px] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
                        <div className="flex border-b shrink-0">
                            <button className="px-8 py-3 bg-[#3b5998] text-white font-bold text-[10px] uppercase tracking-wider">Form Editor</button>
                            <button className="px-8 py-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider hover:bg-gray-50">Settings</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">{children}</div>
                    </div>

                    <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 shrink-0">
                            Real-Time PDF Preview
                        </span>
                        <div className="flex-1 overflow-hidden rounded-xl border border-gray-200">
                            <LivePreview data={previewData} />
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODALS --- */}
            <ManageAccessModal
                isOpen={showCollabModal}
                onClose={() => setShowCollabModal(false)}
                reportId={reportId} // <--- AND PASSED IT HERE!
            />

            {showWarningModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl text-center animate-in fade-in zoom-in-95">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Report Incomplete</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            Some essential fields are still blank. Do you want to return to the editor, or proceed to download anyway?
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-sm active:scale-95"
                            >
                                Return
                            </button>
                            <button
                                onClick={handleProceedToDownload}
                                className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md active:scale-95"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}