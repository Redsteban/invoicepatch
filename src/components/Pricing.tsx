'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckIcon, ClockIcon, FireIcon, StarIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { stripePromise } from '@/lib/stripe';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface CheckoutFormData {
  email: string;
  company_name: string;
  contractor_count: number;
  current_invoicing_method: string;
  biggest_pain_point: string;
}

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    description: 'Perfect for small businesses just getting started with integration',
    features: [
      'QuickBooks Online integration',
      'Up to 10 contractors',
      'Basic manager dashboard',
      'Email support',
      'Standard work order sync',
      'Basic invoice approval',
      'Mobile contractor app',
      'Canadian tax compliance'
    ],
    mostPopular: false,
    cta: 'Contact Sales',
    note: 'Custom pricing based on your needs'
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    description: 'For growing businesses that need comprehensive integration',
    features: [
      'All Starter features',
      'QuickBooks, Sage 50, Xero integration',
      'Up to 50 contractors',
      'Advanced manager dashboard',
      'Real-time contractor tracking',
      'GPS time verification',
      'Bulk invoice approvals',
      'Priority phone support',
      'Custom rate schedules',
      'Budget tracking & alerts'
    ],
    mostPopular: true,
    cta: 'Contact Sales',
    note: 'Custom pricing based on your needs'
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    description: 'For large organizations with complex integration needs',
    features: [
      'All Professional features',
      'Microsoft Dynamics integration',
      'Custom ERP integrations',
      'Unlimited contractors',
      'White-label options',
      'Advanced analytics & reporting',
      'Dedicated success manager',
      'SLA guarantees (99.9% uptime)',
      'Custom field mapping',
      'API access',
      '24/7 priority support',
      'On-premise deployment options'
    ],
    mostPopular: false,
    cta: 'Contact Sales',
    note: 'Custom pricing based on your needs'
  },
];

const faqs = [
  {
    id: 1,
    question: "What's included in the integration setup?",
    answer: "We handle the complete technical setup including authentication, data mapping, testing, and training. No IT resources required from your team."
  },
  {
    id: 2,
    question: "Are there setup fees for integrations?",
    answer: "Standard integrations (QuickBooks, Sage, Xero) are included. Custom ERP integrations may have one-time setup fees depending on complexity."
  },
  {
    id: 3,
    question: "Can we change plans as we grow?",
    answer: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately with adjusted pricing."
  },
  {
    id: 4,
    question: "What if we have multiple locations?",
    answer: "Each client account covers one business entity. Multi-location businesses may need multiple accounts or our Enterprise plan with custom configurations."
  }
];

// Payment Modal Component
function PaymentModal({ isOpen, onClose, plan }: { 
  isOpen: boolean; 
  onClose: () => void; 
  plan: typeof tiers[0] | null; 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CheckoutFormData>();

  const onSubmit = async (data: CheckoutFormData) => {
    if (!plan) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Create contact request instead of payment
      const response = await fetch('/api/contact-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData: data,
          planType: plan.id,
          planName: plan.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit contact request');
      }

      // Show success message
      alert('Thank you! We\'ll contact you within 24 hours to discuss pricing and setup.');
      handleClose();

    } catch (err) {
      console.error('Contact request error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden mobile-scroll">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 pr-2 break-words">
            Contact Sales - {plan.name}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors rounded-lg touch-target"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700 break-words leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-base"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="company_name"
                {...register('company_name', { required: 'Company name is required' })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-base"
                disabled={isLoading}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contractor_count" className="block text-sm font-medium text-slate-700 mb-2">
                Number of Contractors
              </label>
              <select
                id="contractor_count"
                {...register('contractor_count', { required: 'Please select contractor count' })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-base"
                disabled={isLoading}
              >
                <option value="">Select...</option>
                <option value="1-5">1-5 contractors</option>
                <option value="6-15">6-15 contractors</option>
                <option value="16-30">16-30 contractors</option>
                <option value="31-50">31-50 contractors</option>
                <option value="50+">50+ contractors</option>
              </select>
              {errors.contractor_count && (
                <p className="mt-1 text-sm text-red-600">{errors.contractor_count.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="current_invoicing_method" className="block text-sm font-medium text-slate-700 mb-2">
                Current Invoicing Method
              </label>
              <select
                id="current_invoicing_method"
                {...register('current_invoicing_method', { required: 'Please select current method' })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-base"
                disabled={isLoading}
              >
                <option value="">Select...</option>
                <option value="manual">Manual paper invoices</option>
                <option value="email">Email invoices</option>
                <option value="quickbooks">QuickBooks</option>
                <option value="sage">Sage</option>
                <option value="xero">Xero</option>
                <option value="other">Other system</option>
              </select>
              {errors.current_invoicing_method && (
                <p className="mt-1 text-sm text-red-600">{errors.current_invoicing_method.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="biggest_pain_point" className="block text-sm font-medium text-slate-700 mb-2">
                Biggest Pain Point (Optional)
              </label>
              <textarea
                id="biggest_pain_point"
                {...register('biggest_pain_point')}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 text-base resize-none"
                placeholder="Tell us about your current invoicing challenges..."
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? 'Submitting...' : 'Get Custom Quote'}
              </button>
              
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full py-3 px-4 border border-slate-300 rounded-md text-base font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactSales = (tier: typeof tiers[0]) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your business needs
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-lg p-8 xl:p-10 ${
                tier.mostPopular
                  ? 'bg-slate-900 text-white ring-2 ring-slate-900'
                  : 'bg-white text-slate-900 ring-1 ring-slate-200'
              } shadow-lg`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={`text-lg font-semibold leading-8 ${
                    tier.mostPopular ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold leading-5 text-slate-900">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className={`mt-4 text-sm leading-6 ${tier.mostPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={`text-4xl font-bold tracking-tight ${tier.mostPopular ? 'text-white' : 'text-slate-900'}`}>
                  Custom
                </span>
                <span className={`text-sm font-semibold leading-6 ${tier.mostPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                  pricing
                </span>
              </p>
              <button
                onClick={() => handleContactSales(tier)}
                aria-describedby={tier.id}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 ${
                  tier.mostPopular
                    ? 'bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-white shadow-sm'
                    : 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900 shadow-sm hover:shadow-md'
                }`}
              >
                {tier.cta}
              </button>
              <ul
                role="list"
                className={`mt-8 space-y-3 text-sm leading-6 ${
                  tier.mostPopular ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={`h-6 w-5 flex-none ${
                        tier.mostPopular ? 'text-white' : 'text-slate-600'
                      }`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.note && (
                <p className={`mt-6 text-xs ${tier.mostPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {tier.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-slate-200 pt-16">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-slate-200 pb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-slate-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Transform Your Invoice Process?
            </h3>
            <p className="text-slate-600 mb-6">
              Schedule a personalized demo and see how InvoicePatch can save you hours every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/manager/login"
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Book Demo
              </Link>
              <Link
                href="/roi-calculator"
                className="text-slate-700 hover:text-slate-900 font-medium border border-slate-300 px-8 py-3 rounded-lg hover:border-slate-400 transition-all duration-200"
              >
                Calculate ROI
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={selectedTier}
      />
    </div>
  );
} 