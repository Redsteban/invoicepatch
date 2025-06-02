'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface EmailForm {
  email: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Hero() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 7, hours: 12, minutes: 30, seconds: 45 });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EmailForm>();

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
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: EmailForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to secure your spot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Problem Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full bg-emerald-50 px-4 py-2 text-sm leading-6 text-emerald-700 ring-1 ring-emerald-600/20">
              <ClockIcon className="inline h-4 w-4 mr-2" />
              Oil & gas managers spend 8+ hours weekly on contractor invoice reconciliation
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Stop Spending <span className="text-emerald-600">8 Hours Every Week</span>{' '}
            Reconciling Oilfield Contractor Invoices
          </h1>
          
          {/* Subheadline */}
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
            InvoicePatch syncs your AFE and well data directly to service contractor invoices. 
            Get pre-validated invoices with correct well IDs and project codes - approve in minutes, not hours.
          </p>

          {/* Value Props */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4">
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Pre-Validated Data</h3>
              <p className="text-sm text-gray-600">Invoices arrive with your exact project codes, rates, and locations</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-4">
                <ClockIcon className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">90% Time Savings</h3>
              <p className="text-sm text-gray-600">From 8 hours to 45 minutes weekly reconciliation time</p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-4">
                <ArrowRightIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">One-Click Approval</h3>
              <p className="text-sm text-gray-600">Since data matches perfectly, approve instantly with confidence</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/invoice-builder"
              className="rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex items-center space-x-2"
            >
              <span>See Reconciliation Demo</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <button className="group flex items-center space-x-2 text-lg font-semibold leading-6 text-gray-700 hover:text-emerald-600">
              <PlayCircleIcon className="h-6 w-6 group-hover:text-emerald-600" />
              <span>Watch 3-min walkthrough</span>
            </button>
          </div>

          {/* System Compatibility */}
          <div className="mt-16">
            <p className="text-sm font-semibold text-gray-500 mb-6">
              Syncs with your existing ERP system
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="bg-orange-600 text-white px-3 py-2 rounded font-bold text-sm">SAP</div>
              <div className="bg-gray-800 text-white px-3 py-2 rounded font-bold text-sm">JD Edwards</div>
              <div className="bg-blue-600 text-white px-3 py-2 rounded font-bold text-sm">Oracle</div>
              <div className="bg-emerald-600 text-white px-3 py-2 rounded font-bold text-sm">NetSuite</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200">
            <div className="flex items-center justify-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 mb-3">
              "Went from spending my entire Friday reconciling service contractor invoices to approving everything in 30 minutes. This is a game-changer for oil & gas operations teams."
            </blockquote>
            <cite className="text-sm text-gray-500">
              — Sarah Chen, Operations Manager, Suncor Energy Services
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
} 