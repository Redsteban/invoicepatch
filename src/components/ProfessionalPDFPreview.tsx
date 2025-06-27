'use client';
import { useState } from 'react';
import { generateAndPreviewPDF, convertSimulationToInvoiceData } from '../utils/professionalPdfGenerator';

interface PDFPreviewProps {
  simulationData: {
    entries: Array<{
      date: string;
      regularHours: number;
      overtimeHours: number;
      workDescription: string;
      completed: boolean;
    }>;
    contractorName: string;
    clientName: string;
    startDate: string;
    endDate: string;
  };
  onEmailRequest?: () => void;
}

export default function ProfessionalPDFPreview({ simulationData, onEmailRequest }: PDFPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePreviewPDF = async () => {
    setIsGenerating(true);
    
    try {
      // Convert simulation data to invoice format
      const invoiceData = convertSimulationToInvoiceData(simulationData);
      
      console.log('📄 Generating PDF with data:', invoiceData);
      
      // Generate and open PDF in new window
      await generateAndPreviewPDF(invoiceData);
      
    } catch (error) {
      console.error('PDF Preview Error:', error);
      alert('Failed to generate PDF preview');
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate summary for display
  const completedEntries = simulationData.entries.filter(entry => entry.completed);
  const subtotal = completedEntries.length * 580.00;
  const gst = subtotal * 0.05;
  const subsistence = 700.00;
  const grandTotal = subtotal + gst + subsistence;

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-green-500 p-6 max-w-2xl mx-auto">
      {/* Header matching the invoice style */}
      <div className="text-center mb-6 space-y-1">
        <div className="text-sm text-gray-600">Client: {simulationData.clientName || 'Acme Energy Ltd.'}</div>
        <div className="text-sm text-gray-600">Client Address: 123 Main St, Calgary, AB</div>
        <div className="text-sm text-gray-600">Invoice Date: {new Date().toLocaleDateString('en-CA')}</div>
        <div className="text-sm text-gray-600">Contractor: {simulationData.contractorName || 'John Doe'}</div>
        <div className="text-sm text-gray-600">Contractor Address: 456 Contractor Rd, Edmonton, AB</div>
        <div className="text-sm text-gray-600">
          Pay Period: {simulationData.startDate} to {simulationData.endDate}
        </div>
        <div className="text-sm text-gray-600">Invoice Number: -</div>
      </div>

      {/* Work Summary Preview */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Work Summary:</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold mb-2 pb-2 border-b">
            <div>Day</div>
            <div>Date</div>
            <div>Description</div>
            <div className="text-right">Total</div>
          </div>
          {completedEntries.map((entry, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 text-xs py-1">
              <div>{index + 1}</div>
              <div>{new Date(entry.date).toLocaleDateString('en-CA')}</div>
              <div>Stack Production Testing</div>
              <div className="text-right">$580.00</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Sections */}
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between">
          <span>⊕ Total Truck Charges</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>⊕ Total Kms Charges</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>⊕ Total Other Charges</span>
          <span>$0.00</span>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="border-t pt-4 mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Financial Summary:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>⊖ Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>% GST (5%)</span>
            <span>${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between bg-yellow-100 px-2 py-1 rounded">
            <span>⊕ Subsistence (Tax-Free)</span>
            <span>${subsistence.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-green-600">
          $ Grand Total: ${grandTotal.toFixed(2)}
        </div>
      </div>

      {/* Action Buttons - matching the reference design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={handlePreviewPDF}
          disabled={isGenerating || completedEntries.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-400"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <span>⬇</span>
              <span>Download PDF</span>
            </>
          )}
        </button>

        <button
          onClick={onEmailRequest}
          disabled={completedEntries.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 disabled:bg-gray-400"
        >
          <span>✉</span>
          <span>Email PDF</span>
        </button>
      </div>

      {/* Status Message */}
      <div className="text-center text-sm text-gray-600">
        This invoice is now ready to be sent to the operator for approval.
      </div>

      {/* Help Text */}
      {completedEntries.length === 0 && (
        <div className="text-center text-sm text-red-600 mt-4">
          Complete some daily entries to generate the invoice.
        </div>
      )}
    </div>
  );
} 