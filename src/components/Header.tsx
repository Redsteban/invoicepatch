'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// Clean minimalistic components with consistent color palette
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
      text-[#6b7280] hover:text-[#1a1a1a] font-medium transition-colors duration-200
      ${className}
    `}
    onClick={onClick}
  >
    {children}
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
      px-4 py-2 rounded-lg font-medium transition-colors duration-200
      ${variant === 'primary' 
        ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]' 
        : 'border border-[#e5e7eb] text-[#1a1a1a] hover:bg-[#f9fafb]'
      }
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </Link>
);

const MobileMenuButton = ({ 
  isOpen, 
  onClick 
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 rounded-lg text-[#6b7280] hover:text-[#1a1a1a] hover:bg-[#f9fafb] transition-colors duration-200"
    aria-expanded={isOpen}
    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
  >
    {isOpen ? (
      <XMarkIcon className="h-6 w-6" />
    ) : (
      <Bars3Icon className="h-6 w-6" />
    )}
  </button>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`
        sticky top-0 z-50 transition-all duration-200
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-sm border-b border-[#e5e7eb] shadow-sm' 
          : 'bg-white border-b border-[#e5e7eb]'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#1a1a1a]">
              InvoicePatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/manager/login">Manager Trial</NavLink>
                            <NavLink href="/signup?type=contractor">Contractor Trial</NavLink>
            <NavLink href="/roi-calculator">ROI Calculator</NavLink>
            <NavLink href="/instant-proposal">Instant Proposal</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/contractor-trial">Log In</NavLink>
            <CTAButton href="/manager/login">
              Start Free Trial
            </CTAButton>
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton 
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-[#e5e7eb]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                <NavLink href="/manager/login" onClick={handleLinkClick} className="block py-2">
                  Manager Trial
                </NavLink>
                <NavLink href="/signup?type=contractor" onClick={handleLinkClick} className="block py-2">
                  Contractor Trial
                </NavLink>
                <NavLink href="/roi-calculator" onClick={handleLinkClick} className="block py-2">
                  ROI Calculator
                </NavLink>
                <NavLink href="/instant-proposal" onClick={handleLinkClick} className="block py-2">
                  Instant Proposal
                </NavLink>
                <NavLink href="/pricing" onClick={handleLinkClick} className="block py-2">
                  Pricing
                </NavLink>
                
                <div className="pt-4 border-t border-[#e5e7eb]">
                  <CTAButton
                    href="/manager/login"
                    onClick={handleLinkClick}
                    className="block text-center w-full"
                  >
                    Start Free Trial
                  </CTAButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 