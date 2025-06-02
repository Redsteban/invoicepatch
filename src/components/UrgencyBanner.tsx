'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ClockIcon, FireIcon } from '@heroicons/react/20/solid';

interface UrgencyBannerProps {
  spotsLeft?: number;
  timeLeft?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  message?: string;
  onClose?: () => void;
  className?: string;
}

export default function UrgencyBanner({ 
  spotsLeft = 67, 
  timeLeft: initialTimeLeft,
  message = "Price increases",
  onClose,
  className = ''
}: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(
    initialTimeLeft || { hours: 23, minutes: 14, seconds: 32 }
  );
  const [pulseActive, setPulseActive] = useState(false);

  // Countdown timer
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

  // Pulse effect every 10 seconds
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 1000);
    }, 10000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 ${className}`}
      >
        <div className="relative overflow-hidden">
          {/* Clean red background for urgency */}
          <div className="bg-red-600" />
          
          {/* Pulse Overlay */}
          <AnimatePresence>
            {pulseActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-white"
              />
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center py-3 text-white">
                <div className="flex items-center space-x-4 flex-wrap justify-center">
                  {/* Lightning Icon */}
                  <motion.div
                    animate={pulseActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-1"
                  >
                    <FireIcon className="w-5 h-5 text-white" />
                    <span className="font-bold text-white">⚡</span>
                  </motion.div>

                  {/* Spots Left */}
                  <motion.div
                    animate={pulseActive ? { scale: [1, 1.1, 1] } : {}}
                    className="flex items-center space-x-2"
                  >
                    <span className="font-bold">{spotsLeft} spots left</span>
                    <span className="text-white/70">•</span>
                  </motion.div>

                  {/* Countdown */}
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span className="font-medium">{message} in:</span>
                    
                    <div className="flex items-center space-x-1 font-mono font-bold">
                      <motion.span
                        key={timeLeft.hours}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/20 px-2 py-1 rounded text-sm"
                      >
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </motion.span>
                      <span>:</span>
                      <motion.span
                        key={timeLeft.minutes}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/20 px-2 py-1 rounded text-sm"
                      >
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </motion.span>
                      <span>:</span>
                      <motion.span
                        key={timeLeft.seconds}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/20 px-2 py-1 rounded text-sm"
                      >
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </motion.span>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors hidden sm:block"
                  >
                    Secure Your Spot →
                  </motion.button>
                </div>

                {/* Close Button */}
                {onClose && (
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/30"
            style={{ width: `${(spotsLeft / 100) * 100}%` }}
            animate={pulseActive ? { 
              boxShadow: [
                '0 0 5px rgba(255,255,255,0.5)',
                '0 0 20px rgba(255,255,255,0.8)',
                '0 0 5px rgba(255,255,255,0.5)'
              ]
            } : {}}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden bg-red-700 px-4 py-2 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-red-600 px-6 py-2 rounded-full font-bold text-sm w-full"
          >
            Secure Your Spot
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact version for less intrusive placement
export function CompactUrgencyBanner({ 
  spotsLeft = 67,
  className = ''
}: { 
  spotsLeft?: number;
  className?: string;
}) {
  return (
    <div className={`bg-red-600 text-white text-center py-2 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-center space-x-4 text-sm">
        <FireIcon className="w-4 h-4" />
        <span className="font-semibold">Only {spotsLeft} founding member spots left</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-white text-red-600 px-3 py-1 rounded font-bold text-xs"
        >
          Claim Yours →
        </motion.button>
      </div>
    </div>
  );
} 