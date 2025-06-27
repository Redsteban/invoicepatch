import jsPDF from 'jspdf';

interface InvoiceEntry {
  day: number;
  date: string;
  description: string;
  location: string;
  ticketNumber: string;
  truckRate: number;
  kmsDriven: number;
  kmsRate: number;
  otherCharges: number;
  dailyTotal: number;
  worked?: boolean;
  hoursWorked?: number;
  truckUsed?: boolean;
  travelKms?: number;
  subsistence?: number;
}

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  invoiceDate: string;
  contractorName: string;
  contractorAddress: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  entries: InvoiceEntry[];
  totals: {
    subtotal: number;
    gst: number;
    subsistence: number;
    grandTotal: number;
    truckTotal: number;
    kmsTotal: number;
    otherTotal: number;
  };
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<jsPDF | null> {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = margin;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94); // green
    doc.text('✔', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(18);
    doc.setTextColor(34, 34, 34);
    doc.text('Invoice Ready for Submission', pageWidth / 2, y, { align: 'center' });
    y += 12;

    // Invoice meta info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const metaLeft = margin;
    const metaGap = 7;
    doc.text(`Client: ${invoiceData.clientName}`, metaLeft, y);
    y += metaGap;
    doc.text(`Client Address: ${invoiceData.clientAddress}`, metaLeft, y);
    y += metaGap;
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, metaLeft, y);
    y += metaGap;
    doc.text(`Contractor: ${invoiceData.contractorName}`, metaLeft, y);
    y += metaGap;
    doc.text(`Contractor Address: ${invoiceData.contractorAddress}`, metaLeft, y);
    y += metaGap;
    doc.text(`Pay Period: ${invoiceData.payPeriodStart} to ${invoiceData.payPeriodEnd}`, metaLeft, y);
    y += metaGap;
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, metaLeft, y);
    y += metaGap + 2;

    // Work Summary Table (matching on-screen invoice)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Invoice', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const tableColumns = [
      { header: 'Day', dataKey: 'day' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Location', dataKey: 'location' },
      { header: 'Ticket #', dataKey: 'ticketNumber' },
      { header: 'Truck', dataKey: 'truckRate' },
      { header: 'Kms', dataKey: 'kmsDriven' },
      { header: 'Kms Rate', dataKey: 'kmsRate' },
      { header: 'Other', dataKey: 'otherCharges' },
      { header: 'Total', dataKey: 'dailyTotal' },
    ];
    const tableRows = invoiceData.entries.map((entry, idx) => ({
      day: idx + 1,
      date: entry.date,
      description: entry.description,
      location: entry.location || '',
      ticketNumber: entry.ticketNumber || '',
      truckRate: entry.truckRate ? `$${Number(entry.truckRate).toFixed(2)}` : '',
      kmsDriven: entry.kmsDriven ?? '',
      kmsRate: entry.kmsRate ? `$${Number(entry.kmsRate).toFixed(2)}` : '',
      otherCharges: entry.otherCharges ? `$${Number(entry.otherCharges).toFixed(2)}` : '',
      dailyTotal: entry.dailyTotal ? `$${Number(entry.dailyTotal).toFixed(2)}` : '',
    }));
    
    // Dynamic import for autoTable
    try {
      const autoTable = (await import('jspdf-autotable')).default;
      if (typeof autoTable === 'function') {
        autoTable(doc, {
          startY: y,
          head: [tableColumns.map(col => col.header)],
          body: tableRows.map(row => tableColumns.map(col => (row as any)[col.dataKey])),
          styles: { font: 'helvetica', fontSize: 9, cellPadding: 1 },
          headStyles: { fillColor: [243, 244, 246], textColor: 34, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: margin, right: margin },
          theme: 'grid',
        });
        y = (doc as any).lastAutoTable.finalY + 6;
      } else {
        doc.text('Table not available', margin, y);
        y += 10;
      }
    } catch (importError) {
      console.warn('AutoTable import failed, using fallback:', importError);
      doc.text('Table not available', margin, y);
      y += 10;
    }

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('Created with InvoicePatch', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.setTextColor(51, 51, 51);

    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    return null;
  }
}

export function calculateInvoiceTotals(entries: InvoiceEntry[], hourlyRate: number = 45) {
  const totalHours = entries.reduce((sum, entry) => sum + (entry.hoursWorked ?? 0), 0);
  const subtotal = entries.reduce((sum, entry) => sum + (entry.dailyTotal ?? 0), 0);
  // GST only (5%)
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  return {
    totalHours,
    subtotal,
    tax,
    total
  };
} 