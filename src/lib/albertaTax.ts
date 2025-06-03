/**
 * Alberta Tax Calculation System
 * 
 * Alberta Tax Structure:
 * - GST: 5% (federal goods and services tax)
 * - PST: 0% (Alberta has no provincial sales tax)
 * - Total tax rate: 5% on taxable services only
 */

export interface AlbertaInvoiceCalculation {
  // Taxable amounts (subject to 5% GST)
  dayRateTotal: number;
  truckRateTotal: number;
  additionalCharges: number;
  
  // Non-taxable reimbursements (expense reimbursements)
  travelReimbursement: number;
  subsistence: number;
  
  // Calculations
  taxableSubtotal: number;    // Sum of taxable items
  gst: number;                // taxableSubtotal × 0.05
  afterTaxSubtotal: number;   // taxableSubtotal + gst
  grandTotal: number;         // afterTaxSubtotal + non-taxable items
}

export interface DailyWorkData {
  dayRate: number;
  dayRateUsed: boolean;
  truckRate: number;
  truckUsed: boolean;
  travelKMs: number;
  travelRatePerKm?: number;   // Optional travel rate per km
  subsistence: number;
  additionalCharges?: number;  // Optional additional billable services
}

export interface WeeklyWorkData {
  dailyEntries: DailyWorkData[];
  weekStartDate: string;
  weekEndDate: string;
}

// Alberta GST rate (federal)
export const ALBERTA_GST_RATE = 0.05; // 5%
export const ALBERTA_PST_RATE = 0.0;  // 0% - No provincial sales tax
export const TOTAL_TAX_RATE = ALBERTA_GST_RATE + ALBERTA_PST_RATE;

// Standard travel reimbursement rate (CRA guidelines)
export const STANDARD_TRAVEL_RATE_PER_KM = 0.68; // $0.68/km for 2024

/**
 * Calculate Alberta taxes for daily work entry
 */
export function calculateDailyAlbertaTax(dailyData: DailyWorkData): AlbertaInvoiceCalculation {
  // Taxable services (subject to GST)
  const dayRateTotal = dailyData.dayRateUsed ? dailyData.dayRate : 0;
  const truckRateTotal = dailyData.truckUsed ? dailyData.truckRate : 0;
  const additionalCharges = dailyData.additionalCharges || 0;
  
  // Non-taxable reimbursements
  const travelReimbursement = dailyData.travelKMs * (dailyData.travelRatePerKm || STANDARD_TRAVEL_RATE_PER_KM);
  const subsistence = dailyData.subsistence || 0;
  
  // Tax calculations
  const taxableSubtotal = dayRateTotal + truckRateTotal + additionalCharges;
  const gst = Math.round(taxableSubtotal * ALBERTA_GST_RATE * 100) / 100; // Round to 2 decimal places
  const afterTaxSubtotal = taxableSubtotal + gst;
  const grandTotal = afterTaxSubtotal + travelReimbursement + subsistence;
  
  return {
    dayRateTotal,
    truckRateTotal,
    additionalCharges,
    travelReimbursement,
    subsistence,
    taxableSubtotal,
    gst,
    afterTaxSubtotal,
    grandTotal
  };
}

/**
 * Calculate Alberta taxes for weekly work period
 */
export function calculateWeeklyAlbertaTax(weeklyData: WeeklyWorkData): AlbertaInvoiceCalculation {
  const totals = weeklyData.dailyEntries.reduce(
    (acc, daily) => {
      const dailyCalc = calculateDailyAlbertaTax(daily);
      return {
        dayRateTotal: acc.dayRateTotal + dailyCalc.dayRateTotal,
        truckRateTotal: acc.truckRateTotal + dailyCalc.truckRateTotal,
        additionalCharges: acc.additionalCharges + dailyCalc.additionalCharges,
        travelReimbursement: acc.travelReimbursement + dailyCalc.travelReimbursement,
        subsistence: acc.subsistence + dailyCalc.subsistence,
        taxableSubtotal: acc.taxableSubtotal + dailyCalc.taxableSubtotal,
        gst: acc.gst + dailyCalc.gst,
        afterTaxSubtotal: acc.afterTaxSubtotal + dailyCalc.afterTaxSubtotal,
        grandTotal: acc.grandTotal + dailyCalc.grandTotal
      };
    },
    {
      dayRateTotal: 0,
      truckRateTotal: 0,
      additionalCharges: 0,
      travelReimbursement: 0,
      subsistence: 0,
      taxableSubtotal: 0,
      gst: 0,
      afterTaxSubtotal: 0,
      grandTotal: 0
    }
  );

  // Round final GST calculation to avoid floating point errors
  totals.gst = Math.round(totals.gst * 100) / 100;
  totals.afterTaxSubtotal = totals.taxableSubtotal + totals.gst;
  totals.grandTotal = totals.afterTaxSubtotal + totals.travelReimbursement + totals.subsistence;

  return totals;
}

/**
 * Format currency for display in Canadian dollars
 */
export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Get tax breakdown string for invoice display
 */
