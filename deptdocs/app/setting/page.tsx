"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    User, Settings as SettingsIcon, LogOut, FileText, Edit,
    Bell, Lock, Settings2, Check, UserCircle, ArrowLeft, UploadCloud, Loader2
} from 'lucide-react';
import ManageAccessModal from '@/components/ManageAccessModal';
import { createClient } from '@/utils/supabase/client';

// --- SUB-COMPONENTS ---

const ProfileTab = ({ profile, setProfile, onSave, isSaving, onUploadSignature, isUploading }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex items-start space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-white shrink-0 overflow-hidden relative">
                    {/* Placeholder for future Profile Picture upload */}
                    <UserCircle size={64} strokeWidth={1} />
                </div>
                <div className="flex flex-col pt-2">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.full_name || 'Your Name'}</h2>
                    <span className="text-sm text-gray-500 font-medium">{profile.designation || 'Designation'} &gt;</span>
                    <span className="text-sm text-gray-500 font-medium mb-2">{profile.department || 'Department'} &gt;</span>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{profile.email}</span>
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 rounded-2xl p-6 bg-white/50">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700">Name</label>
                            <Edit size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={profile.full_name || ''}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#3b5998]"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700">Designation</label>
                            <Edit size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={profile.designation || ''}
                            onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#3b5998]"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700">Department</label>
                            <Edit size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={profile.department || ''}
                            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#3b5998]"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700">Email (Read Only)</label>
                            <Lock size={14} className="text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={profile.email || ''}
                            disabled
                            className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Digital Signature Section */}
                    <div className="space-y-2 col-span-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-gray-700">Digital Signature</label>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 text-sm hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden"
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center text-[#3b5998]">
                                    <Loader2 className="animate-spin mb-2" size={24} />
                                    <span>Uploading...</span>
                                </div>
                            ) : profile.signature_url ? (
                                <Image src={profile.signature_url} alt="Signature" fill className="object-contain p-2" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <UploadCloud size={24} className="mb-2" />
                                    <span>Click to upload signature image</span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={onUploadSignature}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        {profile.signature_url && (
                            <p className="text-xs text-right text-gray-400 mt-1">Click the image to replace</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="mt-8 bg-[#3b5998] text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#2d4373] transition-colors shadow-sm active:scale-95 disabled:opacity-70"
                >
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

// ... (RequestsTab and SettingsTab remain exactly as they were in your previous code)
const RequestsTab = () => (
    <div className="animate-in fade-in duration-300">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
                        <UserCircle size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Neil Shah</h3>
                        <p className="text-sm text-gray-500">neil.shah@email.com</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors">
                        <Check size={16} /><span>Accept</span>
                    </button>
                    <button className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Dismiss
                    </button>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-[#3b5998] font-bold text-lg">Budget Report</h4>
                <p className="text-sm text-gray-400 font-medium mt-1">1 of 1 Request</p>
            </div>
        </div>
    </div>
);

const SettingsTab = ({ onOpenAccessModal, router }: any) => {
    const Toggle = ({ active }: { active: boolean }) => (
        <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${active ? 'bg-[#3b5998]' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    );

    return (
        <div className="animate-in fade-in duration-300 space-y-8">
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Account Settings</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
                        <div className="flex items-center space-x-3">
                            <Lock size={20} className="text-[#3b5998]" />
                            <span className="font-bold text-gray-700">Change Password</span>
                        </div>
                        <button onClick={() => router.push('/setting/change-password')} className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            Change
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
                        <div className="flex items-center space-x-3">
                            <Bell size={20} className="text-[#3b5998]" />
                            <div>
                                <span className="font-bold text-gray-700 block">Manage Notifications</span>
                                <span className="text-xs text-gray-400">Receive emails and push notifications</span>
                            </div>
                        </div>
                        <Toggle active={true} />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">Manage Access</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
                    <div className="flex items-center space-x-3">
                        <Settings2 size={20} className="text-[#3b5998]" />
                        <span className="font-bold text-gray-700">Add / Remove Collaborators</span>
                    </div>
                    <button onClick={onOpenAccessModal} className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

export default function ProfileDashboard() {
    const router = useRouter();
    const supabase = createClient();

    // UI State
    const [activeTab, setActiveTab] = useState<'Profile' | 'Requests' | 'Settings'>('Profile');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

    // Data State
    const [profile, setProfile] = useState({ id: '', full_name: '', designation: '', department: '', email: '', signature_url: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const tabs = ['Profile', 'Requests', 'Settings'];

    useEffect(() => {
        loadProfile();
    }, []);

    // 1. Fetch existing profile details
    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
            }
        }
    };

    // 2. Handle Signature Image Upload
    const handleUploadSignature = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile.id) return;

        setIsUploading(true);
        try {
            // Upload to Supabase Storage ('signatures' bucket)
            const fileExt = file.name.split('.').pop();
            const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('signatures')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('signatures')
                .getPublicUrl(filePath);

            // Update local state and save directly to DB
            setProfile(prev => ({ ...prev, signature_url: publicUrl }));

            await supabase
                .from('profiles')
                .update({ signature_url: publicUrl })
                .eq('id', profile.id);

            alert("Signature uploaded successfully!");

        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Failed to upload signature.");
        } finally {
            setIsUploading(false);
        }
    };

    // 3. Save Text Changes
    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    designation: profile.designation,
                    department: profile.department
                })
                .eq('id', profile.id);

            if (error) throw error;
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] font-sans">
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center space-x-6">
                    <button onClick={() => router.back()} className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors" title="Go Back">
                        <ArrowLeft size={20} />
                    </button>
                    <Image src="/christ-logo.png" alt="Christ University" width={140} height={40} className="object-contain" />
                </div>

                <h1 className="text-sm font-bold text-gray-500 hidden md:block tracking-wide">
                    Department of AI, ML & Data Science
                </h1>

                <div className="relative">
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:ring-2 hover:ring-gray-300 transition-all">
                        <UserCircle size={24} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                            <button onClick={() => { setActiveTab('Profile'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 text-sm font-medium text-gray-700">
                                <User size={16} /> <span>Profile</span>
                            </button>
                            <button onClick={() => { setActiveTab('Requests'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 text-sm font-medium text-gray-700">
                                <FileText size={16} /> <span>Requests</span>
                            </button>
                            <button onClick={() => { setActiveTab('Settings'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3 text-sm font-medium text-gray-700">
                                <SettingsIcon size={16} /> <span>Settings</span>
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-3 text-sm font-medium text-red-600 transition-colors">
                                <LogOut size={16} /> <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-4xl mx-auto pt-10 px-6 pb-20">
                <div className="flex bg-gray-200/60 p-1 rounded-full w-fit mb-8 shadow-inner">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#3b5998] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                    {activeTab === 'Profile' && (
                        <ProfileTab
                            profile={profile}
                            setProfile={setProfile}
                            onSave={handleSaveProfile}
                            isSaving={isSaving}
                            onUploadSignature={handleUploadSignature}
                            isUploading={isUploading}
                        />
                    )}
                    {activeTab === 'Requests' && <RequestsTab />}
                    {activeTab === 'Settings' && <SettingsTab onOpenAccessModal={() => setIsAccessModalOpen(true)} router={router} />}
                </div>
            </main>

            <ManageAccessModal isOpen={isAccessModalOpen} onClose={() => setIsAccessModalOpen(false)} />
        </div>
    );
}