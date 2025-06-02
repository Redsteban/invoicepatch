'use client';

import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  RocketLaunchIcon,
  DevicePhoneMobileIcon,
  BeakerIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const timelineSteps = [
  {
    id: 1,
    title: "Confirmation Email Sent",
    description: "Payment receipt and welcome package delivered to your inbox",
    icon: EnvelopeIcon,
    status: "completed",
    time: "Just now",
    details: [
      "Payment confirmation receipt",
      "Login credentials for founder portal",
      "Digital welcome package"
    ]
  },
  {
    id: 2,
    title: "Slack Community Invite",
    description: "Join our exclusive founder's Slack workspace",
    icon: UserGroupIcon,
    status: "pending",
    time: "Within 24 hours",
    details: [
      "Direct access to development team",
      "Weekly founder updates",
      "Feature request discussions",
      "Network with other contractors"
    ]
  },
  {
    id: 3,
    title: "Development Updates Begin",
    description: "Weekly behind-the-scenes progress reports",
    icon: RocketLaunchIcon,
    status: "upcoming",
    time: "Weekly starting tomorrow",
    details: [
      "Code screenshots and demos",
      "Feature development progress",
      "Architecture decisions explained",
      "Timeline updates"
    ]
  },
  {
    id: 4,
    title: "Mobile App Preview",
    description: "First look at the InvoicePatch mobile experience",
    icon: DevicePhoneMobileIcon,
    status: "upcoming",
    time: "Week of March 15th",
    details: [
      "iOS and Android previews",
      "GPS tracking demos",
      "Offline functionality showcase",
      "Feedback survey"
    ]
  },
  {
    id: 5,
    title: "Beta Testing Access",
    description: "Be the first to use InvoicePatch in your business",
    icon: BeakerIcon,
    status: "upcoming",
    time: "April 1st, 2024",
    details: [
      "Full platform access",
      "Real invoice testing",
      "Direct feedback channel",
      "Bug bounty program"
    ]
  },
  {
    id: 6,
    title: "Official Launch",
    description: "InvoicePatch goes live with your lifetime discount",
    icon: GiftIcon,
    status: "upcoming",
    time: "May 15th, 2024",
    details: [
      "Full feature availability",
      "Lifetime 90% discount active",
      "Priority customer support",
      "Founder badge in app"
    ]
  }
];

export default function NextStepsTimeline() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          What Happens Next?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your journey as an InvoicePatch founding member starts now. Here's exactly what to expect 
          over the next few months.
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500"></div>

        <div className="space-y-12">
          {timelineSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative flex items-start"
            >
              {/* Timeline Node */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                    step.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-800'
                      : step.status === 'pending'
                      ? 'bg-blue-500 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-300 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step.status === 'completed' ? (
                    <CheckCircleIcon className="w-8 h-8 text-white" />
                  ) : (
                    <step.icon className="w-8 h-8 text-white" />
                  )}
                </motion.div>

                {step.status === 'pending' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-blue-400"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="ml-8 flex-1">
                <motion.div
                  className={`glass rounded-2xl p-6 border ${
                    step.status === 'completed'
                      ? 'border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-900/20'
                      : step.status === 'pending'
                      ? 'border-blue-200/50 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'border-gray-200/50 bg-gray-50/50 dark:bg-gray-800/50'
                  }`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {step.description}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      step.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : step.status === 'pending'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {step.time}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + detailIndex * 0.05 }}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                      >
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 text-center glass rounded-2xl p-8 border border-emerald-200/30"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Questions About the Timeline?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We're here to help! Reach out anytime with questions about your founding member journey.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="mailto:founders@invoicepatch.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            Email Support
          </motion.a>
          <motion.button
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Join Slack Community
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 