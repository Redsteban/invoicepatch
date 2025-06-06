'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ManagerTrialLanding = () => {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    
    if (droppedFiles.length > 0) {
      handleUpload(droppedFiles);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    if (selectedFiles.length > 0) {
      handleUpload(selectedFiles);
    }
  }, []);

  const handleUpload = async (uploadFiles) => {
    setIsUploading(true);
    
    const formData = new FormData();
    uploadFiles.forEach(file => formData.append('files', file));
    
    try {
      const response = await fetch('/api/manager/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          router.push('/manager/reconciliation');
        }, 3000); // Show processing animation
      } else {
        console.error('Upload failed:', data.error);
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const handleSampleData = () => {
    // Simulate loading sample invoices
    const sampleFiles = [
      { name: 'Invoice_001.pdf', size: '245 KB' },
      { name: 'Invoice_002.pdf', size: '198 KB' },
      { name: 'Timesheet_Jan.xlsx', size: '67 KB' }
    ];
    
    setFiles(sampleFiles);
    handleUpload(sampleFiles);
  };

  if (isUploading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#3b82f6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#6b7280]">Uploading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-[#1a1a1a] mb-3">
            Upload invoices. Watch the magic.
          </h1>
          <p className="text-[#6b7280]">
            Our AI reconciles everything in seconds, not hours
          </p>
        </div>
        
        {/* Clean drop zone */}
        <div 
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-[#3b82f6] bg-[#f0f9ff]' 
              : 'border-[#d1d5db] hover:border-[#3b82f6]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <svg className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-[#1a1a1a] font-medium mb-2">Drop invoices here</p>
          <p className="text-sm text-[#6b7280] mb-4">PDF, Excel, CSV, or photos</p>
          <button className="text-[#3b82f6] hover:text-[#2563eb] transition-colors">
            or browse files
          </button>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
        
        {/* Simple sample button */}
        <div className="text-center mt-6">
          <button 
            onClick={handleSampleData}
            className="text-[#6b7280] hover:text-[#1a1a1a] text-sm transition-colors"
          >
            Try with sample invoices →
          </button>
        </div>

        {/* Show selected files */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-[#1a1a1a] mb-3">Selected files:</h3>
            <div className="space-y-2">
              {files.slice(0, 5).map((file, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-[#f9fafb] rounded-lg">
                  <span className="text-sm text-[#1a1a1a]">{file.name}</span>
                  {file.size && (
                    <span className="text-xs text-[#6b7280]">{file.size}</span>
                  )}
                </div>
              ))}
              {files.length > 5 && (
                <p className="text-xs text-[#6b7280] text-center">
                  +{files.length - 5} more files
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTrialLanding; 