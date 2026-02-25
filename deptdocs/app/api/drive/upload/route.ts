import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';

// Import your PDF template
import { ReportPDF } from '@/components/ReportPDF';

// Use Service Role Key to bypass RLS for server-side operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { reportId } = await req.json();

        if (!reportId) {
            return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
        }

        // 1. Check for Service Account Key in Environment Variables (Vercel Safe)
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
            return NextResponse.json({ error: "Server missing GOOGLE_SERVICE_ACCOUNT_KEY env variable." }, { status: 500 });
        }

        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

        // 2. Fetch the report data from Supabase
        const { data: report, error: dbError } = await supabase
            .from('reports')
            .select('*, profiles(full_name, department)')
            .eq('id', reportId)
            .single();

        if (dbError || !report) {
            throw new Error("Could not fetch report data from database.");
        }

        // 3. Generate the PDF stream on the server
        const element = React.createElement(ReportPDF, { data: report.data }) as unknown as React.ReactElement<any>;
        const pdfStream = await renderToStream(element);

        // 4. Authenticate with Google Drive using the parsed credentials
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const drive = google.drive({ version: 'v3', auth });

        // 5. Verify Folder ID
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId || folderId === 'placeholder_for_now') {
            return NextResponse.json({ error: "Missing GOOGLE_DRIVE_FOLDER_ID." }, { status: 500 });
        }

        // 6. Upload to Google Drive
        const fileName = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${report.profiles?.full_name?.replace(/\s+/g, '')}.pdf`;

        const driveResponse = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
            },
            media: {
                mimeType: 'application/pdf',
                body: pdfStream,
            },
            fields: 'id, webViewLink',
        });

        // 7. Store the Drive Link instead of changing status to 'published'
        // This avoids the Postgres CHECK constraint error
        const updatedData = { ...report.data, drive_link: driveResponse.data.webViewLink };

        await supabase
            .from('reports')
            .update({ data: updatedData }) // Save the link inside the JSONB payload
            .eq('id', reportId);

        return NextResponse.json({
            success: true,
            fileId: driveResponse.data.id,
            link: driveResponse.data.webViewLink
        });

    } catch (error: any) {
        console.error("Drive Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to push to Google Drive" }, { status: 500 });
    }
}