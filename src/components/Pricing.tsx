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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Contact Sales - {plan.name}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="your@company.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              {...register('company_name', { required: 'Company name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Your Company Inc."
            />
            {errors.company_name && (
              <p className="text-red-600 text-sm mt-1">{errors.company_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Contractors *
            </label>
            <select
              {...register('contractor_count', { required: 'Please select contractor count' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select range</option>
              <option value="1-10">1-10 contractors</option>
              <option value="11-50">11-50 contractors</option>
              <option value="51-100">51-100 contractors</option>
              <option value="100+">100+ contractors</option>
            </select>
            {errors.contractor_count && (
              <p className="text-red-600 text-sm mt-1">{errors.contractor_count.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Invoicing Method *
            </label>
            <select
              {...register('current_invoicing_method', { required: 'Please select current method' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select method</option>
              <option value="QuickBooks">QuickBooks</option>
              <option value="Sage 50">Sage 50</option>
              <option value="Xero">Xero</option>
              <option value="Excel/Spreadsheets">Excel/Spreadsheets</option>
              <option value="Custom ERP">Custom ERP</option>
              <option value="Other">Other</option>
            </select>
            {errors.current_invoicing_method && (
              <p className="text-red-600 text-sm mt-1">{errors.current_invoicing_method.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biggest Pain Point
            </label>
            <textarea
              {...register('biggest_pain_point')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="What's your biggest challenge with contractor invoicing?"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Contact Sales'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 23, minutes: 14, seconds: 32 });
  const [spotsRemaining, setSpotsRemaining] = useState(67);
  const [recentJoins] = useState(127);
  const [selectedTier, setSelectedTier] = useState<typeof tiers[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate decreasing spots
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsRemaining(prev => Math.max(45, prev - Math.floor(Math.random() * 2)));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleContactSales = (tier: typeof tiers[0]) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTier(null);
  };

  return (
    <>
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        plan={selectedTier} 
      />
      
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose Your Integration Plan
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transparent pricing based on your business size and integration needs. 
              All plans include Canadian tax compliance and mobile contractor apps.
            </p>
          </div>

          {/* ROI Calculator Teaser */}
          <div className="mt-12 rounded-2xl bg-emerald-50 border border-emerald-200 p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                💡 Calculate Your ROI
              </h3>
              <p className="text-emerald-800 mb-4">
                Most businesses save 15+ hours per week and reduce billing errors by 90%. 
                See your potential savings with our ROI calculator.
              </p>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                Calculate My Savings
              </button>
            </div>
          </div>

          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 ring-1 xl:p-10 ${
                  tier.mostPopular
                    ? 'bg-emerald-600 ring-emerald-600 relative'
                    : 'bg-white ring-gray-200'
                }`}
              >
                {tier.mostPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="rounded-full bg-emerald-600 px-4 py-1 text-sm font-semibold text-white ring-4 ring-white">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={`text-lg font-semibold leading-8 ${
                      tier.mostPopular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                </div>
                
                <p className={`mt-4 text-sm leading-6 ${
                  tier.mostPopular ? 'text-emerald-100' : 'text-gray-600'
                }`}>
                  {tier.description}
                </p>
                
                <p className={`mt-6 text-2xl font-bold tracking-tight ${
                  tier.mostPopular ? 'text-white' : 'text-gray-900'
                }`}>
                  Custom Pricing
                </p>
                
                <p className={`mt-2 text-xs ${
                  tier.mostPopular ? 'text-emerald-100' : 'text-gray-500'
                }`}>
                  {tier.note}
                </p>
                
                <button
                  onClick={() => handleContactSales(tier)}
                  className={`mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tier.mostPopular
                      ? 'bg-white text-emerald-600 hover:bg-gray-100 focus-visible:outline-white'
                      : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline-emerald-600'
                  }`}
                >
                  {tier.cta}
                </button>
                
                <ul role="list" className={`mt-8 space-y-3 text-sm leading-6 ${
                  tier.mostPopular ? 'text-emerald-100' : 'text-gray-600'
                }`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className={`h-6 w-5 flex-none ${
                          tier.mostPopular ? 'text-white' : 'text-emerald-600'
                        }`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Pricing Questions
            </h3>
            <dl className="space-y-6 max-w-4xl mx-auto">
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-lg bg-gray-50 p-6">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Schedule a demo to see how integration will work with your specific business system
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/invoice-builder"
                className="rounded-md bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                See Demo
              </Link>
              <button 
                onClick={() => handleContactSales(tiers[1])}
                className="text-base font-semibold leading-6 text-gray-900 hover:text-emerald-600"
              >
                Contact Sales <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 