export function getTaxBreakdownText(calculation: AlbertaInvoiceCalculation): string {
  const lines = [];
  
  if (calculation.dayRateTotal > 0) {
    lines.push(`Labour Services: ${formatCAD(calculation.dayRateTotal)}`);
  }
  
  if (calculation.truckRateTotal > 0) {
    lines.push(`Equipment Services: ${formatCAD(calculation.truckRateTotal)}`);
  }
  
  if (calculation.additionalCharges > 0) {
    lines.push(`Additional Services: ${formatCAD(calculation.additionalCharges)}`);
  }
  
  lines.push(`Subtotal (Taxable): ${formatCAD(calculation.taxableSubtotal)}`);
  lines.push(`GST (5%): ${formatCAD(calculation.gst)}`);
  lines.push(`Total after GST: ${formatCAD(calculation.afterTaxSubtotal)}`);
  
  if (calculation.travelReimbursement > 0) {
    lines.push(`Travel Reimbursement: ${formatCAD(calculation.travelReimbursement)} (non-taxable)`);
  }
  
  if (calculation.subsistence > 0) {
    lines.push(`Subsistence: ${formatCAD(calculation.subsistence)} (non-taxable)`);
  }
  
  lines.push(`TOTAL: ${formatCAD(calculation.grandTotal)}`);
  
  return lines.join('\n');
}

/**
 * Validate tax calculation for common errors
 */
export function validateTaxCalculation(calculation: AlbertaInvoiceCalculation): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for negative values
  Object.entries(calculation).forEach(([key, value]) => {
    if (typeof value === 'number' && value < 0) {
      errors.push(`${key} cannot be negative: ${value}`);
    }
  });
  
  // Validate GST calculation
  const expectedGST = Math.round(calculation.taxableSubtotal * ALBERTA_GST_RATE * 100) / 100;
  if (Math.abs(calculation.gst - expectedGST) > 0.01) {
    errors.push(`GST calculation incorrect. Expected: ${expectedGST}, Got: ${calculation.gst}`);
  }
  
  // Validate totals
  const expectedAfterTax = calculation.taxableSubtotal + calculation.gst;
  if (Math.abs(calculation.afterTaxSubtotal - expectedAfterTax) > 0.01) {
    errors.push(`After-tax subtotal incorrect. Expected: ${expectedAfterTax}, Got: ${calculation.afterTaxSubtotal}`);
  }
  
  const expectedGrandTotal = calculation.afterTaxSubtotal + calculation.travelReimbursement + calculation.subsistence;
  if (Math.abs(calculation.grandTotal - expectedGrandTotal) > 0.01) {
    errors.push(`Grand total incorrect. Expected: ${expectedGrandTotal}, Got: ${calculation.grandTotal}`);
  }
  
  // Warnings for unusual values
  if (calculation.gst > calculation.taxableSubtotal * 0.15) {
    warnings.push('GST seems unusually high - please verify tax rate');
  }
  
  if (calculation.taxableSubtotal === 0 && calculation.grandTotal > 0) {
    warnings.push('Invoice contains only reimbursements - no taxable services');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate GST number format for invoices (if business has GST registration)
 */
export function formatGSTNumber(gstNumber: string): string {
  // Remove all non-alphanumeric characters
  const clean = gstNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // GST number format: 123456789RT0001
  if (clean.length === 15) {
    return `${clean.slice(0, 9)} RT ${clean.slice(11)}`;
  }
  
  return gstNumber; // Return original if not standard format
}

/**
 * Calculate estimated annual GST for planning purposes
 */
export function calculateAnnualGSTEstimate(monthlyAverage: AlbertaInvoiceCalculation): {
  annualTaxableIncome: number;
  annualGSTPayable: number;
  quarterlyGSTPayment: number;
  monthlyGSTReserve: number;
} {
  const annualTaxableIncome = monthlyAverage.taxableSubtotal * 12;
  const annualGSTPayable = annualTaxableIncome * ALBERTA_GST_RATE;
  const quarterlyGSTPayment = annualGSTPayable / 4;
  const monthlyGSTReserve = annualGSTPayable / 12;
  
  return {
    annualTaxableIncome,
    annualGSTPayable,
    quarterlyGSTPayment,
    monthlyGSTReserve
  };
}

/**
 * Export utility functions for common use
 */
export const AlbertaTaxUtils = {
  calculate: calculateDailyAlbertaTax,
  calculateWeekly: calculateWeeklyAlbertaTax,
  format: formatCAD,
  breakdown: getTaxBreakdownText,
  validate: validateTaxCalculation,
  formatGST: formatGSTNumber,
  annualEstimate: calculateAnnualGSTEstimate,
  
  // Constants
  GST_RATE: ALBERTA_GST_RATE,
  TRAVEL_RATE: STANDARD_TRAVEL_RATE_PER_KM,
  
  // Quick calculation helpers
  gstAmount: (taxableAmount: number) => Math.round(taxableAmount * ALBERTA_GST_RATE * 100) / 100,
  afterTax: (taxableAmount: number) => {
    const gst = Math.round(taxableAmount * ALBERTA_GST_RATE * 100) / 100;
    return taxableAmount + gst;
  }
} as const; 