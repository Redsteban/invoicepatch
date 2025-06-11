import { supabaseAdmin } from './supabase';
import { PayPeriod } from './payrollCalculation';

export interface DailyEntry {
  id: string;
  trial_invoice_id: string;
  entry_date: string;
  days_worked: number;
  truck_used: boolean;
  travel_kms: number;
  subsistence_claimed: boolean;
  notes?: string;
  created_at: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: 'labor' | 'truck' | 'travel' | 'subsistence';
}

export interface GeneratedInvoice {
  invoiceNumber: string;
  period: PayPeriod;
  contractorInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  companyInfo: {
    name: string;
    address?: string;
  };
  lineItems: InvoiceLineItem[];
  subtotal: number;
  gst: number;
  total: number;
  workDays: DailyEntry[];
  periodSummary: {
    totalDaysWorked: number;
    totalTruckDays: number;
    totalTravelKms: number;
    totalSubsistenceDays: number;
    averageDailyRate: number;
  };
  generatedAt: string;
  dueDate: string;
  paymentDate: string;
}

/**
 * Generate a complete invoice for a specific payroll period
 */
export async function generateInvoiceForPeriod(
  trialInvoiceId: string,
  periodNumber: number
): Promise<GeneratedInvoice> {
  try {
    console.log(`📋 Generating invoice for period ${periodNumber}, trial invoice ${trialInvoiceId}`);

    // Get trial invoice and payroll schedule
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .eq('id', trialInvoiceId)
      .single();

    if (invoiceError || !invoice) {
      throw new Error(`Failed to fetch trial invoice: ${invoiceError?.message}`);
    }

    if (!invoice.payroll_schedule || !Array.isArray(invoice.payroll_schedule)) {
      throw new Error('Trial invoice does not have a valid payroll schedule');
    }

    const period = invoice.payroll_schedule.find((p: PayPeriod) => p.periodNumber === periodNumber);
    if (!period) {
      throw new Error(`Period ${periodNumber} not found in payroll schedule`);
    }

    console.log(`📅 Found period: ${period.startDate} to ${period.endDate}`);

    // Get all daily entries for this period
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('daily_entries')
      .select('*')
      .eq('trial_invoice_id', trialInvoiceId)
      .gte('entry_date', period.startDate)
      .lte('entry_date', period.endDate)
      .order('entry_date', { ascending: true });

    if (entriesError) {
      throw new Error(`Failed to fetch daily entries: ${entriesError.message}`);
    }

    const dailyEntries = entries || [];
    console.log(`📊 Found ${dailyEntries.length} daily entries for period`);

    // Calculate invoice totals and generate line items
    const invoiceData = calculateInvoiceTotals(
      dailyEntries,
      period,
      invoice
    );

    console.log(`✅ Invoice generated successfully: ${invoiceData.invoiceNumber}`);
    return invoiceData;

  } catch (error) {
    console.error('❌ Error generating invoice:', error);
    throw error;
  }
}

/**
 * Calculate invoice totals and generate line items from daily entries
 */
