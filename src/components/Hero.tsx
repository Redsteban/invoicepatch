'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

const simpleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

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
    <div className="relative bg-white overflow-hidden mobile-container">
      {/* Simplified Background decoration */}
      <div className="absolute inset-x-0 -top-20 sm:-top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[calc(50%-5.5rem)] sm:left-[calc(50%-11rem)] aspect-[1155/678] w-[18rem] sm:w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-400 to-emerald-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="mx-auto max-w-6xl text-center">
          {/* Problem Badge */}
          <motion.div 
            className="mb-6 sm:mb-8 md:mb-10 flex justify-center px-2"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative rounded-full bg-red-50 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base leading-6 text-red-700 ring-1 ring-red-600/20 hover:scale-105 transition-transform duration-200 text-center max-w-full break-words">
              <ExclamationTriangleIcon className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">
                <span className="hidden sm:inline">Oilfield contractors lose $500-1000 per missed invoice deadline</span>
                <span className="sm:hidden">Contractors lose $500+ per missed deadline</span>
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight break-words hyphens-auto"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <span className="text-blue-600 block break-words">
              Stop Playing Invoice Detective
            </span>
            <span className="block break-words text-gray-900"> 
              Every Friday Afternoon
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-600 max-w-4xl mx-auto break-words"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Upload your project data once. Contractors submit pre-matched invoices. 
            Approve everything in minutes, not hours.
          </motion.p>

          {/* CTA Section */}
          <motion.div 
            className="mt-8 sm:mt-10 md:mt-12 flex flex-col gap-4 sm:gap-6"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
              <Link
                href="/invoice-setup"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-white bg-emerald-600 border border-transparent rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 touch-target group"
              >
                <span className="flex flex-col items-center sm:flex-row sm:items-center">
                  <span className="flex items-center">
                    Start Free Trial
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </span>
                  <span className="text-sm text-emerald-100 mt-1 sm:mt-0 sm:ml-2 font-normal">
                    Set up your invoice in 2 minutes
                  </span>
                </span>
              </Link>
              
              <Link
                href="/contractor-dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target group"
              >
                <span className="flex flex-col items-center sm:flex-row sm:items-center">
                  <span className="flex items-center">
                    Contractor Interface
                    <DocumentTextIcon className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  </span>
                  <span className="text-sm text-blue-100 mt-1 sm:mt-0 sm:ml-2 font-normal">
                    Mobile entry, time tracking, invoicing
                  </span>
                </span>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 touch-target">
                <PlayCircleIcon className="mr-2 h-5 w-5 flex-shrink-0" />
                Watch 2-min demo
              </button>
            </div>
          </motion.div>

          {/* Stats Grid - Mobile Optimized */}
          <motion.div 
            className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3 max-w-4xl mx-auto"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col items-center gap-y-3 text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <dd className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-600 break-words">8+ hours</dd>
              <dt className="text-sm sm:text-base leading-relaxed text-gray-600 break-words">Average time saved per week</dt>
            </div>
            <div className="flex flex-col items-center gap-y-3 text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <dd className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-600">95%</dd>
              <dt className="text-sm sm:text-base leading-relaxed text-gray-600 break-words">Billing error reduction</dt>
            </div>
            <div className="flex flex-col items-center gap-y-3 text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <dd className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-emerald-600">3x</dd>
              <dt className="text-sm sm:text-base leading-relaxed text-gray-600 break-words">Faster payment processing</dt>
            </div>
          </motion.div>

          {/* Countdown Timer - Mobile Responsive */}
          <motion.div 
            className="mt-12 sm:mt-16 md:mt-20 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto"
            variants={simpleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-900 mb-4 text-center break-words">
              🔥 Limited Early Access
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">{timeLeft.days}</div>
                <div className="text-xs sm:text-sm text-orange-700 font-medium">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">{timeLeft.hours}</div>
                <div className="text-xs sm:text-sm text-orange-700 font-medium">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">{timeLeft.minutes}</div>
                <div className="text-xs sm:text-sm text-orange-700 font-medium">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">{timeLeft.seconds}</div>
                <div className="text-xs sm:text-sm text-orange-700 font-medium">Seconds</div>
              </div>
            </div>
            
            {/* Email Signup Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="Enter your email for early access"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 touch-target"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 break-words">{errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-orange-600 border border-transparent rounded-lg shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 touch-target"
                >
                  {isSubmitting ? 'Securing...' : 'Secure My Spot'}
                </button>
              </form>
            ) : (
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Thank you! We'll notify you when early access opens.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 