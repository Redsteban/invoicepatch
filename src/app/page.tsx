'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import MobileNavigation from '@/components/MobileNavigation';
import AnimatedBranding from '@/components/AnimatedBranding';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProblemSolution from '@/components/ProblemSolution';
import FeatureShowcase from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const simpleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  // Check for existing session on page load
  useEffect(() => {
    const checkSession = async () => {
      const sessionToken = localStorage.getItem('invoicepatch_session')
      
      if (sessionToken) {
        try {
          const response = await fetch('/api/auth/validate-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken })
          })

          const data = await response.json()

          if (data.valid) {
            // User is already authenticated, redirect to dashboard
            window.location.href = '/contractor/dashboard'
          } else {
            // Invalid session, remove token
            localStorage.removeItem('invoicepatch_session')
          }
        } catch (error) {
          console.error('Session check failed:', error)
          localStorage.removeItem('invoicepatch_session')
        }
      }
    }

    checkSession()
  }, [])

  return (
    <main className="min-h-screen bg-white overflow-x-hidden w-full">
      <MobileNavigation />
      <AnimatedBranding />
      <Hero />
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <ProblemSolution />
      </motion.div>
      
      <motion.div 
        id="features"
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Features />
      </motion.div>
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <FeatureShowcase />
      </motion.div>
      
      <motion.div 
        id="pricing"
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <Pricing />
      </motion.div>
      
      <motion.div 
        id="demo"
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <FAQ />
      </motion.div>
      
      <Footer />
    </main>
  );
}