function calculateInvoiceTotals(
  entries: DailyEntry[],
  period: PayPeriod,
  invoice: any
): GeneratedInvoice {
  const lineItems: InvoiceLineItem[] = [];
  
  // Calculate totals from daily entries
  const totalDaysWorked = entries.reduce((sum, entry) => sum + (entry.days_worked || 0), 0);
  const totalTruckDays = entries.filter(entry => entry.truck_used).length;
  const totalTravelKms = entries.reduce((sum, entry) => sum + (entry.travel_kms || 0), 0);
  const totalSubsistenceDays = entries.filter(entry => entry.subsistence_claimed).length;

  // Rates from invoice
  const dayRate = invoice.day_rate || 450;
  const truckRate = invoice.truck_rate || 150;
  const ratePerKm = invoice.rate_per_km || 0.68;
  const subsistenceRate = invoice.subsistence || 75;

  // Generate line items
  if (totalDaysWorked > 0) {
    lineItems.push({
      description: `Labor - ${totalDaysWorked} day${totalDaysWorked !== 1 ? 's' : ''} worked`,
      quantity: totalDaysWorked,
      rate: dayRate,
      amount: totalDaysWorked * dayRate,
      type: 'labor'
    });
  }

  if (totalTruckDays > 0) {
    lineItems.push({
      description: `Truck rental - ${totalTruckDays} day${totalTruckDays !== 1 ? 's' : ''}`,
      quantity: totalTruckDays,
      rate: truckRate,
      amount: totalTruckDays * truckRate,
      type: 'truck'
    });
  }

  if (totalTravelKms > 0) {
    lineItems.push({
      description: `Travel - ${totalTravelKms} kilometers`,
      quantity: totalTravelKms,
      rate: ratePerKm,
      amount: totalTravelKms * ratePerKm,
      type: 'travel'
    });
  }

  if (totalSubsistenceDays > 0) {
    lineItems.push({
      description: `Subsistence - ${totalSubsistenceDays} day${totalSubsistenceDays !== 1 ? 's' : ''}`,
      quantity: totalSubsistenceDays,
      rate: subsistenceRate,
      amount: totalSubsistenceDays * subsistenceRate,
      type: 'subsistence'
    });
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const gstRate = 0.05; // 5% GST for Canada
  const gst = subtotal * gstRate;
  const total = subtotal + gst;

  // Generate invoice number
  const invoiceNumber = generateInvoiceNumber(invoice.sequence_number, period.periodNumber);

  // Calculate due date (typically 30 days from generation)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    invoiceNumber,
    period,
    contractorInfo: {
      name: invoice.contractor_name,
      email: invoice.contractor_email,
      phone: invoice.contractor_phone,
      address: invoice.contractor_address
    },
    companyInfo: {
      name: invoice.company || 'Construction Company',
      address: invoice.company_address
    },
    lineItems,
    subtotal,
    gst,
    total,
    workDays: entries,
    periodSummary: {
      totalDaysWorked,
      totalTruckDays,
      totalTravelKms,
      totalSubsistenceDays,
      averageDailyRate: totalDaysWorked > 0 ? subtotal / totalDaysWorked : 0
    },
    generatedAt: new Date().toISOString(),
    dueDate: dueDate.toISOString().split('T')[0],
    paymentDate: typeof period.paymentDate === 'string' ? period.paymentDate : period.paymentDate.toISOString().split('T')[0]
  };
}

/**
 * Generate a unique invoice number
 */
function generateInvoiceNumber(sequenceNumber: string, periodNumber: number): string {
  const year = new Date().getFullYear();
  const paddedPeriod = periodNumber.toString().padStart(2, '0');
  return `${sequenceNumber}-${year}-P${paddedPeriod}`;
}

/**
 * Save generated invoice to database
 */
