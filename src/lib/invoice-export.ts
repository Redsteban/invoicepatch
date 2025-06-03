// Invoice Export Utilities for Canadian Invoicing System
// Supports PDF, CSV, Excel, QuickBooks, and Sage formats

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  fileExtension: string;
  mimeType: string;
}

export const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Professional invoice for client submission',
    fileExtension: 'pdf',
    mimeType: 'application/pdf'
  },
  {
    id: 'csv',
    name: 'CSV Spreadsheet',
    description: 'Simple spreadsheet format for record keeping',
    fileExtension: 'csv',
    mimeType: 'text/csv'
  },
  {
    id: 'excel',
    name: 'Excel Workbook',
    description: 'Advanced spreadsheet with formulas',
    fileExtension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks CSV',
    description: 'Import directly into QuickBooks',
    fileExtension: 'csv',
    mimeType: 'text/csv'
  },
  {
    id: 'sage',
    name: 'Sage 50 Format',
    description: 'Compatible with Sage accounting software',
    fileExtension: 'csv',
    mimeType: 'text/csv'
  }
];

// Generate CSV export for basic record keeping
export function generateCSVExport(invoice: any): string {
  const headers = [
    'Invoice Number',
    'Date',
    'Client',
    'Project',
    'AFE Code',
    'Description',
    'Quantity',
    'Rate',
    'Amount',
    'Category',
    'Subtotal',
    'GST',
    'PST',
    'HST',
    'Total'
  ];

  const rows: string[][] = [];
  
  // Add header row
  rows.push(headers);

  // Add line items
  invoice.lineItems.forEach((item: any) => {
    rows.push([
      invoice.invoiceNumber,
      invoice.invoiceDate,
      invoice.client.companyName,
      invoice.project.name,
      invoice.project.afeCode,
      item.description,
      item.quantity.toString(),
      item.rate.toString(),
      item.amount.toString(),
      item.category,
      '', // Subtotal - only on first row
      '', // GST - only on first row
      '', // PST - only on first row
      '', // HST - only on first row
      ''  // Total - only on first row
    ]);
  });

  // Add totals to first row
  if (rows.length > 1) {
    const taxCalc = calculateInvoiceTotals(invoice);
    rows[1][10] = taxCalc.subtotal.toString();
    rows[1][11] = taxCalc.gstAmount.toString();
    rows[1][12] = taxCalc.pstAmount.toString();
    rows[1][13] = taxCalc.hstAmount.toString();
    rows[1][14] = taxCalc.total.toString();
  }

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Generate QuickBooks-compatible CSV
export function generateQuickBooksCSV(invoice: any): string {
  const headers = [
    'Customer',
    'Item',
    'Description',
    'Qty',
    'Rate',
    'Amount',
    'Invoice Date',
    'Due Date',
    'Invoice Number',
    'Terms',
    'Tax Code',
    'Tax Amount'
  ];

  const rows: string[][] = [];
  rows.push(headers);

  const taxCalc = calculateInvoiceTotals(invoice);

  invoice.lineItems.forEach((item: any, index: number) => {
    rows.push([
      invoice.client.companyName,
      `${item.category}-${item.description}`,
      item.description,
      item.quantity.toString(),
      item.rate.toString(),
      item.amount.toString(),
      invoice.invoiceDate,
      invoice.dueDate,
      invoice.invoiceNumber,
      invoice.paymentTerms,
      determineTaxCode(invoice.client.province),
      index === 0 ? taxCalc.totalTax.toString() : '0'
    ]);
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Generate Sage 50 compatible format
export function generateSageCSV(invoice: any): string {
  const headers = [
    'Transaction Type',
    'Customer Account',
    'Customer Name',
    'Invoice Number',
    'Invoice Date',
    'Due Date',
    'Item Code',
    'Description',
    'Quantity',
    'Unit Price',
    'Net Amount',
    'Tax Code',
    'Tax Amount',
    'Total Amount'
  ];

  const rows: string[][] = [];
  rows.push(headers);

  const taxCalc = calculateInvoiceTotals(invoice);

  invoice.lineItems.forEach((item: any, index: number) => {
    rows.push([
      'SI', // Sales Invoice
      generateCustomerAccount(invoice.client.companyName),
      invoice.client.companyName,
      invoice.invoiceNumber,
      invoice.invoiceDate,
      invoice.dueDate,
      generateItemCode(item.category),
      item.description,
      item.quantity.toString(),
      item.rate.toString(),
      item.amount.toString(),
      determineTaxCode(invoice.client.province),
      index === 0 ? taxCalc.totalTax.toString() : '0',
      index === 0 ? taxCalc.total.toString() : item.amount.toString()
    ]);
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

// Helper functions
function calculateInvoiceTotals(invoice: any) {
  const subtotal = invoice.lineItems.reduce((sum: number, item: any) => sum + item.amount, 0);
  // You would import this from canadian-tax.ts in a real implementation
  return {
    subtotal,
    gstAmount: subtotal * 0.05, // Simplified for demo
    pstAmount: 0,
    hstAmount: 0,
    totalTax: subtotal * 0.05,
    total: subtotal * 1.05
  };
}

function determineTaxCode(province: string): string {
  const taxCodes: Record<string, string> = {
    'BC': 'GST+PST',
    'AB': 'GST',
    'SK': 'GST+PST',
    'MB': 'GST+PST',
    'ON': 'HST',
    'QC': 'GST+QST',
    'NB': 'HST',
    'NS': 'HST',
    'PE': 'HST',
    'NL': 'HST',
    'YT': 'GST',
    'NT': 'GST',
    'NU': 'GST'
  };
  return taxCodes[province] || 'GST';
}

function generateCustomerAccount(companyName: string): string {
  // Generate a customer account code from company name
  return companyName.replace(/[^A-Z0-9]/gi, '').substring(0, 8).toUpperCase();
}

function generateItemCode(category: string): string {
  const codes: Record<string, string> = {
    'labor': 'LAB',
    'equipment': 'EQP',
    'travel': 'TRV',
    'expense': 'EXP',
    'materials': 'MAT',
    'consulting': 'CON'
  };
  return codes[category] || 'SRV';
}

// Email export functionality
export interface EmailConfig {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments: {
    filename: string;
    content: string;
    encoding: string;
  }[];
}

export function generateEmailConfig(invoice: any, format: string): EmailConfig {
  const filename = `${invoice.invoiceNumber}.${getFileExtension(format)}`;
  const content = generateExportContent(invoice, format);

  return {
    to: [invoice.client.email || ''],
    subject: `Invoice ${invoice.invoiceNumber} - ${invoice.project.name}`,
    body: generateEmailBody(invoice),
    attachments: [
      {
        filename,
        content,
        encoding: format === 'pdf' ? 'base64' : 'utf8'
      }
    ]
  };
}

function generateEmailBody(invoice: any): string {
  return `Dear ${invoice.client.companyName},

Please find attached invoice ${invoice.invoiceNumber} for the ${invoice.project.name} project.

Invoice Details:
- Project: ${invoice.project.name}
- AFE Code: ${invoice.project.afeCode}
- Work Period: ${invoice.project.workPeriod}
- Amount Due: $${calculateInvoiceTotals(invoice).total.toFixed(2)} CAD
- Payment Terms: ${invoice.paymentTerms}
- Due Date: ${invoice.dueDate}

If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business.

Best regards,
${invoice.contractor.contactName}
${invoice.contractor.businessName}
${invoice.contractor.phone}
${invoice.contractor.email}`;
}

function getFileExtension(format: string): string {
  const extensions: Record<string, string> = {
    'pdf': 'pdf',
    'csv': 'csv',
    'excel': 'xlsx',
    'quickbooks': 'csv',
    'sage': 'csv'
  };
  return extensions[format] || 'txt';
}

function generateExportContent(invoice: any, format: string): string {
  switch (format) {
    case 'csv':
      return generateCSVExport(invoice);
    case 'quickbooks':
      return generateQuickBooksCSV(invoice);
    case 'sage':
      return generateSageCSV(invoice);
    case 'pdf':
      return generatePDFContent(invoice);
    default:
      return generateCSVExport(invoice);
  }
}

// Placeholder for PDF generation (would use a library like jsPDF or Puppeteer)
function generatePDFContent(invoice: any): string {
  // This would generate actual PDF content using a PDF library
  return 'PDF_CONTENT_PLACEHOLDER';
}

// Print formatting utilities
export function generatePrintableHTML(invoice: any): string {
  const taxCalc = calculateInvoiceTotals(invoice);
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company { flex: 1; }
        .invoice-info { text-align: right; }
        .billing { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .bill-to, .project-info { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .totals { text-align: right; width: 300px; margin-left: auto; }
        .total-row { font-weight: bold; font-size: 18px; }
        @media print {
            body { margin: 0; padding: 15px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company">
            <h1>${invoice.contractor.businessName}</h1>
            <p>${invoice.contractor.address}<br>
            ${invoice.contractor.city}, ${invoice.contractor.province} ${invoice.contractor.postalCode}<br>
            Phone: ${invoice.contractor.phone}<br>
            Email: ${invoice.contractor.email}<br>
            ${invoice.contractor.gstNumber ? `GST/HST: ${invoice.contractor.gstNumber}` : ''}</p>
        </div>
        <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
            <strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}<br>
            <strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
    </div>

    <div class="billing">
        <div class="bill-to">
            <h3>BILL TO:</h3>
            <p><strong>${invoice.client.companyName}</strong><br>
            ${invoice.client.address}<br>
            ${invoice.client.city}, ${invoice.client.province} ${invoice.client.postalCode}</p>
        </div>
        <div class="project-info">
            <h3>PROJECT:</h3>
            <p><strong>Project:</strong> ${invoice.project.name}<br>
            <strong>AFE Code:</strong> ${invoice.project.afeCode}<br>
            <strong>Work Order:</strong> ${invoice.project.workOrderRef}<br>
            <strong>Period:</strong> ${invoice.project.workPeriod}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.lineItems.map((item: any) => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.rate.toFixed(2)}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr><td>Subtotal:</td><td>$${taxCalc.subtotal.toFixed(2)}</td></tr>
            ${taxCalc.gstAmount > 0 ? `<tr><td>GST (5%):</td><td>$${taxCalc.gstAmount.toFixed(2)}</td></tr>` : ''}
            ${taxCalc.pstAmount > 0 ? `<tr><td>PST:</td><td>$${taxCalc.pstAmount.toFixed(2)}</td></tr>` : ''}
            ${taxCalc.hstAmount > 0 ? `<tr><td>HST:</td><td>$${taxCalc.hstAmount.toFixed(2)}</td></tr>` : ''}
            <tr class="total-row"><td>TOTAL:</td><td>$${taxCalc.total.toFixed(2)}</td></tr>
        </table>
    </div>

    <div style="margin-top: 30px;">
        <p><strong>Payment Terms:</strong> ${invoice.paymentTerms}</p>
        <p>${invoice.notes}</p>
    </div>

    <div class="no-print" style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Print Invoice</button>
    </div>
</body>
</html>`;
} 