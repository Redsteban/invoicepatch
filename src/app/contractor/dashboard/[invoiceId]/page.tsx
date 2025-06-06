'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  days_worked: number;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
  contractor: {
    name: string;
    email: string;
    daily_rate: number;
  };
  work_order: {
    project_name: string;
    location: string;
    start_date: string;
    end_date: string;
  };
}

const ContractorDashboard = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.invoiceId as string;

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/contractor/invoice/${invoiceId}`);
      const data = await response.json();
      
      if (data.success) {
        setInvoice(data.invoice);
      } else {
        setError(data.error || 'Failed to load invoice');
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError('Failed to load invoice data');
    } finally {
      setLoading(false);
    }
  };

  const submitInvoice = async () => {
    if (!invoice) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`/api/contractor/invoice/${invoiceId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setInvoice(prev => prev ? { ...prev, status: 'submitted' } : null);
      } else {
        setError(data.error || 'Failed to submit invoice');
      }
    } catch (err) {
      console.error('Error submitting invoice:', err);
      setError('Failed to submit invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b7280]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-[#1a1a1a] mb-2">Something went wrong</h1>
          <p className="text-[#6b7280] mb-6">{error}</p>
          <button 
            onClick={() => router.push('/automated-trial-setup')}
            className="bg-[#3b82f6] text-white px-6 py-2 rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6b7280]">Invoice not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-[#fefce8] text-[#f59e0b] border-[#fde68a]';
      case 'submitted': return 'bg-[#f0f9ff] text-[#3b82f6] border-[#bfdbfe]';
      case 'approved': return 'bg-[#f0fdf4] text-[#22c55e] border-[#bbf7d0]';
      case 'paid': return 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]';
      default: return 'bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a]">
                Welcome, {invoice.contractor.name}
              </h1>
              <p className="text-[#6b7280]">
                {invoice.work_order.project_name}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Invoice Card */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Current Invoice</h2>
            <span className="text-sm text-[#6b7280]">{invoice.invoice_number}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#6b7280]">Amount</label>
                <div className="text-2xl font-bold text-[#1a1a1a]">${invoice.amount}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#6b7280]">Days Worked</label>
                <div className="text-lg text-[#1a1a1a]">{invoice.days_worked} day{invoice.days_worked !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#6b7280]">Daily Rate</label>
                <div className="text-lg text-[#1a1a1a]">${invoice.contractor.daily_rate}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#6b7280]">Due Date</label>
                <div className="text-lg text-[#1a1a1a]">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#6b7280]">Created</label>
                <div className="text-lg text-[#1a1a1a]">
                  {new Date(invoice.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#6b7280]">Location</label>
                <div className="text-lg text-[#1a1a1a]">{invoice.work_order.location}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-[#6b7280]">Work Description</label>
            <div className="mt-1 text-[#1a1a1a]">{invoice.description}</div>
          </div>

          {invoice.status === 'draft' && (
            <div className="flex gap-4">
              <button 
                onClick={submitInvoice}
                disabled={submitting}
                className="bg-[#3b82f6] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Invoice'}
              </button>
              <button className="border border-[#e5e7eb] text-[#1a1a1a] px-6 py-2 rounded-lg font-medium hover:bg-[#f9fafb] transition-colors">
                Edit Details
              </button>
            </div>
          )}
          
          {invoice.status === 'submitted' && (
            <div className="bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg p-4">
              <p className="text-[#3b82f6] font-medium">
                ✓ Invoice submitted successfully! 
              </p>
              <p className="text-[#6b7280] text-sm mt-1">
                You'll receive payment within 30 days of approval.
              </p>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="bg-[#f9fafb] rounded-lg p-6">
          <h3 className="font-medium text-[#1a1a1a] mb-4">Project Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-[#6b7280]">Project:</span>
              <div className="font-medium text-[#1a1a1a]">{invoice.work_order.project_name}</div>
            </div>
            <div>
              <span className="text-sm text-[#6b7280]">Location:</span>
              <div className="font-medium text-[#1a1a1a]">{invoice.work_order.location}</div>
            </div>
            <div>
              <span className="text-sm text-[#6b7280]">Start Date:</span>
              <div className="font-medium text-[#1a1a1a]">
                {new Date(invoice.work_order.start_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="text-sm text-[#6b7280]">End Date:</span>
              <div className="font-medium text-[#1a1a1a]">
                {new Date(invoice.work_order.end_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard; 