'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  UserGroupIcon,
  DocumentArrowDownIcon,
  StarIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const perks = [
  {
    id: 1,
    title: "Exclusive Slack Community",
    description: "Join 247 founding members in our private workspace",
    icon: UserGroupIcon,
    action: "Join Now",
    highlight: "🔥 Most Active",
    benefits: [
      "Direct access to the founding team",
      "Weekly 'Ask Me Anything' sessions",
      "Feature voting and roadmap input",
      "Networking with successful contractors",
      "Early access to beta features"
    ],
    buttonText: "Join Slack Community",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white"
  },
  {
    id: 2,
    title: "Contractor's Payment Guide",
    description: "38-page PDF: 'Never Miss Another Payment'",
    icon: DocumentArrowDownIcon,
    action: "Download",
    highlight: "📚 $297 Value",
    benefits: [
      "Legal templates for payment terms",
      "Follow-up email sequences that work",
      "Canadian lien law simplified",
      "Payment tracking spreadsheets",
      "Client red flag checklist"
    ],
    buttonText: "Download PDF Guide",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white"
  },
  {
    id: 3,
    title: "Founder's Advisory Board",
    description: "Help shape InvoicePatch's future",
    icon: StarIcon,
    action: "Apply",
    highlight: "👑 VIP Access",
    benefits: [
      "Monthly video calls with founders",
      "First look at new features",
      "Product naming and design input",
      "Priority feature development",
      "Lifetime advisory board status"
    ],
    buttonText: "Apply for Board",
    buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white"
  },
  {
    id: 4,
    title: "Priority Support Channel",
    description: "Skip the line with founder support",
    icon: ShieldCheckIcon,
    action: "Activate",
    highlight: "⚡ Instant Access",
    benefits: [
      "Direct line to technical team",
      "Response within 2 hours",
      "Screen sharing support sessions",
      "Custom feature requests",
      "White-glove onboarding"
    ],
    buttonText: "Activate Support",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white"
  }
];

export default function ExclusivePerks() {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [joiningSlack, setJoiningSlack] = useState(false);

  const handleSlackJoin = async () => {
    setJoiningSlack(true);
    // Track action
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'slack_community_join', {
        event_category: 'engagement',
        event_label: 'success_page'
      });
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to Slack invite (you'd replace with actual Slack invite URL)
    window.open('https://join.slack.com/t/invoicepatch-founders/shared_invite/xyz', '_blank');
    setJoiningSlack(false);
  };

  const handlePdfDownload = async () => {
    setDownloadingPdf(true);
    // Track action
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pdf_download', {
        event_category: 'engagement',
        event_label: 'contractors_payment_guide'
      });
    }

    // Simulate PDF generation/download
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create download link for PDF
    const link = document.createElement('a');
    link.href = '/pdfs/contractors-payment-guide.pdf';
    link.download = 'InvoicePatch-Contractors-Payment-Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDownloadingPdf(false);
  };

  const handleGenericAction = (perkTitle: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'perk_action', {
        event_category: 'engagement',
        event_label: perkTitle.toLowerCase().replace(/\s+/g, '_')
      });
    }
    
    // You can add specific logic for each perk action here
    alert(`${perkTitle} feature coming soon! You'll be notified via email.`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Exclusive Founder Perks
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          As a founding member, you get instant access to resources and communities 
          worth over $1,200 – completely free.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {perks.map((perk, index) => (
          <motion.div
            key={perk.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="glass rounded-2xl p-8 border border-white/20 hover:border-emerald-300/50 transition-all duration-300 h-full">
              {/* Highlight Badge */}
              <div className="absolute -top-3 left-8">
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {perk.highlight}
                </span>
              </div>

              {/* Icon and Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <perk.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {perk.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {perk.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <ul className="space-y-3 mb-8">
                {perk.benefits.map((benefit, benefitIndex) => (
                  <motion.li
                    key={benefitIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + benefitIndex * 0.05 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {benefit}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Action Button */}
              <motion.button
                onClick={() => {
                  if (perk.id === 1) handleSlackJoin();
                  else if (perk.id === 2) handlePdfDownload();
                  else handleGenericAction(perk.title);
                }}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${perk.buttonClass} hover:shadow-lg hover:shadow-emerald-500/25`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={downloadingPdf || joiningSlack}
              >
                {perk.id === 1 && joiningSlack ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Joining...
                  </span>
                ) : perk.id === 2 && downloadingPdf ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Preparing Download...
                  </span>
                ) : (
                  perk.buttonText
                )}
              </motion.button>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </motion.div>
        ))}
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-600 mb-2">247</div>
          <div className="text-gray-600 dark:text-gray-400">Active Slack Members</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">1,893</div>
          <div className="text-gray-600 dark:text-gray-400">PDF Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
          <div className="text-gray-600 dark:text-gray-400">Member Satisfaction</div>
        </div>
      </motion.div>
    </div>
  );
} 