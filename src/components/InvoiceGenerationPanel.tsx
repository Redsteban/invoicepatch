'use client';

import React, { useState, useEffect } from 'react';
import { PayPeriod } from '../lib/payroll';
import { GeneratedInvoice, formatCurrency } from '../lib/invoiceGeneration';

interface InvoiceGenerationPanelProps {
  trialInvoiceId: string;
  periods: PayPeriod[];
  currentPeriod: number;
  contractorName: string;
  onInvoiceGenerated?: (invoice: GeneratedInvoice) => void;
}

const InvoiceGenerationPanel: React.FC<InvoiceGenerationPanelProps> = ({
  trialInvoiceId,
  periods,
  currentPeriod,
  contractorName,
  onInvoiceGenerated
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [generatedInvoices, setGeneratedInvoices] = useState<GeneratedInvoice[]>([]);
  const [existingInvoices, setExistingInvoices] = useState<any[]>([]);
  const [showInvoicePreview, setShowInvoicePreview] = useState<GeneratedInvoice | null>(null);

  useEffect(() => {
    loadExistingInvoices();
  }, [trialInvoiceId]);

  const loadExistingInvoices = async () => {
    try {
      const response = await fetch(`/api/invoices/generate?trialInvoiceId=${trialInvoiceId}`);
      const result = await response.json();
      
      if (result.success) {
        setExistingInvoices(result.data || []);
      }
    } catch (error) {
      console.error('❌ Error loading existing invoices:', error);
    }
  };

  const generateSingleInvoice = async (periodNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId,
          periodNumber,
          action: 'single'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const invoice = result.data;
        setGeneratedInvoices(prev => [...prev, invoice]);
        
        if (onInvoiceGenerated) {
          onInvoiceGenerated(invoice);
        }
        
        console.log('✅ Invoice generated:', invoice.invoiceNumber);
        await loadExistingInvoices(); // Refresh existing invoices
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error generating invoice:', error);
      alert(`Failed to generate invoice: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const generateCurrentPeriodInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId,
          action: 'current'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const invoice = result.data;
        setGeneratedInvoices(prev => [...prev, invoice]);
        
        if (onInvoiceGenerated) {
          onInvoiceGenerated(invoice);
        }
        
        console.log('✅ Current period invoice generated:', invoice.invoiceNumber);
        await loadExistingInvoices();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error generating current period invoice:', error);
      alert(`Failed to generate current period invoice: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const generateBulkInvoices = async () => {
    if (selectedPeriods.length === 0) {
      alert('Please select at least one period to generate invoices');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialInvoiceId,
          periodNumbers: selectedPeriods,
          action: 'bulk'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const invoices = result.data;
        setGeneratedInvoices(prev => [...prev, ...invoices]);
        setSelectedPeriods([]);
        
        console.log(`✅ Generated ${invoices.length} invoices`);
        await loadExistingInvoices();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error generating bulk invoices:', error);
      alert(`Failed to generate bulk invoices: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePeriodSelection = (periodNumber: number) => {
    setSelectedPeriods(prev => 
      prev.includes(periodNumber)
        ? prev.filter(p => p !== periodNumber)
        : [...prev, periodNumber]
    );
  };

  const isInvoiceGenerated = (periodNumber: number) => {
    return existingInvoices.some(inv => inv.period_number === periodNumber);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentPeriodInfo = () => {
    return periods.find(p => p.periodNumber === currentPeriod);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            📋 Invoice Generation
          </h2>
          <p className="text-gray-600 mt-1">
            Generate invoices for {contractorName}'s payroll periods
          </p>
        </div>
        
        {existingInvoices.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Generated Invoices</p>
            <p className="text-2xl font-bold text-green-600">{existingInvoices.length}</p>
          </div>
        )}
      </div>

      {/* Current Period Quick Action */}
      {getCurrentPeriodInfo() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Current Period Invoice</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-800">
                Period {currentPeriod}: {formatDate(getCurrentPeriodInfo()!.startDate)} - {formatDate(getCurrentPeriodInfo()!.endDate)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {getCurrentPeriodInfo()!.daysInPeriod} working days
                {getCurrentPeriodInfo()!.isPartialPeriod && ' (Partial period)'}
              </p>
            </div>
            <button
              onClick={generateCurrentPeriodInvoice}
              disabled={loading || isInvoiceGenerated(currentPeriod)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isInvoiceGenerated(currentPeriod)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {loading ? 'Generating...' : isInvoiceGenerated(currentPeriod) ? 'Already Generated' : 'Generate Current'}
            </button>
          </div>
        </div>
      )}

      {/* Bulk Generation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">Bulk Invoice Generation</h3>
        
        {/* Period Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          {periods.slice(0, 12).map((period) => (
            <label
              key={period.periodNumber}
              className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${
                selectedPeriods.includes(period.periodNumber)
                  ? 'bg-green-100 border-green-300'
                  : isInvoiceGenerated(period.periodNumber)
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:bg-green-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPeriods.includes(period.periodNumber)}
                onChange={() => togglePeriodSelection(period.periodNumber)}
                disabled={isInvoiceGenerated(period.periodNumber)}
                className="mr-2"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Period {period.periodNumber}
                  {isInvoiceGenerated(period.periodNumber) && (
                    <span className="ml-1 text-xs text-green-600">✓</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(period.startDate)} - {formatDate(period.endDate)}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-green-700">
            {selectedPeriods.length} period{selectedPeriods.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={generateBulkInvoices}
            disabled={loading || selectedPeriods.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : `Generate ${selectedPeriods.length} Invoice${selectedPeriods.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>

      {/* Existing Invoices */}
      {existingInvoices.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Generated Invoices</h3>
          <div className="space-y-2">
            {existingInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white rounded border p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-sm text-gray-600">
                    Period {invoice.period_number} • Total: {formatCurrency(invoice.total)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowInvoicePreview(invoice)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Preview
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Generated Invoices */}
      {generatedInvoices.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-3">
            🎉 Recently Generated ({generatedInvoices.length})
          </h3>
          <div className="space-y-2">
            {generatedInvoices.map((invoice, index) => (
              <div key={index} className="bg-white rounded border p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-700">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">
                      Period {invoice.period.periodNumber} • Total: {formatCurrency(invoice.total)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowInvoicePreview(invoice)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Preview
                    </button>
                  </div>
                </div>
                
                {/* Invoice Summary */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Days Worked:</span>
                      <p className="font-medium">{invoice.periodSummary.totalDaysWorked}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Subtotal:</span>
                      <p className="font-medium">{formatCurrency(invoice.subtotal)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">GST:</span>
                      <p className="font-medium">{formatCurrency(invoice.gst)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showInvoicePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Invoice Preview</h3>
                <button
                  onClick={() => setShowInvoicePreview(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
              
              {/* Invoice Preview Content */}
              <div className="border rounded-lg p-6">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold">INVOICE</h1>
                  <p className="text-lg text-gray-600">{showInvoicePreview.invoiceNumber}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">From:</h4>
                    <p className="font-medium">{showInvoicePreview.contractorInfo.name}</p>
                    <p>{showInvoicePreview.contractorInfo.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">To:</h4>
                    <p className="font-medium">{showInvoicePreview.companyInfo.name}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded mb-6">
                  <h4 className="font-semibold mb-2">Period Information:</h4>
                  <p>Period {showInvoicePreview.period.periodNumber}: {formatDate(showInvoicePreview.period.startDate)} - {formatDate(showInvoicePreview.period.endDate)}</p>
                  <p className="text-sm text-gray-600">Payment Date: {formatDate(showInvoicePreview.paymentDate)}</p>
                </div>

                <table className="w-full border-collapse border border-gray-300 mb-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Description</th>
                      <th className="border border-gray-300 p-2 text-center">Qty</th>
                      <th className="border border-gray-300 p-2 text-right">Rate</th>
                      <th className="border border-gray-300 p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showInvoicePreview.lineItems.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{item.description}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.rate)}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="text-right">
                  <div className="inline-block">
                    <div className="flex justify-between w-48 mb-1">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(showInvoicePreview.subtotal)}</span>
                    </div>
                    <div className="flex justify-between w-48 mb-1">
                      <span>GST (5%):</span>
                      <span>{formatCurrency(showInvoicePreview.gst)}</span>
                    </div>
                    <div className="flex justify-between w-48 font-bold text-lg border-t pt-1">
                      <span>Total:</span>
                      <span>{formatCurrency(showInvoicePreview.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerationPanel; 