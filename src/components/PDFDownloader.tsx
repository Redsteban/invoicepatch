"use client";
import { useState } from 'react';
import { generateInvoicePDF, calculateInvoiceTotals } from '../utils/pdfGenerator';

interface SimulationEntry {
  date: string;
  regularHours: number;
  overtimeHours: number;
  workDescription: string;
  completed: boolean;
}

interface PDFDownloaderProps {
  simulationData: {
    entries: SimulationEntry[];
    contractorName: string;
    clientName: string;
    startDate: string;
    endDate: string;
  };
  onDownloadComplete?: () => void;
}

export default function PDFDownloader({ simulationData, onDownloadComplete }: PDFDownloaderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Preparing invoice data...', simulationData);
      
      // Convert simulation data to invoice format
      const hourlyRate = 45;
      const overtimeRate = hourlyRate * 1.5;
      
      const invoiceEntries = simulationData.entries
        .filter(entry => entry.completed)
        .map(entry => ({
          date: new Date(entry.date).toLocaleDateString(),
          regularHours: entry.regularHours,
          overtimeHours: entry.overtimeHours,
          description: entry.workDescription || 'Daily work completed',
          amount: (entry.regularHours * hourlyRate) + (entry.overtimeHours * overtimeRate)
        }));
      
      const totals = calculateInvoiceTotals(invoiceEntries, hourlyRate);
      
      const invoiceData = {
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        contractorName: simulationData.contractorName || 'Your Name',
        clientName: simulationData.clientName || 'Client Company',
        period: `${new Date(simulationData.startDate).toLocaleDateString()} - ${new Date(simulationData.endDate).toLocaleDateString()}`,
        startDate: simulationData.startDate,
        endDate: simulationData.endDate,
        entries: invoiceEntries,
        totals,
        rate: hourlyRate
      };
      
      console.log('Generated invoice data:', invoiceData);
      
      // Generate and download PDF
      generateInvoicePDF(invoiceData);
      
      setSuccess(true);
      onDownloadComplete?.();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('PDF Download Error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const completedEntries = simulationData.entries.filter(entry => entry.completed);
  const totalAmount = completedEntries.reduce((sum, entry) => {
    return sum + (entry.regularHours * 45) + (entry.overtimeHours * 67.5);
  }, 0);
  const taxAmount = totalAmount * 0.13;
  const finalTotal = totalAmount + taxAmount;

  const [isLoading, setIsLoading] = useState(false);

  const handleViewPDF = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData: simulationData }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const { pdfUrl } = await res.json();
      if (!pdfUrl) throw new Error('No PDF URL returned');
      window.open(pdfUrl, '_blank');
    } catch (err: any) {
      setError(err.message || 'PDF generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceDownload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceData: simulationData }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const { pdfUrl } = await res.json();
      if (!pdfUrl) throw new Error('No PDF URL returned');
      window.open(pdfUrl + '&download=1', '_blank');
    } catch (err: any) {
      setError(err.message || 'PDF download failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📄 Your Invoice is Ready!</h2>
        <p className="text-gray-600">Download your professional PDF invoice</p>
      </div>

      {/* Invoice Preview */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Invoice Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Period:</span>
            <span>{new Date(simulationData.startDate).toLocaleDateString()} - {new Date(simulationData.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Days Completed:</span>
            <span>{completedEntries.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Hours:</span>
            <span>{completedEntries.reduce((sum, entry) => sum + entry.regularHours + entry.overtimeHours, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (13% HST):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleViewPDF}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating PDF...' : 'Download PDF Invoice'}
        </button>
        <button
          onClick={handleForceDownload}
          disabled={isLoading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Preparing Download...' : 'Force Download'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            PDF downloaded successfully!
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        The PDF will be saved to your Downloads folder
      </p>
    </div>
  );
} 