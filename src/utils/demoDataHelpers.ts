// Demo Data Helpers for InvoicePatch System
// Utility functions to work with sample data for demonstrations and presentations

import { 
  sampleContractors, 
  sampleInvoices, 
  historicalData, 
  testimonials,
  industryCategories,
  jobCategories,
  edgeCases,
  performanceMetrics,
  type Contractor,
  type Invoice,
  type Testimonial
} from '../data/sampleData';

// Demo Mode Configuration
export interface DemoConfig {
  showRealTimeUpdates: boolean;
  simulateProcessingDelays: boolean;
  highlightProblematicInvoices: boolean;
  showSuccessStories: boolean;
  enableInteractiveMode: boolean;
}

export const defaultDemoConfig: DemoConfig = {
  showRealTimeUpdates: true,
  simulateProcessingDelays: true,
  highlightProblematicInvoices: true,
  showSuccessStories: true,
  enableInteractiveMode: true
};

// Helper Functions for Demo Scenarios

export const getContractorsByIndustry = (industry: string): Contractor[] => {
  return sampleContractors.filter(contractor => contractor.industry === industry);
};

export const getInvoicesByStatus = (status: Invoice['status']): Invoice[] => {
  return sampleInvoices.filter(invoice => invoice.status === status);
};

export const getPerfectMatchInvoices = (): Invoice[] => {
  return sampleInvoices.filter(invoice => 
    invoice.flags.includes('Perfect Match') && 
    invoice.matchConfidence && invoice.matchConfidence > 95
  );
};

export const getProblematicInvoices = (): Invoice[] => {
  return sampleInvoices.filter(invoice => 
    invoice.flags.some(flag => 
      ['Amount Discrepancy', 'Duplicate Detected', 'No Matching PO', 'Missing Documentation'].includes(flag)
    )
  );
};

export const getLargeInvoices = (threshold: number = 50000): Invoice[] => {
  return sampleInvoices.filter(invoice => invoice.amount >= threshold);
};

export const getFeaturedTestimonials = (): Testimonial[] => {
  return testimonials.filter(testimonial => testimonial.featured);
};

export const getContractorPerformanceMetrics = (contractorId: string) => {
  const contractor = sampleContractors.find(c => c.id === contractorId);
  const contractorInvoices = sampleInvoices.filter(i => i.contractorId === contractorId);
  
  if (!contractor) return null;

  const totalInvoices = contractorInvoices.length;
  const approvedInvoices = contractorInvoices.filter(i => i.status === 'approved').length;
  const averageAmount = contractorInvoices.reduce((sum, inv) => sum + inv.amount, 0) / totalInvoices;
  const averageProcessingTime = contractorInvoices
    .filter(i => i.processingTime)
    .reduce((sum, inv) => sum + (inv.processingTime || 0), 0) / totalInvoices;

  return {
    contractor,
    totalInvoices,
    approvedInvoices,
    approvalRate: (approvedInvoices / totalInvoices) * 100,
    averageAmount,
    averageProcessingTime,
    complianceScore: contractor.complianceScore,
    rating: contractor.rating
  };
};

// Demo Scenario Generators

export interface DemoScenario {
  title: string;
  description: string;
  invoices: Invoice[];
  contractors: Contractor[];
  highlights: string[];
}

export const generateDemoScenario = (scenarioType: 'perfect' | 'problematic' | 'mixed' | 'large-volume'): DemoScenario => {
  switch (scenarioType) {
    case 'perfect':
      return {
        title: "Perfect Processing Scenario",
        description: "Demonstration of ideal invoice processing workflow",
        invoices: getPerfectMatchInvoices(),
        contractors: sampleContractors.filter(c => c.complianceScore > 95),
        highlights: [
          "100% automated processing",
          "Sub-2 day processing times",
          "99%+ accuracy rates",
          "Zero manual intervention required"
        ]
      };

    case 'problematic':
      return {
        title: "Problem Resolution Showcase",
        description: "How InvoicePatch handles complex scenarios and disputes",
        invoices: getProblematicInvoices(),
        contractors: sampleContractors.filter(c => c.complianceScore < 90),
        highlights: [
          "Automated duplicate detection",
          "Smart discrepancy flagging",
          "Missing documentation alerts",
          "Intelligent risk scoring"
        ]
      };

    case 'mixed':
      return {
        title: "Real-World Processing Mix",
        description: "Typical day-to-day invoice processing scenarios",
        invoices: sampleInvoices.slice(0, 6), // Mix of different types
        contractors: sampleContractors.slice(0, 6),
        highlights: [
          "87% automation rate",
          "2.3 day average processing",
          "94.7% accuracy rate",
          "Multiple industry support"
        ]
      };

    case 'large-volume':
      return {
        title: "High-Volume Processing Demo",
        description: "Enterprise-scale invoice processing capabilities",
        invoices: getLargeInvoices(),
        contractors: sampleContractors,
        highlights: [
          "Handles $125K+ invoices",
          "Multi-phase project support",
          "Enterprise approval workflows",
          "Scalable processing power"
        ]
      };

    default:
      return generateDemoScenario('mixed');
  }
};

// Sales Presentation Helpers

