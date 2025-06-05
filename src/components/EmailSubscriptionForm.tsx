'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { trackEvent, trackFormEvent } from '@/lib/analytics';

interface EmailSubscriptionFormProps {
  formId?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  tags?: string[];
  className?: string;
  variant?: 'inline' | 'modal' | 'sidebar';
  showPrivacyNote?: boolean;
}

interface FormState {
  email: string;
  firstName: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function EmailSubscriptionForm({
  formId = 'newsletter',
  placeholder = "Enter your email address",
  buttonText = "Get Early Access",
  successMessage = "Thanks! Check your email for next steps.",
  tags = ['website-signup'],
  className = '',
  variant = 'inline',
  showPrivacyNote = true
}: EmailSubscriptionFormProps) {
  const [state, setState] = useState<FormState>({
    email: '',
    firstName: '',
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.isSubmitting || state.isSuccess) return;

    // Validation
    if (!state.email) {
      setState(prev => ({ ...prev, error: 'Email is required' }));
      return;
    }

    if (!validateEmail(state.email)) {
      setState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: null 
    }));

    // Track form start
    trackFormEvent(formId, 'started');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email,
          firstName: state.firstName || state.email.split('@')[0],
          formId,
          tags,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Subscription failed');
      }

      const data = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        isSuccess: true 
      }));

      // Track successful subscription
      trackFormEvent(formId, 'completed');
      trackEvent({
        action: 'email_subscribed',
        category: 'lead_generation',
        label: formId,
        custom_parameters: {
          email_domain: state.email.split('@')[1],
          form_variant: variant,
        }
      });

    } catch (error) {
      console.error('Subscription error:', error);
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        error: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
      }));

      // Track form abandonment
      trackFormEvent(formId, 'abandoned', 'api_error');
    }
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setState(prev => ({ 
      ...prev, 
      [field]: value,
      error: null // Clear error when user starts typing
    }));
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'modal':
        return 'max-w-md mx-auto';
      case 'sidebar':
        return 'max-w-sm';
      default:
        return 'max-w-lg';
    }
  };

  if (state.isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${getVariantClasses()} ${className}`}
      >
        <div className="rounded-2xl p-6 border border-gray-200 bg-white shadow-sm text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            You're In! 🎉
          </h3>
          <p className="text-slate-600 mb-4">
            {successMessage}
          </p>
          
          {variant === 'inline' && (
            <div className="text-sm text-slate-500">
              <p>📧 Confirmation email sent to <strong>{state.email}</strong></p>
              <p className="mt-2">💫 You'll get early access before anyone else!</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Never Miss Another Late Invoice
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Get early access to professional invoice management automation.
          </p>
        </div>

        {!state.isSuccess ? (
          /* Mobile-Optimized Form */
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={state.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-gray-300 px-4 py-4 text-slate-800 shadow-sm placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium min-h-[44px]"
                  required
                />
                {state.error && (
                  <p className="mt-2 text-sm text-red-600 font-medium text-left">{state.error}</p>
                )}
              </div>

              {/* Mobile-Optimized Submit Button */}
              <button
                type="submit"
                disabled={state.isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center space-x-2"
              >
                {state.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Securing Your Spot...</span>
                  </>
                ) : (
                  <>
                    <span>Get 90% Off - Secure Your Spot</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            {/* Mobile-Optimized Trust Indicators */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-slate-500">
                <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
                <span>Your email is safe. We never spam.</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Success State - Mobile Optimized */
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-emerald-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              🎉 Spot Secured!
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              Check your email for instant access to your 90% discount and setup instructions.
            </p>
            
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-xs sm:text-sm text-emerald-700 font-semibold">
                💰 You&apos;re saving $4,320 with early bird pricing!
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Regular price: $4,800/year • Your price: $480/year
              </p>
            </div>
          </div>
        )}

        {/* Mobile-Optimized Social Proof */}
        <div className="mt-8 sm:mt-10 lg:mt-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-slate-600">
            <div className="flex -space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-600 rounded-full border-2 border-white flex items-center justify-center">
                  <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                </div>
              ))}
            </div>
            <p className="font-semibold text-center text-sm sm:text-base">
              <span className="text-slate-800 font-black">67 contractors</span> joined in the last 48 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 