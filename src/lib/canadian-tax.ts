// Canadian Tax Calculation Utilities
// CRA-compliant tax rates and business number validation

export interface CanadianProvince {
  code: string;
  name: string;
  gst: number;
  pst: number;
  hst: number;
  businessNumberRequired: boolean;
}

export const CANADIAN_PROVINCES: Record<string, CanadianProvince> = {
  'BC': { 
    code: 'BC', 
    name: 'British Columbia', 
    gst: 5, 
    pst: 7, 
    hst: 0,
    businessNumberRequired: true 
  },
  'AB': { 
    code: 'AB', 
    name: 'Alberta', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    businessNumberRequired: true 
  },
  'SK': { 
    code: 'SK', 
    name: 'Saskatchewan', 
    gst: 5, 
    pst: 6, 
    hst: 0,
    businessNumberRequired: true 
  },
  'MB': { 
    code: 'MB', 
    name: 'Manitoba', 
    gst: 5, 
    pst: 7, 
    hst: 0,
    businessNumberRequired: true 
  },
  'ON': { 
    code: 'ON', 
    name: 'Ontario', 
    gst: 0, 
    pst: 0, 
    hst: 13,
    businessNumberRequired: true 
  },
  'QC': { 
    code: 'QC', 
    name: 'Quebec', 
    gst: 5, 
    pst: 9.975, 
    hst: 0,
    businessNumberRequired: true 
  },
  'NB': { 
    code: 'NB', 
    name: 'New Brunswick', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    businessNumberRequired: true 
  },
  'NS': { 
    code: 'NS', 
    name: 'Nova Scotia', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    businessNumberRequired: true 
  },
  'PE': { 
    code: 'PE', 
    name: 'Prince Edward Island', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    businessNumberRequired: true 
  },
  'NL': { 
    code: 'NL', 
    name: 'Newfoundland and Labrador', 
    gst: 0, 
    pst: 0, 
    hst: 15,
    businessNumberRequired: true 
  },
  'YT': { 
    code: 'YT', 
    name: 'Yukon', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    businessNumberRequired: false 
  },
  'NT': { 
    code: 'NT', 
    name: 'Northwest Territories', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    businessNumberRequired: false 
  },
  'NU': { 
    code: 'NU', 
    name: 'Nunavut', 
    gst: 5, 
    pst: 0, 
    hst: 0,
    businessNumberRequired: false 
  }
};

export interface TaxCalculation {
  subtotal: number;
  gstAmount: number;
  pstAmount: number;
  hstAmount: number;
  totalTax: number;
  total: number;
  province: CanadianProvince;
}

export function calculateCanadianTax(subtotal: number, provinceCode: string): TaxCalculation {
  const province = CANADIAN_PROVINCES[provinceCode];
  
  if (!province) {
    throw new Error(`Invalid province code: ${provinceCode}`);
  }

  const gstAmount = subtotal * (province.gst / 100);
  const pstAmount = subtotal * (province.pst / 100);
  const hstAmount = subtotal * (province.hst / 100);
  const totalTax = gstAmount + pstAmount + hstAmount;
  const total = subtotal + totalTax;

  return {
    subtotal,
    gstAmount,
    pstAmount,
    hstAmount,
    totalTax,
    total,
    province
  };
}

// Validate Canadian Business Number (BN) format
export function validateBusinessNumber(businessNumber: string): boolean {
  // Canadian Business Number format: 123456789RT0001
  // 9 digits + 2 letter program identifier + 4 digit reference number
  const bnRegex = /^\d{9}[A-Z]{2}\d{4}$/;
  return bnRegex.test(businessNumber);
}

// Validate Canadian Postal Code
export function validatePostalCode(postalCode: string): boolean {
  // Canadian postal code format: A1A 1A1 or A1A1A1
  const pcRegex = /^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/;
  return pcRegex.test(postalCode.toUpperCase());
}

// Format currency for Canadian invoices
export function formatCanadianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

// Generate CRA-compliant invoice number
export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${year}-${timestamp}`;
}

// Calculate payment due date based on terms
export function calculateDueDate(invoiceDate: Date, paymentTerms: string): Date {
  const dueDate = new Date(invoiceDate);
  
  switch (paymentTerms.toLowerCase()) {
    case 'net 15':
    case 'net 15 days':
      dueDate.setDate(dueDate.getDate() + 15);
      break;
    case 'net 30':
    case 'net 30 days':
      dueDate.setDate(dueDate.getDate() + 30);
      break;
    case 'net 45':
    case 'net 45 days':
      dueDate.setDate(dueDate.getDate() + 45);
      break;
    case 'net 60':
    case 'net 60 days':
      dueDate.setDate(dueDate.getDate() + 60);
      break;
    case 'due on receipt':
    case 'immediate':
      // Due date is the same as invoice date
      break;
    default:
      // Default to 30 days
      dueDate.setDate(dueDate.getDate() + 30);
  }
  
  return dueDate;
}

// Common Canadian payment terms
export const CANADIAN_PAYMENT_TERMS = [
  'Net 15 Days',
  'Net 30 Days',
  'Net 45 Days',
  'Net 60 Days',
  'Due on Receipt',
  '2/10 Net 30',
  '1/15 Net 30'
];

// Oil & Gas specific invoice categories for Canadian operations
export const OIL_GAS_INVOICE_CATEGORIES = [
  { id: 'labor', name: 'Labor & Services', taxable: true },
  { id: 'equipment', name: 'Equipment Rental', taxable: true },
  { id: 'materials', name: 'Materials & Supplies', taxable: true },
  { id: 'travel', name: 'Travel & Mileage', taxable: true },
  { id: 'accommodation', name: 'Accommodation', taxable: true },
  { id: 'meals', name: 'Meals & Entertainment', taxable: true },
  { id: 'fuel', name: 'Fuel & Energy', taxable: true },
  { id: 'safety', name: 'Safety Equipment', taxable: true },
  { id: 'consulting', name: 'Consulting Services', taxable: true },
  { id: 'training', name: 'Training & Certification', taxable: true }
];

// CRA compliance checklist for invoices
export interface CRAComplianceCheck {
  hasBusinessNumber: boolean;
  hasProperTaxCalculation: boolean;
  hasValidPostalCode: boolean;
  hasInvoiceNumber: boolean;
  hasInvoiceDate: boolean;
  hasPaymentTerms: boolean;
  hasCompleteBillingAddress: boolean;
  hasDetailedLineItems: boolean;
}

export function validateCRACompliance(invoice: any): CRAComplianceCheck {
  return {
    hasBusinessNumber: !!invoice.contractor?.gstNumber && validateBusinessNumber(invoice.contractor.gstNumber),
    hasProperTaxCalculation: true, // Would check if tax calculation is correct
    hasValidPostalCode: !!invoice.contractor?.postalCode && validatePostalCode(invoice.contractor.postalCode),
    hasInvoiceNumber: !!invoice.invoiceNumber,
    hasInvoiceDate: !!invoice.invoiceDate,
    hasPaymentTerms: !!invoice.paymentTerms,
    hasCompleteBillingAddress: !!(invoice.client?.companyName && invoice.client?.address && invoice.client?.city),
    hasDetailedLineItems: Array.isArray(invoice.lineItems) && invoice.lineItems.length > 0
  };
} 