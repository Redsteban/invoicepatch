'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  ShareIcon,
  LinkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface CustomerData {
  email?: string;
  company_name?: string;
  plan_type?: string;
  amount_paid?: number;
}

interface SocialSharingProps {
  customerData?: CustomerData | null;
}

const socialPlatforms = [
  {
    name: "LinkedIn",
    icon: "/icons/linkedin.svg",
    color: "bg-[#0077B5] hover:bg-[#005582]",
    message: "Just secured my spot as a founding member of InvoicePatch! 🚀\n\nAs an oilfield contractor, I'm tired of chasing payments from service companies and losing money to administrative tasks. InvoicePatch is building the solution we've all been waiting for:\n\n✅ 2-minute invoice creation\n✅ AFE/Well ID auto-population\n✅ Automated payment reminders\n✅ Canadian tax compliance (HST/PST on equipment vs services)\n✅ Real-time payment tracking\n✅ Per diem and travel allowance tracking\n\nI locked in 90% off for life and got early access to the beta. If you're a drilling contractor, service company, or oilfield consultant, you need to check this out.\n\n#InvoicePatch #OilAndGas #OilfieldContractors #FoundingMember #PaymentSolutions #CanadianEnergy",
    shareUrl: "https://www.linkedin.com/sharing/share-offsite/"
  },
  {
    name: "Twitter",
    icon: "/icons/twitter.svg", 
    color: "bg-[#1DA1F2] hover:bg-[#0d8bd9]",
    message: "Just became a founding member of @InvoicePatch! 🎉\n\nFinally, a payment solution built FOR oilfield contractors, BY contractors.\n\n• 90% off for life ✅\n• Early beta access ✅ \n• AFE code sync ✅\n• 2-min invoices ✅\n• Per diem tracking ✅\n\nOilfield contractors, this is what we've been waiting for! 🚀\n\n#InvoicePatch #OilAndGas #OilfieldContractors #FoundingMember",
    shareUrl: "https://twitter.com/intent/tweet"
  },
  {
    name: "Facebook",
    icon: "/icons/facebook.svg",
    color: "bg-[#1877F2] hover:bg-[#166fe5]",
    message: "I just joined InvoicePatch as a founding member! 🎉\n\nIf you're an oilfield contractor like me, you know the pain of chasing payments from service companies and spending hours on paperwork instead of actual field work.\n\nInvoicePatch is building the first payment platform designed specifically for Canadian oil & gas contractors:\n\n🔧 2-minute invoice creation with AFE codes\n📱 GPS-powered mileage tracking for remote sites\n💰 Automated payment reminders\n📊 Real-time payment tracking\n🇨🇦 Full Canadian tax compliance (equipment vs services)\n⛽ Per diem and travel allowance tracking\n\nI got 90% off for life and early access to the beta. The founding member community is already 247 oilfield contractors strong!\n\nIf you work for drilling companies, service companies, or as an oilfield consultant, you should definitely check this out. Link in comments! 👇",
    shareUrl: "https://www.facebook.com/sharer/sharer.php"
  }
];

export default function SocialSharing({ customerData }: SocialSharingProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(null);

  const referralUrl = `https://invoicepatch.com?ref=${customerData?.email?.split('@')[0] || 'founder'}`;

  const handleShare = (platform: { name: string; message: string; shareUrl: string }) => {
    const encodedMessage = encodeURIComponent(platform.message);
    const encodedUrl = encodeURIComponent(referralUrl);
    
    let shareUrl = '';
    
    switch (platform.name) {
      case 'LinkedIn':
        shareUrl = `${platform.shareUrl}?url=${encodedUrl}&title=${encodeURIComponent('InvoicePatch - Payment Solutions for Contractors')}&summary=${encodedMessage}`;
        break;
      case 'Twitter':
        shareUrl = `${platform.shareUrl}?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'Facebook':
        shareUrl = `${platform.shareUrl}?u=${encodedUrl}&quote=${encodedMessage}`;
        break;
    }

    // Track sharing action
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'social_share', {
        event_category: 'engagement',
        event_label: platform.name.toLowerCase(),
        custom_parameters: {
          platform: platform.name
        }
      });
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setSharedPlatform(platform.name);
    
    // Reset after animation
    setTimeout(() => setSharedPlatform(null), 2000);
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedLink(true);
      
      // Track copy action
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'referral_link_copy', {
          event_category: 'engagement',
          event_label: 'success_page'
        });
      }
      
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Spread the Word & Get Rewarded
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Help other oilfield contractors discover InvoicePatch! Share your founding member status 
          and earn rewards when friends join.
        </p>
      </motion.div>

      {/* Referral Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass rounded-2xl p-8 border border-emerald-200/30 mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your Personal Referral Link
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share this link and get 3 months free for every friend who joins!
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-700 dark:text-gray-300">
            {referralUrl}
          </div>
          <motion.button
            onClick={copyReferralLink}
            className={`px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
              copiedLink 
                ? 'bg-emerald-500 text-white' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copiedLink ? (
              <span className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Copied!
              </span>
            ) : (
              <span className="flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Copy Link
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Social Media Sharing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {socialPlatforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="relative group"
          >
            <div className="glass rounded-2xl p-6 border border-white/20 hover:border-emerald-300/50 transition-all duration-300 h-full">
              {/* Platform Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center transition-colors`}>
                  {/* Social Media Icons - You would replace with actual SVG icons */}
                  <ShareIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Share on {platform.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pre-written post ready to share
                  </p>
                </div>
              </div>

              {/* Message Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 max-h-32 overflow-y-auto">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {platform.message.substring(0, 150)}...
                </p>
              </div>

              {/* Share Button */}
              <motion.button
                onClick={() => handleShare(platform)}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${platform.color} hover:shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {sharedPlatform === platform.name ? (
                  <span className="flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Shared!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ShareIcon className="w-5 h-5 mr-2" />
                    Share on {platform.name}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Hover Glow Effect */}
            <div className={`absolute inset-0 ${platform.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
          </motion.div>
        ))}
      </div>

      {/* Rewards Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 glass rounded-2xl p-8 border border-blue-200/30 text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Referral Rewards Program
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">1 Friend</div>
            <div className="text-gray-600 dark:text-gray-400">1 Month Free</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3 Friends</div>
            <div className="text-gray-600 dark:text-gray-400">6 Months Free</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">5 Friends</div>
            <div className="text-gray-600 dark:text-gray-400">1 Year Free</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
          Rewards are automatically applied to your account when friends complete their purchase.
        </p>
      </motion.div>
    </div>
  );
} 