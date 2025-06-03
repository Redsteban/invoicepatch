/**
 * Alberta Tax Calculation System for InvoicePatch
 * 
 * Alberta Tax Structure:
 * - GST: 5% (federal goods and services tax)
 * - PST: 0% (Alberta has no provincial sales tax)
 * - Total tax rate: 5% on taxable services only
 * 
 * Tax applies to:
 * - Labor services (day rates, hourly rates)
 * - Equipment rental services (truck rates, equipment fees)
 * - Additional service charges
 * 
 * Tax does NOT apply to:
 * - Travel kilometer reimbursements (expense reimbursement)
 * - Subsistence/meal allowances (CRA-compliant expense reimbursement)
 * - Other legitimate business expense reimbursements
 */

// Alberta Tax Constants
export const ALBERTA_GST_RATE = 0.05; // 5% GST
export const ALBERTA_PST_RATE = 0.00; // 0% PST (Alberta has no PST)
export const ALBERTA_TOTAL_TAX_RATE = ALBERTA_GST_RATE + ALBERTA_PST_RATE;

// CRA standard travel reimbursement rate for 2024
export const STANDARD_TRAVEL_RATE_PER_KM = 0.68; // $0.68/km for 2024

// Input interface for invoice calculations
export interface InvoiceInput {
  dayRateTotal: number;
  truckRateTotal: number;
  additionalCharges?: number;
  travelReimbursement: number;
  subsistence: number;
}

// Daily work data interface
export interface DailyWorkData {
  dayRate: number;
  dayRateUsed: boolean;
  truckRate: number;
  truckUsed: boolean;
  travelKMs: number;
  travelRatePerKm?: number;
  subsistence: number;
  additionalCharges?: number;
}

// Weekly work data interface
export interface WeeklyWorkData {
  dailyEntries: DailyWorkData[];
  weekStartDate: string;
  weekEndDate: string;
}

// Alberta invoice calculation result
export interface AlbertaInvoiceCalculation {
  // Input amounts
  dayRateTotal: number;
  truckRateTotal: number;
  additionalCharges: number;
  travelReimbursement: number;
  subsistence: number;
  
  // Calculated amounts
  taxableSubtotal: number;    // dayRate + truckRate + additional
  gstAmount: number;          // taxableSubtotal × 0.05
  afterTaxSubtotal: number;   // taxableSubtotal + gstAmount
  nonTaxableTotal: number;    // travel + subsistence
  grandTotal: number;         // afterTaxSubtotal + nonTaxableTotal
}

/**
 * Main Alberta tax calculation function
 * Calculates GST on taxable services, excludes reimbursements from tax
 */
export function calculateAlbertaTax(input: InvoiceInput): AlbertaInvoiceCalculation {
  // Ensure all inputs are valid numbers
  const dayRateTotal = Number(input.dayRateTotal) || 0;
  const truckRateTotal = Number(input.truckRateTotal) || 0;
  const additionalCharges = Number(input.additionalCharges) || 0;
  const travelReimbursement = Number(input.travelReimbursement) || 0;
  const subsistence = Number(input.subsistence) || 0;

  // Calculate taxable subtotal (services subject to GST)
  const taxableSubtotal = dayRateTotal + truckRateTotal + additionalCharges;
  
  // Calculate GST (round to 2 decimal places to avoid floating point errors)
  const gstAmount = Math.round(taxableSubtotal * ALBERTA_GST_RATE * 100) / 100;
  
  // Calculate after-tax subtotal
  const afterTaxSubtotal = taxableSubtotal + gstAmount;
  
  // Calculate non-taxable total (expense reimbursements)
  const nonTaxableTotal = travelReimbursement + subsistence;
  
  // Calculate grand total
  const grandTotal = afterTaxSubtotal + nonTaxableTotal;

  return {
    dayRateTotal,
    truckRateTotal,
    additionalCharges,
    travelReimbursement,
    subsistence,
    taxableSubtotal,
    gstAmount,
    afterTaxSubtotal,
    nonTaxableTotal,
    grandTotal
  };
}

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

  return calculateAlbertaTax({
    dayRateTotal,
    truckRateTotal,
    additionalCharges,
    travelReimbursement,
    subsistence
  });
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
        gstAmount: acc.gstAmount + dailyCalc.gstAmount,
        afterTaxSubtotal: acc.afterTaxSubtotal + dailyCalc.afterTaxSubtotal,
        nonTaxableTotal: acc.nonTaxableTotal + dailyCalc.nonTaxableTotal,
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
      gstAmount: 0,
      afterTaxSubtotal: 0,
      nonTaxableTotal: 0,
      grandTotal: 0
    }
  );

  // Round final GST calculation to avoid floating point errors
  totals.gstAmount = Math.round(totals.gstAmount * 100) / 100;
  totals.afterTaxSubtotal = totals.taxableSubtotal + totals.gstAmount;
  totals.grandTotal = totals.afterTaxSubtotal + totals.nonTaxableTotal;

  return totals;
}

