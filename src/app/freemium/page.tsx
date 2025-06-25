import Link from 'next/link';

const features = [
  { name: 'Invoice Simulation', free: true, paid: true },
  { name: 'Daily Logs', free: true, paid: true },
  { name: 'Basic Reporting', free: true, paid: true },
  { name: 'Unlimited Invoices', free: false, paid: true },
  { name: 'Bulk Actions', free: false, paid: true },
  { name: 'Advanced Analytics', free: false, paid: true },
  { name: 'Integrations', free: false, paid: true },
  { name: 'Priority Support', free: false, paid: true },
];

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'InvoicePatch made my invoicing 10x faster. The free plan let me try everything risk-free!',
    role: 'Independent Contractor',
  },
  {
    name: 'Mike D.',
    text: 'The upgrade was seamless. I love the usage meter and the paywall is super fair.',
    role: 'Field Manager',
  },
];

export default function FreemiumLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Headline & Value Prop */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Free with InvoicePatch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Experience the full workflow, risk-free. No credit card required. Upgrade anytime for unlimited power.
          </p>
          <Link href="/signup">
            <span className="inline-block bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-emerald-700 transition text-lg">
              Start Free
            </span>
          </Link>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow p-6 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-center">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Feature</th>
                  <th className="px-4 py-2 text-center">Freemium</th>
                  <th className="px-4 py-2 text-center">Paid</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.name} className="border-b">
                    <td className="px-4 py-2">{f.name}</td>
                    <td className="px-4 py-2 text-center">
                      {f.free ? <span className="text-emerald-600 font-bold">✔</span> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="text-emerald-600 font-bold">✔</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials / Social Proof */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 mb-4">“{t.text}”</p>
                <div className="text-emerald-700 font-semibold">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Nudge */}
        <div className="text-center mt-10">
          <div className="inline-block bg-yellow-100 text-yellow-800 px-6 py-3 rounded-lg font-semibold shadow-sm">
            Ready for more? <Link href="/billing"><span className="underline hover:text-yellow-900">Upgrade to unlock unlimited invoices & advanced features</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
} 