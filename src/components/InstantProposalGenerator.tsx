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

// Clean animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Clean metric card component
const MetricCard = ({ icon, label, value, highlight = false }: any) => (
  <motion.div 
    className={`
      p-6 text-center rounded-lg border
      ${highlight 
        ? 'bg-[#f0f9ff] border-[#3b82f6]/20' 
        : 'bg-[#f9fafb] border-[#e5e7eb]'
      }
    `}
    variants={fadeInUp}
    whileHover={{ 
      y: -2,
      transition: { duration: 0.2 }
    }}
  >
    <div className={`text-3xl mb-3 ${highlight ? 'text-[#3b82f6]' : 'text-[#6b7280]'}`}>
      {icon}
    </div>
    <div className={`text-2xl font-semibold mb-1 ${highlight ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]'}`}>
      {value}
    </div>
    <div className={`text-sm ${highlight ? 'text-[#6b7280]' : 'text-[#9ca3af]'}`}>
      {label}
    </div>
  </motion.div>
);

const PrimaryButton = ({ children, onClick, loading = false, className = '' }: any) => (
  <motion.button
    onClick={onClick}
    disabled={loading}
    className={`
      bg-[#3b82f6] text-white px-8 py-4 rounded-lg font-medium text-lg
      hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors duration-200 inline-flex items-center space-x-2
      ${className}
    `}
    whileHover={!loading ? { scale: 1.02 } : {}}
    whileTap={!loading ? { scale: 0.98 } : {}}
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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

      // Header
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
        ['Monthly Savings', `$${demoData.savings.toLocaleString()}`],
        ['Annual Savings', `$${demoData.annualSavings.toLocaleString()}`],
        ['ROI', `${demoData.roiPercentage}%`]
      ];

      // Simple table
      roiData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.text(label + ':', 25, yPosition);
        doc.setFont('helvetica', 'bold');
        doc.text(value, 120, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // Implementation Timeline
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Implementation Timeline', 20, yPosition);
      yPosition += 10;

      const timeline = [
        'Week 1: Setup and configuration',
        'Week 2: Team training and testing',
        'Week 3: Full deployment',
        'Week 4: Optimization and support'
      ];

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      timeline.forEach((item) => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 7;
      });

      yPosition += 15;

      // Next Steps
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Next Steps', 20, yPosition);
      yPosition += 10;

      const nextSteps = [
        '1. Schedule a personalized demo',
        '2. Review specific integration requirements',
        '3. Begin 14-day free trial',
        '4. Start saving time and money'
      ];

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      nextSteps.forEach((item) => {
        doc.text(item, 25, yPosition);
        yPosition += 7;
      });

      // Footer
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 30;
      }

      yPosition = pageHeight - 30;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated by InvoicePatch - invoicepatch.com', pageWidth / 2, yPosition, { align: 'center' });

      // Save the PDF
      doc.save('InvoicePatch-Custom-Proposal.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl font-bold text-[#1a1a1a] mb-4"
            variants={fadeInUp}
          >
            Your Custom InvoicePatch Proposal
          </motion.h1>
          <motion.p 
            className="text-xl text-[#6b7280] max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Based on your specific business needs, here's how InvoicePatch can transform your invoice reconciliation process.
          </motion.p>
        </motion.div>

        {/* Current Situation */}
        <motion.div 
          className="mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Your Current Situation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <MetricCard
              icon="👥"
              label="Contractors to Manage"
              value={demoData.contractors}
            />
            <MetricCard
              icon={<ClockIcon className="w-8 h-8" />}
              label="Hours per Week"
              value={`${demoData.hoursPerWeek}h`}
            />
            <MetricCard
              icon={<CalculatorIcon className="w-8 h-8" />}
              label="Monthly Labor Cost"
              value={`$${demoData.monthlyCost.toLocaleString()}`}
            />
            <MetricCard
              icon="⚠️"
              label="Error Rate"
              value={`${demoData.errorRate}%`}
            />
          </div>
        </motion.div>

        {/* With InvoicePatch */}
        <motion.div 
          className="mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">With InvoicePatch</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <MetricCard
              icon={<CheckCircleIcon className="w-8 h-8" />}
              label="Processing Time"
              value="30 seconds"
              highlight={true}
            />
            <MetricCard
              icon="📈"
              label="Accuracy Rate"
              value="99.7%"
              highlight={true}
            />
            <MetricCard
              icon="💰"
              label="Monthly Savings"
              value={`$${demoData.savings.toLocaleString()}`}
              highlight={true}
            />
            <MetricCard
              icon="🎯"
              label="ROI"
              value={`${demoData.roiPercentage}%`}
              highlight={true}
            />
          </div>
        </motion.div>

        {/* ROI Summary */}
        <motion.div 
          className="bg-[#f0f9ff] border border-[#3b82f6]/20 rounded-lg p-8 mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4 text-center">
            Annual ROI Summary
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#3b82f6] mb-2">
              ${demoData.annualSavings.toLocaleString()}
            </div>
            <div className="text-[#6b7280]">
              in annual savings vs. current manual process
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <PrimaryButton
            onClick={generatePDF}
            loading={isGeneratingPDF}
            className="mb-6"
          >
            Download Full Proposal
          </PrimaryButton>
          
          <div className="space-y-4">
            <p className="text-[#6b7280]">
              Ready to get started? Schedule a personalized demo to see InvoicePatch in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/manager/login"
                className="bg-[#3b82f6] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2563eb] transition-colors duration-200"
              >
                Schedule Demo
              </a>
              <a
                href="/contractor-trial"
                className="border border-[#e5e7eb] text-[#1a1a1a] px-6 py-3 rounded-lg font-medium hover:bg-[#f9fafb] transition-colors duration-200"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Sample data generator
export const generateProposalData = (
  contractors: number,
  hoursPerWeek: number,
  hourlyRate: number = 45
): DemoData => {
  const monthlyCost = hoursPerWeek * hourlyRate * 4.33; // Average weeks per month
  const errorRate = Math.min(15, Math.max(5, Math.floor(contractors / 2))); // Scale with complexity
  
  // With InvoicePatch: 30 seconds per 20 invoices = 1.5 seconds per invoice
  // Assume 4 invoices per contractor per month on average
  const newHoursPerWeek = (contractors * 4 * 1.5) / 3600 / 4.33; // Convert to hours per week
  const newMonthlyCost = newHoursPerWeek * hourlyRate * 4.33;
  const invoicePatchCost = 299; // Monthly subscription
  const totalNewCost = newMonthlyCost + invoicePatchCost;
  
  const savings = Math.max(0, monthlyCost - totalNewCost);
  const roiPercentage = monthlyCost > 0 ? Math.round((savings / invoicePatchCost) * 100) : 0;
  const annualSavings = savings * 12;

  return {
    contractors,
    hoursPerWeek,
    monthlyCost: Math.round(monthlyCost),
    errorRate,
    savings: Math.round(savings),
    currentMonthlyCost: Math.round(monthlyCost),
    roiPercentage,
    annualSavings: Math.round(annualSavings)
  };
};

// Sample demo data
export const sampleDemoData: DemoData = generateProposalData(25, 8, 45);

export default InstantProposalGenerator; 