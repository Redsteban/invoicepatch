'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PlayCircleIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll to add background when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'How It Works', href: '#features', icon: DocumentTextIcon },
    { name: 'Pricing', href: '#pricing', icon: ChartBarIcon },
    { name: 'Demo', href: '#demo', icon: PlayCircleIcon },
    { name: 'Contact', href: '#contact', icon: PhoneIcon }
  ];

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200' 
          : 'bg-transparent'
      }`}>
        <div className="safe-top">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IP</span>
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">
                  Invoice<span className="text-emerald-600">Patch</span>
                </span>
              </Link>

              {/* Hamburger Menu Button */}
              <motion.button
                onClick={toggleMenu}
                className="mobile-button p-2 rounded-lg text-gray-900 hover:bg-gray-100 touch-target"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Bars3Icon className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="safe-top safe-bottom">
              {/* Menu Header */}
              <div className="px-6 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">IP</span>
                    </div>
                    <div className="ml-3">
                      <div className="text-lg font-bold text-gray-900">InvoicePatch</div>
                      <div className="text-sm text-gray-500">Reconciliation Made Simple</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="px-6 py-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="mobile-button flex items-center px-4 py-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 touch-target"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="h-5 w-5 mr-3 text-gray-400" />
                      {item.name}
                    </motion.a>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200" />

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/contractor-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="mobile-button w-full flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 touch-target"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Contractor Interface
                  </Link>

                  <Link
                    href="/manager-reconciliation"
                    onClick={() => setIsOpen(false)}
                    className="mobile-button w-full flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 touch-target"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    Manager Interface
                  </Link>

                  <button className="mobile-button w-full flex items-center justify-center px-4 py-3 text-base font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 touch-target">
                    <PlayCircleIcon className="h-5 w-5 mr-2" />
                    Watch Demo
                  </button>
                </div>
              </nav>

              {/* Contact Info */}
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>contact@invoicepatch.com</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>1-800-INVOICE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default MobileNavigation; 