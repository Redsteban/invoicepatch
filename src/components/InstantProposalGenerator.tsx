'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowDownIcon, ClockIcon, CalculatorIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface DemoData {
  contractors: number;
  hoursPerWeek: number;
  monthlyCost: number;
  errorRate: number;
  savings: number;
  currentMonthlyCost: number;
  roiPercentage: number;
  annualSavings: number;
}

interface InstantProposalGeneratorProps {
  demoData: DemoData;
}

// Steve Jobs-inspired animation variants
const jobsVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // Apple's signature easing
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Atomic Components - Clean, purposeful, reusable
const MetricCard = ({ icon, label, value, highlight = false }: any) => (
  <motion.div 
    className={`
      atom-card p-6 text-center
      ${highlight ? 'bg-gradient-to-br from-amber-500/10 to-teal-500/10 border-amber-400/30' : 'border-slate-700/30'}
      transform-gpu will-change-transform
    `}
    variants={jobsVariants}
    whileHover={{ 
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
    style={{
      background: highlight 
        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)'
        : 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
      backdropFilter: 'blur(8px)',
      boxShadow: highlight ? 'var(--shadow-3d)' : '0 4px 14px rgba(0, 0, 0, 0.1)'
    }}
  >
    <div className={`text-3xl mb-3 ${highlight ? 'text-amber-400' : 'text-teal-400'}`}>
      {icon}
    </div>
    <div className={`text-2xl font-light mb-1 ${highlight ? 'text-amber-200' : 'text-white'}`}>
      {value}
    </div>
    <div className={`text-sm font-medium ${highlight ? 'text-amber-300/80' : 'text-slate-400'}`}>
      {label}
    </div>
  </motion.div>
);

const PrimaryButton = ({ children, onClick, loading = false, className = '' }: any) => (
  <motion.button
    onClick={onClick}
    disabled={loading}
    className={`
      atom-button bg-gradient-to-r from-amber-500 to-amber-600 
      text-slate-900 px-8 py-4 rounded-xl font-medium text-lg
      hover:from-amber-400 hover:to-amber-500
      disabled:opacity-50 disabled:cursor-not-allowed
      transform-gpu will-change-transform
      transition-all duration-200 ease-out
      inline-flex items-center space-x-2
      ${className}
    `}
    whileHover={!loading ? { 
      scale: 1.02,
      y: -1,
      boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)'
    } : {}}
    whileTap={!loading ? { scale: 0.98 } : {}}
    style={{
      boxShadow: '0 4px 14px rgba(251, 191, 36, 0.2)'
    }}
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
        <span>Generating...</span>
      </>
    ) : (
      <>
        <DocumentArrowDownIcon className="w-5 h-5" />
        <span>{children}</span>
      </>
    )}
  </motion.button>
);