export async function saveGeneratedInvoice(
  generatedInvoice: GeneratedInvoice,
  trialInvoiceId: string
): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from('generated_invoices')
      .insert([{
        trial_invoice_id: trialInvoiceId,
        invoice_number: generatedInvoice.invoiceNumber,
        period_number: generatedInvoice.period.periodNumber,
        contractor_name: generatedInvoice.contractorInfo.name,
        contractor_email: generatedInvoice.contractorInfo.email,
        company_name: generatedInvoice.companyInfo.name,
        line_items: generatedInvoice.lineItems,
        subtotal: generatedInvoice.subtotal,
        gst: generatedInvoice.gst,
        total: generatedInvoice.total,
        work_days: generatedInvoice.workDays,
        period_summary: generatedInvoice.periodSummary,
        due_date: generatedInvoice.dueDate,
        payment_date: generatedInvoice.paymentDate,
        status: 'generated',
        generated_at: generatedInvoice.generatedAt
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save invoice: ${error.message}`);
    }

    console.log(`💾 Invoice saved with ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error('❌ Error saving invoice:', error);
    throw error;
  }
}

/**
 * Get all generated invoices for a contractor
 */
export async function getContractorInvoices(trialInvoiceId: string): Promise<GeneratedInvoice[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('generated_invoices')
      .select('*')
      .eq('trial_invoice_id', trialInvoiceId)
      .order('period_number', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching contractor invoices:', error);
    throw error;
  }
}

/**
 * Generate invoice for current active period
 */
export async function generateCurrentPeriodInvoice(trialInvoiceId: string): Promise<GeneratedInvoice> {
  try {
    const { data: invoice } = await supabaseAdmin
      .from('trial_invoices')
      .select('current_period')
      .eq('id', trialInvoiceId)
      .single();

    if (!invoice?.current_period) {
      throw new Error('No current period found for contractor');
    }

    return await generateInvoiceForPeriod(trialInvoiceId, invoice.current_period);
  } catch (error) {
    console.error('❌ Error generating current period invoice:', error);
    throw error;
  }
}

/**
 * Bulk generate invoices for multiple periods
 */
export async function generateBulkInvoices(
  trialInvoiceId: string,
  periodNumbers: number[]
): Promise<GeneratedInvoice[]> {
  const results: GeneratedInvoice[] = [];
  
  for (const periodNumber of periodNumbers) {
    try {
      const invoice = await generateInvoiceForPeriod(trialInvoiceId, periodNumber);
      results.push(invoice);
      console.log(`✅ Generated invoice for period ${periodNumber}`);
    } catch (error) {
      console.error(`❌ Failed to generate invoice for period ${periodNumber}:`, error);
      // Continue with other periods even if one fails
    }
  }
  
  return results;
}

/**
 * Format currency values for display
 */
export function formatCurrency(amount: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Generate HTML invoice template
 */
export function generateInvoiceHTML(invoice: GeneratedInvoice): string {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
        .invoice-number { font-size: 18px; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .amount { text-align: right; }
        .total-row { font-weight: bold; background-color: #f8f9fa; }
        .period-info { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-number">${invoice.invoiceNumber}</div>
        </div>
        <div>
          <div><strong>Generated:</strong> ${formatDate(invoice.generatedAt.split('T')[0])}</div>
          <div><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Contractor Information</div>
        <div><strong>${invoice.contractorInfo.name}</strong></div>
        <div>${invoice.contractorInfo.email}</div>
        ${invoice.contractorInfo.phone ? `<div>${invoice.contractorInfo.phone}</div>` : ''}
      </div>

      <div class="section">
        <div class="section-title">Bill To</div>
        <div><strong>${invoice.companyInfo.name}</strong></div>
        ${invoice.companyInfo.address ? `<div>${invoice.companyInfo.address}</div>` : ''}
      </div>

      <div class="period-info">
        <div class="section-title">Pay Period Information</div>
        <div><strong>Period:</strong> ${invoice.period.periodNumber} (${formatDate(invoice.period.startDate)} - ${formatDate(invoice.period.endDate)})</div>
        <div><strong>Days in Period:</strong> ${invoice.period.daysInPeriod}${invoice.period.isPartialPeriod ? ' (Partial Period)' : ''}</div>
        <div><strong>Payment Date:</strong> ${formatDate(invoice.paymentDate)}</div>
      </div>

      <div class="section">
        <div class="section-title">Services Provided</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th class="amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.lineItems.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.rate)}</td>
                <td class="amount">${formatCurrency(item.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <table>
          <tr>
            <td><strong>Subtotal:</strong></td>
            <td class="amount">${formatCurrency(invoice.subtotal)}</td>
          </tr>
          <tr>
            <td><strong>GST (5%):</strong></td>
            <td class="amount">${formatCurrency(invoice.gst)}</td>
          </tr>
          <tr class="total-row">
            <td><strong>Total:</strong></td>
            <td class="amount">${formatCurrency(invoice.total)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Period Summary</div>
        <ul>
          <li>Total Days Worked: ${invoice.periodSummary.totalDaysWorked}</li>
          <li>Truck Days: ${invoice.periodSummary.totalTruckDays}</li>
          <li>Travel Kilometers: ${invoice.periodSummary.totalTravelKms}</li>
          <li>Subsistence Days: ${invoice.periodSummary.totalSubsistenceDays}</li>
          <li>Average Daily Rate: ${formatCurrency(invoice.periodSummary.averageDailyRate)}</li>
        </ul>
      </div>
    </body>
    </html>
  `;
} 