export const getSalesMetrics = () => {
  const totalInvoicesProcessed = historicalData.reduce((sum, month) => sum + month.invoicesProcessed, 0);
  const totalAmountProcessed = historicalData.reduce((sum, month) => sum + month.totalAmount, 0);
  const totalCostSavings = historicalData.reduce((sum, month) => sum + month.costSavings, 0);
  
  const latestMonth = historicalData[historicalData.length - 1];
  const previousMonth = historicalData[historicalData.length - 2];
  
  const monthlyGrowth = {
    invoices: ((latestMonth.invoicesProcessed - previousMonth.invoicesProcessed) / previousMonth.invoicesProcessed * 100).toFixed(1),
    amount: ((latestMonth.totalAmount - previousMonth.totalAmount) / previousMonth.totalAmount * 100).toFixed(1),
    savings: ((latestMonth.costSavings - previousMonth.costSavings) / previousMonth.costSavings * 100).toFixed(1)
  };

  return {
    totalInvoicesProcessed,
    totalAmountProcessed,
    totalCostSavings,
    averageContractorRating: (sampleContractors.reduce((sum, c) => sum + c.rating, 0) / sampleContractors.length).toFixed(1),
    monthlyGrowth,
    performanceMetrics,
    activeContractors: sampleContractors.length,
    industryDiversity: industryCategories.length
  };
};

export const getROICalculation = (monthlyInvoiceVolume: number, averageInvoiceAmount: number) => {
  const annualInvoiceCount = monthlyInvoiceVolume * 12;
  const annualInvoiceValue = annualInvoiceCount * averageInvoiceAmount;
  
  // Current manual processing costs (estimated)
  const manualProcessingCostPerInvoice = 45; // $45 average cost per manual invoice
  const currentAnnualCost = annualInvoiceCount * manualProcessingCostPerInvoice;
  
  // InvoicePatch costs and savings
  const invoicePatchProcessingCost = 8; // $8 per invoice with automation
  const newAnnualCost = annualInvoiceCount * invoicePatchProcessingCost;
  const annualSavings = currentAnnualCost - newAnnualCost;
  
  // Additional benefits
  const earlyPaymentDiscount = annualInvoiceValue * 0.02; // 2% early payment discount
  const reducedDisputeCosts = annualInvoiceCount * 12; // $12 per invoice dispute reduction
  const improvedCashFlow = annualInvoiceValue * 0.001; // 0.1% improvement in cash flow
  
  const totalAnnualBenefit = annualSavings + earlyPaymentDiscount + reducedDisputeCosts + improvedCashFlow;
  const estimatedImplementationCost = 50000; // One-time implementation cost
  const firstYearROI = ((totalAnnualBenefit - estimatedImplementationCost) / estimatedImplementationCost * 100).toFixed(1);
  
  return {
    currentAnnualCost,
    newAnnualCost,
    annualSavings,
    earlyPaymentDiscount,
    reducedDisputeCosts,
    improvedCashFlow,
    totalAnnualBenefit,
    estimatedImplementationCost,
    firstYearROI,
    paybackPeriod: (estimatedImplementationCost / (totalAnnualBenefit / 12)).toFixed(1), // months
    threeYearValue: (totalAnnualBenefit * 3 - estimatedImplementationCost).toLocaleString()
  };
};

// Interactive Demo Helpers

export const simulateInvoiceProcessing = async (invoice: Invoice, config: DemoConfig = defaultDemoConfig) => {
  const steps = [
    { step: 'received', message: `Invoice ${invoice.invoiceNumber} received from ${invoice.contractorName}`, delay: 500 },
    { step: 'ocr', message: 'OCR processing and data extraction...', delay: 1200 },
    { step: 'validation', message: 'Validating invoice data and line items...', delay: 800 },
    { step: 'matching', message: 'Matching against purchase orders...', delay: 1000 },
    { step: 'approval', message: 'Routing for approval workflow...', delay: 600 },
    { step: 'complete', message: `Processing complete - ${invoice.status}`, delay: 300 }
  ];

  const results = [];
  
  for (const { step, message, delay } of steps) {
    if (config.simulateProcessingDelays) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    results.push({
      timestamp: new Date().toISOString(),
      step,
      message,
      invoice: invoice.invoiceNumber,
      contractor: invoice.contractorName
    });
  }

  return {
    invoice,
    processingSteps: results,
    finalStatus: invoice.status,
    matchConfidence: invoice.matchConfidence,
    riskScore: invoice.riskScore,
    flags: invoice.flags
  };
};

export const generateDemoNotifications = (invoice: Invoice) => {
  const notifications = [];
  
  // Processing notifications
  notifications.push({
    type: 'info',
    title: 'Invoice Received',
    message: `${invoice.invoiceNumber} from ${invoice.contractorName}`,
    timestamp: new Date().toISOString()
  });

  // Flag-based notifications
  if (invoice.flags.includes('Amount Discrepancy')) {
    notifications.push({
      type: 'warning',
      title: 'Amount Discrepancy Detected',
      message: `Invoice amount doesn't match PO. Review required.`,
      timestamp: new Date().toISOString()
    });
  }

  if (invoice.flags.includes('Duplicate Detected')) {
    notifications.push({
      type: 'error',
      title: 'Duplicate Invoice Found',
      message: `Similar invoice already processed. Blocking payment.`,
      timestamp: new Date().toISOString()
    });
  }

  if (invoice.flags.includes('Perfect Match')) {
    notifications.push({
      type: 'success',
      title: 'Auto-Approved',
      message: `Perfect match found. Invoice auto-approved for payment.`,
      timestamp: new Date().toISOString()
    });
  }

  return notifications;
};

// Export utility object
export const demoUtils = {
  getContractorsByIndustry,
  getInvoicesByStatus,
  getPerfectMatchInvoices,
  getProblematicInvoices,
  getLargeInvoices,
  getFeaturedTestimonials,
  getContractorPerformanceMetrics,
  generateDemoScenario,
  getSalesMetrics,
  getROICalculation,
  simulateInvoiceProcessing,
  generateDemoNotifications
};

export default demoUtils; 