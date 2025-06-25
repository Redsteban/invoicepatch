import { useState } from 'react';
import { PRICING_PLANS, getPlanById } from '@/lib/stripe';
import { useRouter } from 'next/router';

// Mock user billing data (replace with real fetch/hook)
const mockBilling = {
  planId: 'contractor_monthly',
  usage: 12, // e.g. invoices this period
  usageCap: 50,
  nextInvoiceDate: '2024-08-15',
};

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const plan = getPlanById(mockBilling.planId);

  const handleManageSubscription = async () => {
    setLoading(true);
    // In real app, get userId from session/context
    const res = await fetch('/api/billing/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'mock-user-id' }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10">
      <h1 className="text-2xl font-bold mb-6">Billing & Subscription</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-semibold">Current Plan</div>
            <div className="text-emerald-600 font-bold text-xl">{plan?.name}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-sm">Next Invoice</div>
            <div className="font-medium">{mockBilling.nextInvoiceDate}</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-500 text-sm mb-1">Usage</div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${(mockBilling.usage / mockBilling.usageCap) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">{mockBilling.usage} of {mockBilling.usageCap} invoices this period</div>
        </div>
        <button
          onClick={handleManageSubscription}
          disabled={loading}
          className="mt-4 w-full py-3 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting...' : 'Manage Subscription'}
        </button>
      </div>
      <div className="text-sm text-gray-500 text-center">
        Need help? <a href="/contact-sales" className="text-emerald-600 hover:underline">Contact support</a>
      </div>
    </div>
  );
} 