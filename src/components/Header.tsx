'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Ethan Marcotte Atomic Components with Enhanced 3D
const NavLink = ({ 
  href, 
  children, 
  onClick, 
  className = "" 
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <Link 
    href={href} 
    className={`
      text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 
      focus-ring relative group micro-lift
      ${className}
    `}
    onClick={onClick}
  >
    <span className="relative z-10">{children}</span>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-amber-100 via-teal-100 to-violet-100 rounded-md opacity-0 group-hover:opacity-100 -z-0"
      initial={false}
      whileHover={{ 
        scale: 1.05,
        rotateZ: 1,
        transition: { duration: 0.3 }
      }}
    />
  </Link>
);

const CTAButton = ({ 
  href, 
  children, 
  variant = 'primary',
  onClick,
  className = ""
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}) => (
  <Link
    href={href}
    className={`
      atom-button--${variant} micro-lift micro-glow focus-ring
      ${className}
    `}
    onClick={onClick}
  >
    <span className="relative">
      {children}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded"
        initial={false}
        whileHover={{ 
          scale: 1.02,
          rotateZ: 1,
          transition: { duration: 0.2 }
        }}
      />
    </span>
  </Link>
);

const MobileMenuButton = ({ 
  isOpen, 
  onClick 
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    className="md:hidden touch-target focus-ring rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
    whileTap={{ scale: 0.95, rotateZ: 5 }}
    whileHover={{
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.2 }
    }}
    transition={{ duration: 0.1 }}
    aria-expanded={isOpen}
    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "backOut" }}
        >
          <XMarkIcon className="h-6 w-6" />
        </motion.div>
      ) : (
        <motion.div
          key="open"
          initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "backOut" }}
        >
          <Bars3Icon className="h-6 w-6" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Ethan Marcotte progressive enhancement - scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change (accessibility)
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 progressive-blur border-b border-slate-200 shadow-sm' 
          : 'bg-white border-b border-slate-200'
        }
      `}
      initial={{ y: -100, rotateX: -10 }}
      animate={{ y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      whileHover={isScrolled ? {
        backdropFilter: "blur(20px)",
        transition: { duration: 0.3 }
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced micro-interaction */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Link href="/" className="flex items-center group focus-ring rounded">
              <motion.span 
                className="text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.03,
                  rotateZ: -1,
                  transition: { duration: 0.2 }
                }}
              >
                Invoice
              </motion.span>
              <motion.span 
                className="text-2xl font-light text-slate-700 group-hover:text-slate-500 transition-colors duration-300"
                whileHover={{ 
                  scale: 1.03,
                  rotateZ: 1,
                  transition: { duration: 0.2, delay: 0.05 }
                }}
              >
                Patch
              </motion.span>
              {/* Subtle logo accent */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400 via-teal-400 to-violet-400 rounded opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                whileHover={{
                  scale: 1.1,
                  rotateZ: 2
                }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation with staggered animation */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { href: '/manager-demo', label: 'Manager Demo' },
              { href: '/contractor-trial', label: 'Contractor Trial' },
              { href: '/roi-calculator', label: 'ROI Calculator' },
              { href: '/instant-proposal', label: 'Instant Proposal' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/about', label: 'About' }
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3 + (index * 0.1) 
                }}
              >
                <NavLink href={item.href}>{item.label}</NavLink>
              </motion.div>
            ))}
          </motion.nav>

          {/* CTA Buttons with enhanced 3D */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotateZ: 1,
                transition: { duration: 0.2 }
              }}
            >
              <NavLink 
                href="/contractor-trial"
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Log In
              </NavLink>
            </motion.div>
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotateZ: -1,
                transition: { duration: 0.2 }
              }}
            >
              <CTAButton href="/manager-demo">
                Start Free Trial
              </CTAButton>
            </motion.div>
          </motion.div>

          {/* Mobile menu button with enhanced animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MobileMenuButton 
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </motion.div>
        </div>

        {/* Mobile Navigation with enhanced 3D depth */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-slate-200"
              initial={{ opacity: 0, height: 0, rotateX: -10 }}
              animate={{ opacity: 1, height: 'auto', rotateX: 0 }}
              exit={{ opacity: 0, height: 0, rotateX: -10 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <motion.div 
                className="flex flex-col space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {[
                  { href: '/manager-demo', label: 'Manager Demo' },
                  { href: '/contractor-trial', label: 'Contractor Trial' },
                  { href: '/roi-calculator', label: 'ROI Calculator' },
                  { href: '/instant-proposal', label: 'Instant Proposal' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/about', label: 'About' }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -30, rotateY: -5 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: -30, rotateY: -5 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.1 + (index * 0.08),
                      ease: "easeOut"
                    }}
                    whileHover={{
                      x: 6,
                      rotateY: 2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <NavLink 
                      href={item.href}
                      onClick={handleLinkClick}
                      className="block py-2"
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                
                <motion.div 
                  className="pt-4 border-t border-slate-200"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{
                    scale: 1.02,
                    rotateZ: 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <CTAButton
                    href="/manager-demo"
                    onClick={handleLinkClick}
                    className="block text-center w-full"
                  >
                    Start Free Trial
                  </CTAButton>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
} 