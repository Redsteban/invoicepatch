'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  GiftIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
  TrophyIcon,
  SparklesIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CustomerData {
  email?: string;
  company_name?: string;
  plan_type?: string;
  amount_paid?: number;
}

interface ReferralProgramProps {
  customerData?: CustomerData | null;
}

interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalCredits: number;
  nextRewardAt: number;
  currentStreak: number;
}

const rewardTiers = [
  { referrals: 1, reward: "1 Month Free", value: "$49", color: "emerald" },
  { referrals: 3, reward: "6 Months Free", value: "$294", color: "blue" },
  { referrals: 5, reward: "1 Year Free", value: "$588", color: "purple" },
  { referrals: 10, reward: "Lifetime Access", value: "$5,880", color: "yellow" },
];

export default function ReferralProgram({ customerData }: ReferralProgramProps) {
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 2,
    completedReferrals: 1,
    pendingReferrals: 1,
    totalCredits: 49,
    nextRewardAt: 3,
    currentStreak: 1
  });
  
  const [emailInput, setEmailInput] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const progressToNext = (stats.completedReferrals / stats.nextRewardAt) * 100;
  const referralUrl = `https://invoicepatch.com?ref=${customerData?.email?.split('@')[0] || 'founder'}`;

  const sendEmailInvite = async () => {
    if (!emailInput || !emailInput.includes('@')) return;
    
    setSendingInvite(true);
    
    // Track invite action
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'email_invite_sent', {
        event_category: 'referral',
        event_label: 'success_page'
      });
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInviteSent(true);
    setEmailInput('');
    
    // Update stats (in real app, this would come from API)
    setStats(prev => ({
      ...prev,
      totalReferrals: prev.totalReferrals + 1,
      pendingReferrals: prev.pendingReferrals + 1
    }));
    
    setTimeout(() => {
      setInviteSent(false);
      setSendingInvite(false);
    }, 2000);
  };

  const getCurrentTier = () => {
    return rewardTiers.find(tier => stats.completedReferrals < tier.referrals) || rewardTiers[rewardTiers.length - 1];
  };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
        border: 'border-emerald-200',
        light: 'bg-emerald-50 dark:bg-emerald-900/20'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600', 
        border: 'border-blue-200',
        light: 'bg-blue-50 dark:bg-blue-900/20'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        border: 'border-purple-200', 
        light: 'bg-purple-50 dark:bg-purple-900/20'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
        light: 'bg-yellow-50 dark:bg-yellow-900/20'
      }
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Referral Program Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Track your referrals, see your progress, and unlock amazing rewards. 
          The more you share, the more you save!
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
      >
        <div className="glass rounded-2xl p-6 border border-emerald-200/30 text-center">
          <UsersIcon className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Invites</div>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-blue-200/30 text-center">
          <CheckCircleIcon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedReferrals}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Successful Referrals</div>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-purple-200/30 text-center">
          <GiftIcon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalCredits}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Credits Earned</div>
        </div>
        
        <div className="glass rounded-2xl p-6 border border-yellow-200/30 text-center">
          <TrophyIcon className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Month Streak</div>
        </div>
      </motion.div>

      {/* Progress to Next Reward */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass rounded-2xl p-8 border border-emerald-200/30 mb-12"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Progress to Next Reward
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {stats.nextRewardAt - stats.completedReferrals} more referrals to unlock {getCurrentTier().reward}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{Math.round(progressToNext)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
            <span>{stats.completedReferrals} completed</span>
            <span>{stats.nextRewardAt} needed</span>
          </div>
        </div>
      </motion.div>

      {/* Send Invite Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass rounded-2xl p-8 border border-blue-200/30 mb-12"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Invite a Friend
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your friend's email address"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <motion.button
            onClick={sendEmailInvite}
            disabled={sendingInvite || !emailInput.includes('@')}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              inviteSent 
                ? 'bg-emerald-500' 
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'
            }`}
            whileHover={{ scale: sendingInvite ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {sendingInvite ? (
              <span className="flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Sending...
              </span>
            ) : inviteSent ? (
              <span className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Sent!
              </span>
            ) : (
              <span className="flex items-center">
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Send Invite
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Reward Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Reward Tiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardTiers.map((tier, index) => {
            const colors = getColorClasses(tier.color);
            const isAchieved = stats.completedReferrals >= tier.referrals;
            const isCurrent = getCurrentTier().referrals === tier.referrals;
            
            return (
              <motion.div
                key={tier.referrals}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className={`relative glass rounded-2xl p-6 border transition-all duration-300 ${
                  isAchieved 
                    ? `${colors.border} ${colors.light}` 
                    : isCurrent
                    ? 'border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/20'
                    : 'border-gray-200/50'
                }`}
              >
                {isAchieved && (
                  <div className="absolute -top-3 -right-3">
                    <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center`}>
                      <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                
                {isCurrent && !isAchieved && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Next Goal
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${isAchieved ? colors.text : 'text-gray-900 dark:text-white'}`}>
                    {tier.referrals}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Referrals
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {tier.reward}
                  </div>
                  <div className={`text-sm font-medium ${colors.text}`}>
                    {tier.value} Value
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Pro Tips */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="glass rounded-2xl p-8 border border-purple-200/30"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
          Pro Tips for More Referrals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-purple-600 text-sm font-bold">1</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Share Your Success Story</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tell friends how InvoicePatch is helping your business</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-purple-600 text-sm font-bold">2</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Post on Social Media</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Use our pre-written posts for maximum impact</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Network at Events</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Share your referral link at contractor meetups</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-purple-600 text-sm font-bold">4</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Follow Up</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Check in with referrals to help them through signup</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 