const InstantProposalGenerator: React.FC<InstantProposalGeneratorProps> = ({ demoData }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default;
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 30;

      // Header with modern styling
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('InvoicePatch Custom Proposal', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Tailored analysis for your specific business needs', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      doc.setLineWidth(0.5);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Current Situation Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Current Situation', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const currentSituation = [
        `• ${demoData.contractors} contractors to manage`,
        `• ${demoData.hoursPerWeek} hours/week reconciling invoices`,
        `• $${demoData.monthlyCost.toLocaleString()} monthly labor cost`,
        `• ${demoData.errorRate}% error rate in processing`
      ];

      currentSituation.forEach((item) => {
        doc.text(item, 25, yPosition);
        yPosition += 7;
      });

      yPosition += 5;

      // With InvoicePatch Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('With InvoicePatch', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const withInvoicePatch = [
        '• 30 seconds reconciliation time',
        '• 96% reduction in manual work',
        `• $${demoData.savings.toLocaleString()} monthly savings`,
        '• 99.7% accuracy rate'
      ];

      withInvoicePatch.forEach((item) => {
        doc.text(item, 25, yPosition);
        yPosition += 7;
      });

      yPosition += 15;

      // ROI Calculation Section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ROI Calculation', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // ROI Table
      const roiData = [
        ['Current Monthly Cost', `$${demoData.currentMonthlyCost.toLocaleString()}`],
        ['InvoicePatch Monthly Cost', '$299'],
        ['Monthly Savings', `$${demoData.savings.toLocaleString()}`]
      ];

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      roiData.forEach((row, index) => {
        const y = yPosition + (index * 10);
        doc.text(row[0] + ':', 30, y);
        doc.setFont('helvetica', 'bold');
        doc.text(row[1], pageWidth - 50, y, { align: 'right' });
        doc.setFont('helvetica', 'normal');
      });

      yPosition += 40;

      // ROI Summary Box
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPosition, pageWidth - 40, 25, 'F');
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${demoData.roiPercentage}% ROI`, pageWidth / 2, yPosition + 10, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Annual Savings: $${demoData.annualSavings.toLocaleString()}`, pageWidth / 2, yPosition + 18, { align: 'center' });

      yPosition += 35;

      // Implementation Timeline
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Implementation Timeline', 20, yPosition);
      yPosition += 10;

      const timeline = [
        ['Week 1:', 'Setup & Integration - Connect your existing systems, configure workflows'],
        ['Week 2:', 'Training & Go-Live - Team training, first automated reconciliations'],
        ['Week 3:', 'Full Automation - Complete workflow automation, savings begin']
      ];

      doc.setFontSize(11);
      timeline.forEach((item, index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(item[0], 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(item[1], 45, yPosition);
        yPosition += 10;
      });

      yPosition += 10;

      // Call to Action
      doc.setFillColor(55, 65, 81);
      doc.rect(20, yPosition, pageWidth - 40, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Ready to Get Started?', pageWidth / 2, yPosition + 8, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Contact us today to secure your proposal pricing', pageWidth / 2, yPosition + 15, { align: 'center' });

      // Footer
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.text('InvoicePatch - Professional Invoice Reconciliation', pageWidth / 2, pageHeight - 15, { align: 'center' });
      doc.text('30-day money-back guarantee • Cancel anytime', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      const today = new Date().toISOString().split('T')[0];
      doc.save(`InvoicePatch-Proposal-${today}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Steve Jobs-inspired: Focus on the message */}
      <motion.div 
        className="bg-gradient-to-r from-amber-500/10 via-teal-500/5 to-violet-500/10 border-b border-slate-800/50"
        variants={jobsVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-tight"
            variants={jobsVariants}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Your Custom
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-teal-400 font-light">
              ROI Analysis
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed mb-8"
            variants={jobsVariants}
          >
            Based on your specific business requirements and current workflow
          </motion.p>

          <motion.div variants={jobsVariants}>
            <PrimaryButton onClick={generatePDF} loading={isGeneratingPDF}>
              Download Proposal
            </PrimaryButton>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Current vs Future State - Steve Jobs style comparison */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          {/* Current State */}
          <motion.div variants={jobsVariants}>
            <h2 className="text-2xl font-light text-white mb-8 text-center">Current State</h2>
            <div className="space-y-4">
              <MetricCard
                icon={<div>👥</div>}
                label="Contractors to manage"
                value={demoData.contractors}
              />
              <MetricCard
                icon={<ClockIcon className="w-8 h-8 mx-auto" />}
                label="Hours/week reconciling"
                value={`${demoData.hoursPerWeek}h`}
              />
              <MetricCard
                icon={<div>💰</div>}
                label="Monthly labor cost"
                value={`$${demoData.monthlyCost.toLocaleString()}`}
              />
              <MetricCard
                icon={<div>⚠️</div>}
                label="Error rate"
                value={`${demoData.errorRate}%`}
              />
            </div>
          </motion.div>

          {/* Future State */}
          <motion.div variants={jobsVariants}>
            <h2 className="text-2xl font-light text-white mb-8 text-center">With InvoicePatch</h2>
            <div className="space-y-4">
              <MetricCard
                icon={<div>⚡</div>}
                label="Processing time"
                value="30s"
                highlight
              />
              <MetricCard
                icon={<CheckCircleIcon className="w-8 h-8 mx-auto" />}
                label="Work reduction"
                value="96%"
                highlight
              />
              <MetricCard
                icon={<div>💡</div>}
                label="Monthly savings"
                value={`$${demoData.savings.toLocaleString()}`}
                highlight
              />
              <MetricCard
                icon={<div>🎯</div>}
                label="Accuracy rate"
                value="99.7%"
                highlight
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ROI Hero Section - Steve Jobs style focus */}
        <motion.div 
          className="text-center mb-16"
          variants={jobsVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <motion.div 
            className="inline-block p-12 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(20, 184, 166, 0.15) 100%)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              boxShadow: '0 8px 32px rgba(251, 191, 36, 0.15)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-teal-400 mb-4">
              {demoData.roiPercentage}%
            </div>
            <div className="text-2xl font-light text-white mb-2">Return on Investment</div>
            <div className="text-lg text-slate-400">
              Annual Savings: <span className="text-amber-400 font-medium">${demoData.annualSavings.toLocaleString()}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Implementation Timeline - Simplified Steve Jobs style */}
        <motion.div 
          className="mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
        >
          <motion.h2 
            className="text-3xl font-light text-white text-center mb-12"
            variants={jobsVariants}
          >
            Three Week Implementation
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { week: '1', title: 'Setup', desc: 'Connect systems, configure workflows' },
              { week: '2', title: 'Training', desc: 'Team training, first reconciliations' },
              { week: '3', title: 'Automation', desc: 'Full workflow automation live' }
            ].map((phase, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={jobsVariants}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-teal-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl mx-auto mb-4">
                  {phase.week}
                </div>
                <h3 className="text-xl font-light text-white mb-2">{phase.title}</h3>
                <p className="text-slate-400 font-light">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          className="text-center"
          variants={jobsVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
        >
          <p className="text-slate-500 text-sm mb-6 font-light">
            30-day money-back guarantee • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Function to generate proposal data based on user inputs
export const generateProposalData = (
  contractors: number,
  hoursPerWeek: number,
  hourlyRate: number = 45
): DemoData => {
  const monthlyCost = hoursPerWeek * 4 * hourlyRate;
  const currentMonthlyCost = monthlyCost + 680 + 320; // Add error correction and delay costs
  const savings = currentMonthlyCost - 484; // 484 is InvoicePatch total cost (299 + 135 + 50)
  const annualSavings = savings * 12;
  const roiPercentage = Math.round((annualSavings / (299 * 12)) * 100);
  
  return {
    contractors,
    hoursPerWeek,
    monthlyCost,
    errorRate: 15, // Typical manual error rate
    savings,
    currentMonthlyCost,
    roiPercentage,
    annualSavings
  };
};

// Sample data for demonstration
export const sampleDemoData: DemoData = {
  contractors: 25,
  hoursPerWeek: 8,
  monthlyCost: 1440,
  errorRate: 15,
  savings: 1956,
  currentMonthlyCost: 2440,
  roiPercentage: 656,
  annualSavings: 23472
};

export default InstantProposalGenerator; 