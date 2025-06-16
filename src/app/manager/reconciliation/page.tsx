'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManagerLayout from '@/components/ManagerLayout';

interface DemoInvoice {
  id: string;
  invoice_number: string;
  contractor_name: string;
  amount: number;
  status: 'matched' | 'review' | 'approved';
  filename: string;
  reconciliation_confidence: number;
  issues: string[];
  upload_date: string;
}

interface ReconciliationSummary {
  totalAmount: number;
  matchedInvoices: number;
  flaggedInvoices: number;
  totalInvoices: number;
  processingTime: string;
}

const ManagerReconciliation = () => {
  const [invoices, setInvoices] = useState<DemoInvoice[]>([]);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<DemoInvoice | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading demo data
    loadReconciliationData();
  }, []);

  const loadReconciliationData = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate demo data
    const demoInvoices: DemoInvoice[] = [
      {
        id: '1',
        invoice_number: 'INV-2024-001',
        contractor_name: 'Northern Drilling Corp',
        amount: 24500,
        status: 'matched',
        filename: 'invoice_1.pdf',
        reconciliation_confidence: 96,
        issues: [],
        upload_date: new Date().toISOString()
      },
      {
        id: '2',
        invoice_number: 'INV-2024-002',
        contractor_name: 'Precision Oilfield Services',
        amount: 18750,
        status: 'matched',
        filename: 'invoice_2.pdf',
        reconciliation_confidence: 94,
        issues: [],
        upload_date: new Date().toISOString()
      },
      {
        id: '3',
        invoice_number: 'INV-2024-003',
        contractor_name: 'Alberta Pipeline Solutions',
        amount: 31200,
        status: 'review',
        filename: 'invoice_3.pdf',
        reconciliation_confidence: 67,
        issues: ['Rate discrepancy: $450/day vs $425/day expected', 'Missing AFE reference'],
        upload_date: new Date().toISOString()
      },
      {
        id: '4',
        invoice_number: 'INV-2024-004',
        contractor_name: 'Mountain View Construction',
        amount: 15600,
        status: 'matched',
        filename: 'invoice_4.pdf',
        reconciliation_confidence: 98,
        issues: [],
        upload_date: new Date().toISOString()
      },
      {
        id: '5',
        invoice_number: 'INV-2024-005',
        contractor_name: 'Energy Services Inc',
        amount: 22300,
        status: 'review',
        filename: 'invoice_5.pdf',
        reconciliation_confidence: 54,
        issues: ['Hours mismatch: 56 hrs vs 48 hrs on work order'],
        upload_date: new Date().toISOString()
      }
    ];

    const demoSummary: ReconciliationSummary = {
      totalAmount: demoInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      matchedInvoices: demoInvoices.filter(inv => inv.status === 'matched').length,
      flaggedInvoices: demoInvoices.filter(inv => inv.status === 'review').length,
      totalInvoices: demoInvoices.length,
      processingTime: '47 seconds'
    };

    setInvoices(demoInvoices);
    setSummary(demoSummary);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]';
      case 'review': return 'bg-[#fefce8] text-[#f59e0b] border-[#fde68a]';
      case 'approved': return 'bg-[#f0f9ff] text-[#3b82f6] border-[#bfdbfe]';
      default: return 'bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-[#16a34a]';
    if (confidence >= 70) return 'text-[#f59e0b]';
    return 'text-[#dc2626]';
  };

  const approveInvoice = (invoiceId: string) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, status: 'approved' as const }
          : inv
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e5e7eb] border-t-[#3b82f6] rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-medium text-[#1a1a1a] mb-2">Processing invoices...</h2>
          <p className="text-[#6b7280]">AI is reconciling your invoices with work orders</p>
        </div>
      </div>
    );
  }

  return (
    <ManagerLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                Reconciliation Complete
              </h1>
              <p className="text-[#6b7280]">
                {summary?.totalInvoices} invoices processed in {summary?.processingTime}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/manager-trial')}
                className="border border-[#e5e7eb] text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
              >
                Upload More
              </button>
              <button className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-[#2563eb] transition-colors">
                Export Results
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <div className="text-2xl font-bold text-[#1a1a1a]">
                ${summary.totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-[#6b7280]">Total Value</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <div className="text-2xl font-bold text-[#16a34a]">
                {summary.matchedInvoices}
              </div>
              <div className="text-sm text-[#6b7280]">Auto-matched</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <div className="text-2xl font-bold text-[#f59e0b]">
                {summary.flaggedInvoices}
              </div>
              <div className="text-sm text-[#6b7280]">Need Review</div>
            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-6">
              <div className="text-2xl font-bold text-[#3b82f6]">
                {Math.round((summary.matchedInvoices / summary.totalInvoices) * 100)}%
              </div>
              <div className="text-sm text-[#6b7280]">Success Rate</div>
            </div>
          </div>
        )}

        {/* Invoice List */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb]">
            <h2 className="text-lg font-medium text-[#1a1a1a]">Invoice Results</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Contractor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-[#f9fafb]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#1a1a1a]">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-sm text-[#6b7280]">
                        {invoice.filename}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#1a1a1a]">
                        {invoice.contractor_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#1a1a1a]">
                        ${invoice.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        {invoice.status === 'matched' ? 'Auto-matched' : 
                         invoice.status === 'review' ? 'Needs Review' : 'Approved'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getConfidenceColor(invoice.reconciliation_confidence)}`}>
                        {invoice.reconciliation_confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-[#3b82f6] hover:text-[#2563eb] text-sm font-medium"
                        >
                          View Details
                        </button>
                        {invoice.status === 'review' && (
                          <button 
                            onClick={() => approveInvoice(invoice.id)}
                            className="text-[#16a34a] hover:text-[#15803d] text-sm font-medium"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Try Full Demo CTA */}
        <div className="mt-12 text-center">
          <div className="bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
              Ready to eliminate manual reconciliation?
            </h3>
            <p className="text-[#6b7280] mb-6">
              See how InvoicePatch integrates with your existing workflow
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => router.push('/pricing')}
                className="bg-[#3b82f6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2563eb] transition-colors"
              >
                View Pricing
              </button>
              <button 
                onClick={() => router.push('/manager-trial')}
                className="border border-[#e5e7eb] text-[#1a1a1a] px-6 py-3 rounded-lg font-medium hover:bg-[#f9fafb] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e5e7eb]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1a1a1a]">
                  Invoice Details
                </h3>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="text-[#6b7280] hover:text-[#1a1a1a]"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#6b7280]">Invoice Number</label>
                  <div className="text-[#1a1a1a]">{selectedInvoice.invoice_number}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#6b7280]">Contractor</label>
                  <div className="text-[#1a1a1a]">{selectedInvoice.contractor_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#6b7280]">Amount</label>
                  <div className="text-xl font-bold text-[#1a1a1a]">
                    ${selectedInvoice.amount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#6b7280]">Confidence Score</label>
                  <div className={`text-lg font-medium ${getConfidenceColor(selectedInvoice.reconciliation_confidence)}`}>
                    {selectedInvoice.reconciliation_confidence}%
                  </div>
                </div>
              </div>

              {selectedInvoice.issues.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#6b7280] mb-2 block">Issues Found</label>
                  <div className="space-y-2">
                    {selectedInvoice.issues.map((issue, index) => (
                      <div key={index} className="bg-[#fefce8] border border-[#fde68a] rounded-lg p-3">
                        <div className="text-sm text-[#f59e0b]">{issue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {selectedInvoice.status === 'review' && (
                  <button 
                    onClick={() => {
                      approveInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="bg-[#16a34a] text-white px-4 py-2 rounded-lg hover:bg-[#15803d] transition-colors"
                  >
                    Approve Invoice
                  </button>
                )}
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="border border-[#e5e7eb] text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerReconciliation; 