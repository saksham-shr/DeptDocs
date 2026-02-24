"use client";

import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ReportPDF } from './ReportPDF';

export default function LivePreview({ data }: { data: any }) {
    // We use two URLs to create a "Double Buffer" and eliminate flickering
    const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
    const [nextPdfUrl, setNextPdfUrl] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let objectUrl: string | null = null;
        setIsTyping(true);

        const generateDocument = async () => {
            try {
                // Compile the PDF in memory
                const blob = await pdf(<ReportPDF data={data} />).toBlob();
                objectUrl = URL.createObjectURL(blob);

                // Put the new URL in the "waiting room" (nextPdfUrl)
                setNextPdfUrl(objectUrl);
            } catch (error) {
                console.error("PDF Generation Error:", error);
            }
        };

        // Wait 800ms after the user STOPS typing before generating
        const timer = setTimeout(() => {
            setIsTyping(false);
            generateDocument();
        }, 800);

        return () => {
            clearTimeout(timer);
            // We do NOT revoke the active URL here, only the temporary ones to prevent memory leaks
        };
    }, [data]);

    return (
        <div className="h-full w-full bg-[#525659] rounded-xl overflow-hidden shadow-inner flex flex-col border border-gray-300 relative">

            {/* Status Indicator */}
            {isTyping && (
                <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest z-50 animate-pulse shadow-md">
                    Updating...
                </div>
            )}

            {/* Initializing State */}
            {!activePdfUrl && !nextPdfUrl && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs">
                    Initializing Engine...
                </div>
            )}

            {/* LAYER 1: The "Active" PDF that stays visible while the new one loads */}
            {activePdfUrl && (
                <iframe
                    src={`${activePdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="absolute inset-0 w-full h-full border-none z-10"
                    title="Active Preview"
                />
            )}

            {/* LAYER 2: The "Next" PDF that loads invisibly in the background */}
            {nextPdfUrl && (
                <iframe
                    src={`${nextPdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    // It stays invisible (z-0, opacity-0) until it finishes loading
                    className="absolute inset-0 w-full h-full border-none z-0 opacity-0"
                    title="Next Preview"
                    onLoad={() => {
                        // THE MAGIC TRICK: Once the background iframe finishes loading the new PDF, 
                        // we make it the Active PDF instantly. Zero white flashes.
                        setActivePdfUrl(nextPdfUrl);
                        setNextPdfUrl(null);
                    }}
                />
            )}
        </div>
    );
}