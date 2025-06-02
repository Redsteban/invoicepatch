'use client';

import { motion } from 'framer-motion';
import AnimatedBranding from '@/components/AnimatedBranding';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProblemSolution from '@/components/ProblemSolution';
import Testimonials from '@/components/Testimonials';
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
  return (
    <main>
      <AnimatedBranding />
      <Hero />
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <ProblemSolution />
      </motion.div>
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Features />
      </motion.div>
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Testimonials />
      </motion.div>
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Pricing />
      </motion.div>
      
      <motion.div 
        variants={simpleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <FAQ />
      </motion.div>
      
      <Footer />
    </main>
  );
}
