"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, X, FileSpreadsheet, File as FileIcon, Image as ImageIcon } from 'lucide-react';

export default function AttendanceList({ data, onUpdate }: any) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Initialize files array from state or empty
  const files = data.attendanceFiles || [];

  // Handle Drag Events for styling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    let selectedFiles;
    if ('dataTransfer' in e) {
      selectedFiles = Array.from((e as React.DragEvent).dataTransfer.files);
    } else {
      selectedFiles = (e as React.ChangeEvent<HTMLInputElement>).target.files
        ? Array.from((e as React.ChangeEvent<HTMLInputElement>).target.files!)
        : [];
    }

    if (selectedFiles.length === 0) return;

    setIsProcessing(true);

    try {
      const processedFiles = await Promise.all(selectedFiles.map(async (file) => {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        let pages: string[] = [];
        let parsedData: any = null;

        // CASE 1: Image (Convert to Base64 for React-PDF)
        if (['jpg', 'jpeg', 'png'].includes(fileType || '')) {
          const base64String = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          pages = [base64String];
        }

        // CASE 2: Excel/Spreadsheet (Parse to JSON)
        else if (fileType === 'xlsx' || fileType === 'csv') {
          parsedData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const bstr = evt.target?.result;
              const wb = XLSX.read(bstr, { type: 'binary' });
              const wsname = wb.SheetNames[0];
              const ws = wb.Sheets[wsname];
              resolve(XLSX.utils.sheet_to_json(ws));
            };
            reader.readAsBinaryString(file);
          });
        }

        // CASE 3: PDF (Convert pages to Base64 images - DYNAMICALLY IMPORTED)
        else if (fileType === 'pdf') {
          // Dynamically import PDF.js ONLY when a user uploads a PDF
          const pdfjs = await import('pdfjs-dist');
          pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;

          // Loop through every page in the uploaded PDF
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);

            // scale: 2.0 ensures the text remains crisp when embedded into the final report
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // FIX: Using 'as any' bypasses strict RenderParameters Type Error
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            await page.render(renderContext as any).promise;

            // Extract the canvas drawing as a base64 PNG image
            pages.push(canvas.toDataURL('image/png'));
          }
        }

        return {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type: fileType,
          pages: pages,       // Holds Base64 images (from JPG/PNGs or converted PDFs)
          jsonData: parsedData // Holds JSON rows (from Excel)
        };
      }));

      // Append new files to existing ones and update parent state
      onUpdate({ attendanceFiles: [...files, ...processedFiles] });

    } catch (error) {
      console.error("Error processing files:", error);
      alert("Failed to process some files. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove a file from the list
  const removeFile = (idToRemove: string) => {
    const updatedFiles = files.filter((f: any) => f.id !== idToRemove);
    onUpdate({ attendanceFiles: updatedFiles });
  };

  // Get the right icon based on file type
  const getFileIcon = (type: string) => {
    if (['xlsx', 'csv'].includes(type)) return <FileSpreadsheet size={20} className="text-green-600" />;
    if (['jpg', 'jpeg', 'png'].includes(type)) return <ImageIcon size={20} className="text-blue-500" />;
    return <FileIcon size={20} className="text-red-500" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Attendance List</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Upload scanned attendance sheets, images, or export Excel data.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="space-y-3">
        <div
          className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all group
                        ${dragActive ? 'border-[#4F65F6] bg-[#4F65F6]/5' : 'border-gray-200 bg-gray-50/30 hover:border-[#4F65F6]'}`}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleFileChange}
        >
          <input
            id="attendance-upload"
            name="attendance_upload"
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
            accept=".jpg,.jpeg,.png,.pdf,.xlsx,.csv"
            onChange={handleFileChange}
            disabled={isProcessing}
          />

          <div className="mb-4 p-4 bg-white rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
            <Upload size={24} className={dragActive ? "text-[#4F65F6]" : "text-gray-400"} />
          </div>

          <div className="bg-[#4F65F6] text-white px-8 py-2.5 rounded-full font-bold text-xs mb-3 shadow-md group-hover:bg-[#3d50c2] transition-colors">
            {isProcessing ? "Processing..." : "Browse Files"}
          </div>

          <p className="text-xs text-gray-400 text-center font-medium">
            Drag and drop your files here <br /> JPG, PNG, PDF or Excel (XLSX/CSV)
          </p>
        </div>
      </div>

      {/* Uploaded Files Preview List */}
      {files.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pb-2">Attached Files</h4>
          <div className="space-y-2">
            {files.map((file: any) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    {file.jsonData && (
                      <span className="text-[10px] text-green-600 font-bold">
                        ✓ Data Extracted ({file.jsonData.length} rows)
                      </span>
                    )}
                    {file.pages && file.type === 'pdf' && (
                      <span className="text-[10px] text-blue-600 font-bold">
                        ✓ Processed ({file.pages.length} pages)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors z-20"
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}