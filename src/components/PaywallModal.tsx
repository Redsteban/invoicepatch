import { useState } from 'react';
import { PRICING_PLANS } from '@/lib/stripe';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export default function PaywallModal({ open, onClose, userId }: PaywallModalProps) {
  const [loading, setLoading] = useState<string | null>(null);

  if (!open) return null;

  const handleUpgrade = async (priceId: string) => {
    setLoading(priceId);
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, priceId }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center">Upgrade Your Plan</h2>
        <p className="text-gray-600 mb-6 text-center">Unlock unlimited access and advanced features.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {PRICING_PLANS.filter(plan => plan.id === 'contractor_monthly' || plan.id === 'manager_platform').map(plan => (
            <div key={plan.id} className="border rounded-xl p-5 flex flex-col items-center bg-gray-50">
              <div className="text-lg font-semibold mb-1">{plan.name}</div>
              <div className="text-emerald-600 font-bold text-3xl mb-2">
                ${plan.discountedPrice}<span className="text-base font-normal text-gray-500">/mo</span>
              </div>
              <ul className="text-sm text-gray-600 mb-4 list-disc list-inside text-left w-full">
                {plan.features.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={loading === plan.priceId}
                className="w-full py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === plan.priceId ? 'Redirecting...' : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center">Cancel anytime. Secure checkout powered by Stripe.</div>
      </div>
    </div>
  );
} 