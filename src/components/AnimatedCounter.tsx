'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface CounterStat {
  id: string;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

interface AnimatedCounterProps {
  stats: CounterStat[];
  className?: string;
}

function AnimatedNumber({ 
  value, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: { 
  value: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(value * easeOutCubic);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="inline-block">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export default function AnimatedCounter({ stats, className = '' }: AnimatedCounterProps) {
  const [pulseIndex, setPulseIndex] = useState(0);

  // Pulse effect every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex(prev => (prev + 1) % stats.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            Real Results for Canadian Contractors
          </h2>
          <p className="text-slate-600 text-lg">
            Join thousands who've transformed their invoicing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true }}
              className={`text-center relative ${
                pulseIndex === index ? 'animate-pulse-slow' : ''
              }`}
            >
              {/* Glow effect for active pulse */}
              {pulseIndex === index && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0.3 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute inset-0 bg-blue-400 rounded-xl blur-xl -z-10"
                />
              )}

              <div className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300 group cursor-pointer border border-gray-200">
                <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedNumber
                    value={stat.value}
                    duration={stat.duration || 2000}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                
                <p className="text-slate-700 font-semibold text-lg">
                  {stat.label}
                </p>

                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-slate-500 mb-4">
            Updated in real-time • Verified by third-party audits
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <span>Join These Success Stories</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Default stats for InvoicePatch
export const defaultStats: CounterStat[] = [
  {
    id: 'invoices',
    value: 1247,
    label: 'Invoices Processed',
    duration: 2500
  },
  {
    id: 'time-saved',
    value: 89,
    label: 'Time Saved',
    suffix: '%',
    duration: 2000
  },
  {
    id: 'recovered',
    value: 127000,
    label: 'Recovered Payments',
    prefix: '$',
    duration: 3000
  }
];
