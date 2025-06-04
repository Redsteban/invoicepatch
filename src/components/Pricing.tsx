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
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 pr-2 break-words">
            Contact Sales - {plan.name}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors rounded-lg touch-target"
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
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
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 touch-target"
                placeholder="your.email@company.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                {...register('company_name', { required: 'Company name is required' })}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 touch-target"
                placeholder="Your Company Inc."
                disabled={isLoading}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.company_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contractor_count" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Contractors *
              </label>
              <select
                id="contractor_count"
                {...register('contractor_count', { required: 'Please select contractor count' })}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 touch-target"
                disabled={isLoading}
              >
                <option value="">Select range...</option>
                <option value="1-10">1-10 contractors</option>
                <option value="11-25">11-25 contractors</option>
                <option value="26-50">26-50 contractors</option>
                <option value="51-100">51-100 contractors</option>
                <option value="100+">100+ contractors</option>
              </select>
              {errors.contractor_count && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.contractor_count.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="current_invoicing_method" className="block text-sm font-medium text-gray-700 mb-2">
                Current Invoicing Method *
              </label>
              <select
                id="current_invoicing_method"
                {...register('current_invoicing_method', { required: 'Please select current method' })}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 touch-target"
                disabled={isLoading}
              >
                <option value="">Select method...</option>
                <option value="email">Email PDFs</option>
                <option value="paper">Paper invoices</option>
                <option value="erp_manual">Manual ERP entry</option>
                <option value="spreadsheet">Excel/Spreadsheets</option>
                <option value="other">Other system</option>
              </select>
              {errors.current_invoicing_method && (
                <p className="mt-1 text-sm text-red-600 break-words">{errors.current_invoicing_method.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="biggest_pain_point" className="block text-sm font-medium text-gray-700 mb-2">
                Biggest Pain Point (Optional)
              </label>
              <textarea
                id="biggest_pain_point"
                {...register('biggest_pain_point')}
                rows={3}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 resize-none touch-target"
                placeholder="What's your biggest challenge with invoice processing?"
                disabled={isLoading}
              />
            </div>

            <div className="border-t pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:flex-1 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 touch-target"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 touch-target"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Contact Sales'
                )}
              </button>
            </div>
          </form>
        </div>
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
      
      <section id="pricing" className="block w-full bg-white py-12 sm:py-16 lg:py-20 mobile-container visible">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-600">Pricing</h2>
            <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl break-words">
              Choose Your Integration Plan
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 break-words">
              Transparent pricing based on your business size and integration needs. 
              All plans include Canadian tax compliance and mobile contractor apps.
            </p>
          </div>

          {/* ROI Calculator Teaser */}
          <div className="block w-full mt-8 sm:mt-12 rounded-xl bg-emerald-50 border border-emerald-200 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 mb-4">
                💡 Calculate Your ROI
              </h3>
              <p className="text-sm sm:text-base text-emerald-800 mb-4 break-words">
                Most businesses save 15+ hours per week and reduce billing errors by 90%. 
                See your potential savings with our ROI calculator.
              </p>
              <button className="mobile-button rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 touch-target">
                Calculate My Savings
              </button>
            </div>
          </div>

          {/* Pricing Cards - Mobile First Stacking */}
          <div className="block w-full isolate mx-auto mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12 max-w-6xl">
            {tiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`block w-full rounded-xl sm:rounded-2xl p-6 sm:p-8 ring-1 relative transition-all duration-200 hover:shadow-lg ${
                  tier.mostPopular
                    ? 'bg-emerald-600 ring-emerald-600 scale-100 sm:scale-105'
                    : 'bg-white ring-gray-200 hover:ring-gray-300'
                }`}
              >
                {tier.mostPopular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="rounded-full bg-emerald-600 px-3 py-1 sm:px-4 sm:py-2 text-sm font-semibold text-white ring-4 ring-white whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between gap-x-4 mb-4">
                  <h3
                    id={tier.id}
                    className={`text-xl sm:text-2xl font-bold leading-8 break-words ${
                      tier.mostPopular ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                </div>
                
                <p className={`mb-6 text-base sm:text-lg leading-7 break-words ${
                  tier.mostPopular ? 'text-emerald-100' : 'text-gray-600'
                }`}>
                  {tier.description}
                </p>
                
                <p className={`mb-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${
                  tier.mostPopular ? 'text-white' : 'text-gray-900'
                }`}>
                  Custom Pricing
                </p>
                
                <p className={`mb-6 text-sm sm:text-base break-words ${
                  tier.mostPopular ? 'text-emerald-100' : 'text-gray-500'
                }`}>
                  {tier.note}
                </p>
                
                <button
                  onClick={() => handleContactSales(tier)}
                  className={`w-full inline-flex items-center justify-center px-6 py-4 text-base font-semibold rounded-lg shadow-sm transition-colors duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    tier.mostPopular
                      ? 'bg-white text-emerald-600 hover:bg-gray-100 focus:ring-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'
                  }`}
                >
                  {tier.cta}
                </button>
                
                <ul role="list" className={`mt-8 space-y-4 text-sm sm:text-base leading-7 break-words ${
                  tier.mostPopular ? 'text-emerald-100' : 'text-gray-600'
                }`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3 items-start">
                      <CheckIcon
                        className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5 ${
                          tier.mostPopular ? 'text-white' : 'text-emerald-600'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="break-words leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
              Pricing Questions
            </h3>
            <dl className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-lg bg-gray-50 p-4 sm:p-6">
                  <dt className="text-sm sm:text-base font-semibold leading-7 text-gray-900 break-words">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-sm sm:text-base leading-7 text-gray-600 break-words">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 break-words">
              Ready to Get Started?
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto break-words leading-relaxed">
              Schedule a demo to see how integration will work with your specific business system
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-2xl mx-auto">
              <Link
                href="/invoice-builder"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-emerald-600 border border-transparent rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 touch-target"
              >
                See Demo
              </Link>
              <button 
                onClick={() => handleContactSales(tiers[1])}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target"
              >
                Contact Sales
                <span className="ml-2" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 