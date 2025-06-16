'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  FireIcon,
  DevicePhoneMobileIcon
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

// Ethan Marcotte Atomic Components with sophisticated 3D
const CTAButton = ({ 
  href, 
  variant = 'primary', 
  icon: Icon, 
  children, 
  className = "",
  ...props 
}: {
  href: string;
  variant?: 'primary' | 'secondary';
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={`
      atom-button--${variant} micro-lift micro-glow
      inline-flex items-center justify-center group
      ${className}
    `}
    {...props}
  >
    {Icon && (
      <motion.div
        whileHover={{ 
          scale: 1.1, 
          rotateZ: 5,
          transition: { duration: 0.2 }
        }}
      >
        <Icon className="h-6 w-6 mr-2 transition-transform duration-300" />
      </motion.div>
    )}
    <span className="relative">
      {children}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded"
        initial={false}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />
    </span>
  </Link>
);

const StatCard = ({ 
  value, 
  label, 
  delay = 0 
}: { 
  value: string; 
  label: string; 
  delay?: number; 
}) => (
  <motion.div 
    className="text-center group cursor-default"
    initial={{ opacity: 0, y: 30, rotateX: -15, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
    transition={{ 
      delay, 
      duration: 0.8, 
      ease: [0.25, 1, 0.5, 1]
    }}
    whileHover={{ 
      scale: 1.08,
      rotateY: 5,
      rotateX: 5,
      transition: { duration: 0.3 }
    }}
  >
    <motion.div 
      className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-300"
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4, duration: 0.6 }}
      >
        {value}
      </motion.span>
    </motion.div>
    <div className="text-lg text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
      {label}
    </div>
  </motion.div>
);

const ProblemSolutionCard = ({ 
  type, 
  icon: Icon, 
  title, 
  items, 
  delay = 0 
}: {
  type: 'problem' | 'solution';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  items: string[];
  delay?: number;
}) => {
  const isProblem = type === 'problem';
  
  return (
    <motion.div
      className={`
        atom-card p-8 group relative overflow-hidden
        ${isProblem ? 'bg-slate-50' : 'bg-white border-2 border-slate-900'}
      `}
      initial={{ opacity: 0, x: isProblem ? -50 : 50, rotateY: isProblem ? -10 : 10 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        delay, 
        duration: 0.8, 
        ease: [0.25, 1, 0.5, 1]
      }}
      whileHover={{ 
        y: -8,
        rotateX: 6,
        rotateY: isProblem ? 3 : -3,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Enhanced background pattern */}
      <motion.div 
        className={`
          absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500
          ${isProblem ? 'bg-amber-100' : 'bg-teal-100'}
        `}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <h3 className={`
        text-2xl font-bold mb-6 flex items-center justify-center relative z-10
        ${isProblem ? 'text-slate-900' : 'text-slate-900'}
      `}>
        <motion.div
          whileHover={{ 
            scale: 1.2, 
            rotateZ: isProblem ? -5 : 5,
            transition: { duration: 0.3 }
          }}
        >
          <Icon className={`
            h-8 w-8 mr-3 transition-transform duration-300
            ${isProblem ? 'text-slate-600' : 'text-slate-900'}
          `} />
        </motion.div>
        {title}
      </h3>
      
      <ul className="space-y-4 text-left relative z-10">
        {items.map((item, index) => (
          <motion.li 
            key={index}
            className="flex items-start"
            initial={{ opacity: 0, x: -20, rotateX: -5 }}
            whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: delay + (index * 0.15), 
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{
              x: 6,
              transition: { duration: 0.2 }
            }}
          >
            <motion.span 
              className={`
                text-xl mr-4 mt-1 transition-transform duration-300
                ${isProblem ? 'text-slate-500' : 'text-slate-900'}
              `}
              whileHover={{ 
                scale: 1.3, 
                rotateZ: isProblem ? 0 : 180,
                transition: { duration: 0.3 }
              }}
            >
              {isProblem ? '•' : '✓'}
            </motion.span>
            <span className={`
              text-lg transition-colors duration-300
              ${isProblem ? 'text-slate-700' : 'text-slate-700'}
            `}>
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
      
      {/* Enhanced hover accent with gradient */}
      <motion.div
        className={`
          absolute bottom-0 left-0 right-0 h-2 
          ${isProblem 
            ? 'bg-gradient-to-r from-amber-400 to-amber-600' 
            : 'bg-gradient-to-r from-teal-400 to-violet-500'
          }
        `}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
};

const SocialProofSection = () => (
  <motion.div
    className="text-center mb-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <p className="text-slate-600 mb-6">Professional invoice management made simple</p>
    
    {/* Security & Features badges instead of fake social proof */}
    <div className="flex justify-center items-center space-x-8 mb-8">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-slate-600">CRA Compliant</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-slate-600">Secure & Private</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-slate-600">Fast Setup</span>
      </div>
    </div>
  </motion.div>
);

const FinalCTASection = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <motion.div 
      className="atom-card p-8 max-w-2xl mx-auto bg-gradient-to-br from-white to-slate-50 relative overflow-hidden"
      whileHover={{
        rotateX: 4,
        rotateY: -2,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Enhanced decorative background elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-200 to-teal-200 rounded-full opacity-20"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      <motion.div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-violet-200 to-amber-200 rounded-full opacity-15"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
          x: [0, -8, 0],
          y: [0, 8, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">
        See How You Can Save 8 Hours This Week
      </h3>
      <p className="text-slate-600 mb-6 relative z-10">
        Upload your contractor invoices. See the magic happen in real-time.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <CTAButton
            href="/manager/login"
            variant="primary"
            className="group-hover:shadow-lg"
          >
            Start Free Demo
          </CTAButton>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <CTAButton
            href="/roi-calculator"
            variant="secondary"
            className="group-hover:border-slate-400"
          >
            Calculate Your Savings
          </CTAButton>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

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
    <div className="relative overflow-hidden bg-white">
      {/* Main Hero Section */}
      <section className="organism-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-slate-900"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            Process All Contractor Payments in Minutes, Not Hours or Days
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-slate-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Upload 20 contractor invoices. Get reconciled data in 3 minutes. 
            Save $1,200/month starting today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <CTAButton
              href="/manager/login"
              variant="primary"
              icon={DocumentTextIcon}
            >
              Free Manager Demo
            </CTAButton>
            <CTAButton
                              href="/signup?type=contractor"
              variant="secondary"
              icon={DevicePhoneMobileIcon}
            >
              Contractor Trial
            </CTAButton>
          </motion.div>



          {/* Enhanced Quick Stats with 3D depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StatCard value="94.7%" label="Auto-match accuracy" delay={1.0} />
            <StatCard value="3 min" label="Processing time" delay={1.1} />
            <StatCard value="$29K+" label="Monthly value delivered" delay={1.2} />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-8"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              Managers: You're Spending Too Much Time Being the Invoice Police
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <ProblemSolutionCard
                type="problem"
                icon={ExclamationTriangleIcon}
                title="Your Current Reality"
                items={[
                  "8+ hours every week matching invoices to work orders",
                  "Contractors submit wrong rates, missing codes",
                  "Manual data entry into QuickBooks/Sage",
                  "Chasing contractors for missing information",
                  "Budget overruns from reconciliation delays"
                ]}
                delay={0.2}
              />
              
              <ProblemSolutionCard
                type="solution"
                icon={CheckCircleIcon}
                title="With InvoicePatch"
                items={[
                  "30 seconds to reconcile 20+ invoices",
                  "Auto-matched work orders and rates",
                  "Direct export to your accounting system",
                  "Complete visibility into all contractor charges",
                  "Real-time budget tracking and alerts"
                ]}
                delay={0.4}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof & CTA Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialProofSection />
          <FinalCTASection />
        </div>
      </section>
    </div>
  );
} 