/**
 * Format currency for Canadian display
 */
export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
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
  lines.push(`GST (5%): ${formatCAD(calculation.gstAmount)}`);
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
 * Get detailed tax breakdown for invoice display
 */
export function getTaxBreakdownDetails(calculation: AlbertaInvoiceCalculation): {
  taxableItems: Array<{ description: string; amount: number }>;
  nonTaxableItems: Array<{ description: string; amount: number }>;
  taxSummary: {
    subtotal: number;
    gst: number;
    afterTax: number;
  };
  total: number;
} {
  const taxableItems = [];
  const nonTaxableItems = [];

  if (calculation.dayRateTotal > 0) {
    taxableItems.push({ description: 'Labour Services', amount: calculation.dayRateTotal });
  }
  
  if (calculation.truckRateTotal > 0) {
    taxableItems.push({ description: 'Equipment Services', amount: calculation.truckRateTotal });
  }
  
  if (calculation.additionalCharges > 0) {
    taxableItems.push({ description: 'Additional Services', amount: calculation.additionalCharges });
  }

  if (calculation.travelReimbursement > 0) {
    nonTaxableItems.push({ description: 'Travel Reimbursement', amount: calculation.travelReimbursement });
  }
  
  if (calculation.subsistence > 0) {
    nonTaxableItems.push({ description: 'Subsistence/Meals', amount: calculation.subsistence });
  }

  return {
    taxableItems,
    nonTaxableItems,
    taxSummary: {
      subtotal: calculation.taxableSubtotal,
      gst: calculation.gstAmount,
      afterTax: calculation.afterTaxSubtotal
    },
    total: calculation.grandTotal
  };
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
  if (Math.abs(calculation.gstAmount - expectedGST) > 0.01) {
    errors.push(`GST calculation incorrect. Expected: ${expectedGST}, Got: ${calculation.gstAmount}`);
  }
  
  // Validate totals
  const expectedAfterTax = calculation.taxableSubtotal + calculation.gstAmount;
  if (Math.abs(calculation.afterTaxSubtotal - expectedAfterTax) > 0.01) {
    errors.push(`After-tax subtotal incorrect. Expected: ${expectedAfterTax}, Got: ${calculation.afterTaxSubtotal}`);
  }
  
  const expectedGrandTotal = calculation.afterTaxSubtotal + calculation.nonTaxableTotal;
  if (Math.abs(calculation.grandTotal - expectedGrandTotal) > 0.01) {
    errors.push(`Grand total incorrect. Expected: ${expectedGrandTotal}, Got: ${calculation.grandTotal}`);
  }
  
  // Warnings for unusual values
  if (calculation.gstAmount > calculation.taxableSubtotal * 0.15) {
    warnings.push('GST seems unusually high - please verify tax rate');
  }
  
  if (calculation.taxableSubtotal === 0 && calculation.grandTotal > 0) {
    warnings.push('Invoice contains only reimbursements - no taxable services');
  }
  
  if (calculation.grandTotal === 0) {
    warnings.push('Invoice total is zero - please verify all amounts');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate travel reimbursement based on kilometers
 */
export function calculateTravelReimbursement(kilometers: number, ratePerKm: number = STANDARD_TRAVEL_RATE_PER_KM): number {
  return Math.round(kilometers * ratePerKm * 100) / 100;
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
 * Quick calculation helper for trial setup preview
 */
export function calculateTrialPreview(data: {
  dayRate: number;
  truckRate: number;
  travelKms: number;
  subsistence: number;
  additionalCharges?: number;
}): AlbertaInvoiceCalculation {
  const travelReimbursement = calculateTravelReimbursement(data.travelKms);
  
  return calculateAlbertaTax({
    dayRateTotal: data.dayRate,
    truckRateTotal: data.truckRate,
    additionalCharges: data.additionalCharges || 0,
    travelReimbursement,
    subsistence: data.subsistence
  });
}

/**
 * Get Alberta tax information for display
 */
export function getAlbertaTaxInfo(): {
  gstRate: number;
  pstRate: number;
  totalTaxRate: number;
  description: string;
  applicableItems: string[];
  exemptItems: string[];
} {
  return {
    gstRate: ALBERTA_GST_RATE,
    pstRate: ALBERTA_PST_RATE,
    totalTaxRate: ALBERTA_TOTAL_TAX_RATE,
    description: 'Alberta applies 5% GST only (no provincial sales tax)',
    applicableItems: [
      'Labour services (day rates, hourly rates)',
      'Equipment rental services (truck rates, equipment fees)',
      'Additional service charges'
    ],
    exemptItems: [
      'Travel kilometer reimbursements',
      'Subsistence/meal allowances (CRA-compliant)',
      'Legitimate business expense reimbursements'
    ]
  };
} 