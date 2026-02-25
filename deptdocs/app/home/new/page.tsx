"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

import ReportLayout from '@/components/ReportLayout';
import { logActivity } from '@/lib/logger';
import AssetManager from '@/components/forms/AssetManager';

import GeneralInfo from '@/components/forms/GeneralInfo';
import SpeakerDetails from '@/components/forms/SpeakerDetails';
import ParticipantProfile from '@/components/forms/ParticipantProfile';
import Synopsis from '@/components/forms/Synopsis';
import PreparedBy from '@/components/forms/PreparedBy';
import SpeakerProfile from '@/components/forms/SpeakerProfile';
import ActivityPhotos from '@/components/forms/ActivityPhotos';
import AttendanceList from '@/components/forms/AttendanceList';
import Brochure from '@/components/forms/Brochure';
import NoticeApproval from '@/components/forms/NoticeApproval';
import FeedbackAnalysis from '@/components/forms/FeedbackAnalysis';

import {
    FileText,
    UserCircle,
    Users,
    AlignLeft,
    ClipboardCheck,
    Camera,
    ListChecks,
    BookOpen,
    ShieldCheck,
    BarChart3
} from 'lucide-react';

function ReportEditorContent() {
    // Supabase initialization
    const supabase = createClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const existingId = searchParams.get('id');

    const [reportId, setReportId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Toggle state between Form Editor and Asset Manager Views
    const [viewMode, setViewMode] = useState<'editor' | 'assets'>('editor');

    // State to track the active sidebar section
    const [activeSection, setActiveSection] = useState('General Information');

    // Master state for all report data - RESTORED FULL FORMATTING
    const [reportData, setReportData] = useState({
        // General Info
        activityTitle: '',
        activityType: '',
        subCategory: '',
        venue: '',
        collaboration: '',

        // Dynamic Lists
        speakers: [{
            id: Date.now(),
            name: '',
            title: '',
            organization: '',
            contact: '',
            presentation: '',
            about: '',
            photoUrl: ''
        }],
        participantProfiles: [
            { id: 1, type: 'Student', count: '' },
            { id: 2, type: 'Faculty', count: '' },
            { id: 3, type: 'Research Scholar', count: '' }
        ],

        // Synopsis
        highlights: '',
        takeaways: '',
        summary: '',
        followUp: '',

        // Prepared By
        preparedByName: '',
        preparedByDesignation: '',
        preparedBySignature: '',
        useProfile: false,
        useCollaborators: false,

        // File Uploads
        activityPhotos: [] as any[],  // Stores {id, url, caption}
        attendanceFiles: [] as any[], // Stores {id, name, type, url}
        brochureFiles: [] as any[],   // Stores {id, name, type, url}
        approvalFiles: [] as any[],   // Stores {id, name, type, url}
        feedbackFiles: [] as any[]    // Stores {id, name, type, url}
    });

    // --- FETCH EXISTING REPORT ON LOAD ---
    useEffect(() => {
        if (existingId) {
            const loadReport = async () => {
                const { data, error } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('id', existingId)
                    .single();

                if (data && !error) {
                    setReportId(data.id);
                    // Load the saved JSON back into the form state!
                    if (data.data) {
                        setReportData((prev) => ({ ...prev, ...data.data }));
                    }
                } else if (error) {
                    console.error("Error loading report:", error);
                }
            };
            loadReport();
        }
    }, [existingId, supabase]);

    const handleDataUpdate = (newData: any) => {
        setReportData((prev) => ({ ...prev, ...newData }));
    };

    // --- AI & ASSET HANDLERS ---
    const handleFilesUpdated = (type: string, updatedFiles: any[]) => {
        setReportData((prev) => ({
            ...prev,
            [type]: updatedFiles
        }));
    };

    const handleAiData = (extracted: any) => {
        setReportData((prev) => ({
            ...prev,
            activityTitle: extracted.title || prev.activityTitle,
            activityType: extracted.activityType || prev.activityType,
            venue: extracted.venue || prev.venue,
            summary: extracted.description?.summary || prev.summary,
            highlights: extracted.description?.highlights || prev.highlights,
            takeaways: extracted.description?.takeaways || prev.takeaways,
            participantProfiles: prev.participantProfiles.map((profile) => {
                if (profile.type === 'Student') return { ...profile, count: extracted.participants?.student?.toString() || profile.count };
                if (profile.type === 'Faculty') return { ...profile, count: extracted.participants?.faculty?.toString() || profile.count };
                if (profile.type === 'Research Scholar') return { ...profile, count: extracted.participants?.scholar?.toString() || profile.count };
                return profile;
            })
        }));
        // Auto-switch back to the editor so the user can see the AI results immediately
        setViewMode('editor');
    };

    // --- 1. DRAFT SAVE FUNCTION (Keeps status as 'draft') ---
    const handleSaveDraft = async (currentData: any) => {
        setIsSaving(true);

        try {
            // Get the currently logged-in user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                alert("You must be logged in to save drafts.");
                setIsSaving(false);
                return;
            }

            // Prepare the payload matching our new SQL schema
            const reportTitle = currentData.activityTitle?.trim() || "Untitled Report";

            const payload = {
                owner_id: user.id,
                title: reportTitle,
                data: currentData,
                status: 'draft'
            };

            // Insert or Update
            if (reportId) {
                // UPDATE existing draft
                const { error } = await supabase
                    .from('reports')
                    .update({ ...payload, updated_at: new Date().toISOString() })
                    .eq('id', reportId);

                if (error) throw error;

                // Activity Logging
                await logActivity(
                    'REPORT_SAVED',
                    `Saved draft: ${reportTitle}`,
                    reportId
                );

                alert("Draft updated successfully!");

            } else {
                // INSERT new draft
                const { data, error } = await supabase
                    .from('reports')
                    .insert([payload])
                    .select('id')
                    .single();

                if (error) throw error;

                // Save the new DB ID so future clicks update this exact row
                if (data) {
                    setReportId(data.id);

                    // Activity Logging
                    await logActivity(
                        'REPORT_SAVED',
                        `Saved draft: ${reportTitle}`,
                        data.id
                    );
                }
                alert("New draft saved successfully!");
            }

        } catch (error: any) {
            console.error("Error saving draft:", error.message);
            alert("Failed to save draft. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- 2. SUBMIT FUNCTION (Changes status to 'completed') ---
    const handleMarkCompleted = async (currentData: any) => {
        if (!confirm("Are you sure you want to submit this report for admin review? You will not be able to edit it once submitted.")) {
            return;
        }

        setIsSaving(true);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                alert("You must be logged in to submit reports.");
                return;
            }

            const reportTitle = currentData.activityTitle?.trim() || "Untitled Report";

            // Set status to 'completed' so it shows up in AdminDashboard
            const payload = {
                owner_id: user.id,
                title: reportTitle,
                data: currentData,
                status: 'completed'
            };

            if (reportId) {
                const { error } = await supabase
                    .from('reports')
                    .update({ ...payload, updated_at: new Date().toISOString() })
                    .eq('id', reportId);

                if (error) throw error;
                await logActivity('REPORT_COMPLETED', `Submitted for review: ${reportTitle}`, reportId);
            } else {
                const { data, error } = await supabase
                    .from('reports')
                    .insert([payload])
                    .select('id')
                    .single();

                if (error) throw error;
                if (data) {
                    await logActivity('REPORT_COMPLETED', `Submitted for review: ${reportTitle}`, data.id);
                }
            }

            alert("Report successfully submitted for review!");
            router.push('/home'); // Redirect to dashboard after submitting

        } catch (error: any) {
            console.error("Error submitting report:", error.message);
            alert("Failed to submit report.");
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { name: 'General Information', icon: FileText },
        { name: 'Speaker/Guest Details', icon: UserCircle },
        { name: 'Participants Profile', icon: Users },
        { name: 'Synopsis', icon: AlignLeft },
        { name: 'Report Prepared By', icon: ClipboardCheck },
        { name: 'Speaker Profile', icon: UserCircle },
        { name: 'Activity Photos', icon: Camera },
        { name: 'Attendance List', icon: ListChecks },
        { name: 'Brochure', icon: BookOpen },
        { name: 'Notice for Approval', icon: ShieldCheck },
        { name: 'Feedback Analysis', icon: BarChart3 },
    ];

    return (
        <ReportLayout
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            sections={sections}
            previewData={reportData}
            onSaveDraft={handleSaveDraft}
            onMarkCompleted={handleMarkCompleted}
            reportId={reportId}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
        >
            {/* CONTENT AREA */}
            {viewMode === 'assets' ? (
                <AssetManager
                    reportId={reportId}
                    onDataExtracted={handleAiData}
                    onFilesUpdated={handleFilesUpdated}
                    currentFiles={{
                        activityPhotos: reportData.activityPhotos,
                        brochureFiles: reportData.brochureFiles,
                        attendanceFiles: reportData.attendanceFiles,
                        approvalFiles: reportData.approvalFiles,
                        feedbackFiles: reportData.feedbackFiles
                    }}
                />
            ) : (
                <div className="space-y-6">
                    {/* 1. General Information */}
                    {activeSection === 'General Information' && (
                        <GeneralInfo
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Speaker/Guest Details')}
                        />
                    )}

                    {/* 2. Speaker/Guest Details */}
                    {activeSection === 'Speaker/Guest Details' && (
                        <SpeakerDetails
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Participants Profile')}
                        />
                    )}

                    {/* 3. Participants Profile */}
                    {activeSection === 'Participants Profile' && (
                        <ParticipantProfile
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Synopsis')}
                        />
                    )}

                    {/* 4. Synopsis */}
                    {activeSection === 'Synopsis' && (
                        <Synopsis
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Report Prepared By')}
                        />
                    )}

                    {/* 5. Report Prepared By */}
                    {activeSection === 'Report Prepared By' && (
                        <PreparedBy
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Speaker Profile')}
                        />
                    )}

                    {/* 6. Speaker Profile */}
                    {activeSection === 'Speaker Profile' && (
                        <SpeakerProfile
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Activity Photos')}
                        />
                    )}

                    {/* 7. Activity Photos */}
                    {activeSection === 'Activity Photos' && (
                        <ActivityPhotos
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Attendance List')}
                        />
                    )}

                    {/* 8. Attendance List */}
                    {activeSection === 'Attendance List' && (
                        <AttendanceList
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Brochure')}
                        />
                    )}

                    {/* 9. Brochure */}
                    {activeSection === 'Brochure' && (
                        <Brochure
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Notice for Approval')}
                        />
                    )}

                    {/* 10. Notice for Approval */}
                    {activeSection === 'Notice for Approval' && (
                        <NoticeApproval
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onNext={() => setActiveSection('Feedback Analysis')}
                        />
                    )}

                    {/* 11. Feedback Analysis */}
                    {activeSection === 'Feedback Analysis' && (
                        <FeedbackAnalysis
                            data={reportData}
                            onUpdate={handleDataUpdate}
                            onFinish={() => handleMarkCompleted(reportData)}
                        />
                    )}
                </div>
            )}
        </ReportLayout>
    );
}

// 2. Create a new default export that wraps the content in Suspense
export default function NewReportPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-[#F4F7FE] text-gray-500 font-medium">
                Loading editor...
            </div>
        }>
            <ReportEditorContent />
        </Suspense>
    );
}