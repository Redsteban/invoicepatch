'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface TrustSignal {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface CompanyLogo {
  id: string;
  name: string;
  logo?: string;
  industry: string;
}

interface TrustSignalsProps {
  trustSignals?: TrustSignal[];
  companyLogos?: CompanyLogo[];
  className?: string;
}

function SecurityBadge({ title, subtitle, icon: Icon, color }: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="group"
    >
      <div className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={isInView ? { rotate: 0, scale: 1 } : { rotate: -10, scale: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
        <p className="text-xs text-slate-600">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function CompanyCard({ company, index }: { company: CompanyLogo; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg p-4 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50 transition-colors duration-300">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-2xl font-bold text-slate-400">
            {company.name.charAt(0)}
          </span>
        )}
      </div>
      <h4 className="font-semibold text-sm text-slate-800 mb-1">{company.name}</h4>
      <p className="text-xs text-slate-500">{company.industry}</p>
    </motion.div>
  );
}

export default function TrustSignals({ className = '' }: TrustSignalsProps) {
  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Trusted by Canadian Contractors Across the Country
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Join hundreds of contractors who've transformed their invoicing process and never miss another paycheck.
          </p>
        </div>

        {/* Trust Badges - Mobile First Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <ShieldCheckIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">CRA Compliant</div>
            <div className="text-xs sm:text-sm text-slate-600">Tax-ready invoices</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <LockClosedIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">Bank-Level Security</div>
            <div className="text-xs sm:text-sm text-slate-600">256-bit encryption</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <ClockIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">5-Min Setup</div>
            <div className="text-xs sm:text-sm text-slate-600">Quick integration</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <PhoneIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
            <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-800 mb-1">24/7 Support</div>
            <div className="text-xs sm:text-sm text-slate-600">Canadian team</div>
          </div>
        </div>

        {/* Money Back Guarantee - Mobile Optimized */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-sm border border-gray-200 mb-12 sm:mb-16 lg:mb-20 mx-2 sm:mx-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl">💰</div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
                  100% Money-Back Guarantee
                </h3>
                <p className="text-sm sm:text-lg text-slate-600">
                  If InvoicePatch doesn&apos;t save you at least $200 in the first 30 days, we&apos;ll refund every penny
                  <span className="font-bold text-emerald-600"> + give you $100 for your time</span>.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <p className="text-xs sm:text-sm text-slate-600 italic">
                &quot;I was skeptical, but InvoicePatch saved me $847 in my first month by catching late submissions 
                and automating my mileage tracking. The guarantee made it a no-brainer.&quot;
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-semibold">
                - Sarah M., Edmonton Electrical Contractor
              </p>
            </div>
          </div>
        </div>

        {/* Statistics - Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2">500+</div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-semibold">Active Contractors</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Across all provinces</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2">$2.1M+</div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-semibold">Recovered Revenue</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">From late submissions</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 mb-2">99.7%</div>
            <div className="text-sm sm:text-base lg:text-lg text-slate-600 font-semibold">On-Time Rate</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Invoice submissions</div>
          </div>
        </div>

        {/* Quick Testimonials - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex space-x-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mb-3 italic">
              &quot;Cut my invoice time from 4 hours to 15 minutes. Already recovered $1,200 in missed mileage claims!&quot;
            </p>
            <div className="text-xs sm:text-sm text-slate-500 font-semibold">
              Mike R. - Toronto Plumber
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex space-x-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <StarIcon key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mb-3 italic">
              &quot;My contractors love it. No more chasing late invoices. Cash flow improved 200%.&quot;
            </p>
            <div className="text-xs sm:text-sm text-slate-500 font-semibold">
              Lisa C. - Calgary Construction Manager
            </div>
          </div>
        </div>

        {/* Final CTA - Mobile Optimized */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 lg:p-12 border border-blue-200">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-4">
              Ready to Never Miss Another Paycheck?
            </h3>
            <p className="text-sm sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join the smart contractors who&apos;ve automated their invoicing and recovered thousands in lost revenue.
            </p>
            
            {/* Mobile-Optimized CTA Button */}
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg lg:text-xl font-bold py-4 px-6 sm:px-8 lg:px-12 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 min-h-[44px] mx-auto">
              Get 90% Off - Secure Your Spot Now
            </button>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span>14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckIcon className="h-4 w-4 text-emerald-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default trust signals
const defaultTrustSignals: TrustSignal[] = [
  {
    id: 'ssl',
    title: 'SSL Encrypted',
    description: 'Bank-level security',
    icon: LockClosedIcon,
    color: 'bg-blue-600'
  },
  {
    id: 'pipeda',
    title: 'PIPEDA Compliant', 
    description: 'Privacy protected',
    icon: ShieldCheckIcon,
    color: 'bg-blue-600'
  },
  {
    id: 'cra',
    title: 'CRA Approved',
    description: 'Tax compliant', 
    icon: CheckBadgeIcon,
    color: 'bg-blue-600'
  },
  {
    id: 'canadian',
    title: 'Canadian Hosted',
    description: 'Local data storage',
    icon: GlobeAltIcon,
    color: 'bg-blue-600'
  }
];

// Default company logos (placeholder data)
const defaultCompanyLogos: CompanyLogo[] = [
  { id: '1', name: 'TechCorp', industry: 'Technology' },
  { id: '2', name: 'BuildCo', industry: 'Construction' },
  { id: '3', name: 'ElectriTech', industry: 'Electrical' },
  { id: '4', name: 'PlumbPro', industry: 'Plumbing' }
]; 