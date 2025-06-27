import jsPDF from 'jspdf';

interface InvoiceEntry {
  day: number;
  date: string;
  description: string;
  location?: string;
  ticketNumber?: string;
  truck: number;
  kms: number;
  kmsRate: number;
  other: number;
  total: number;
}

interface InvoiceData {
  // Header Information
  client: {
    name: string;
    address: string;
  };
  contractor: {
    name: string;
    address: string;
  };
  invoiceDate: string;
  payPeriod: {
    startDate: string;
    endDate: string;
  };
  invoiceNumber?: string;
  
  // Work Summary
  entries: InvoiceEntry[];
  
  // Financial Summary
  totals: {
    totalTruckCharges: number;
    totalKmsCharges: number;
    totalOtherCharges: number;
    subtotal: number;
    gst: number;
    subsistence: number;
    grandTotal: number;
  };
}

export async function generateProfessionalInvoicePDF(invoiceData: InvoiceData): Promise<jsPDF> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  let yPosition = 20;

  // Helper function for centered text
  const centerText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Header Information Section
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  // Client Information (centered)
  centerText(`Client: ${invoiceData.client.name}`, yPosition);
  yPosition += 6;
  centerText(`Client Address: ${invoiceData.client.address}`, yPosition);
  yPosition += 6;
  centerText(`Invoice Date: ${invoiceData.invoiceDate}`, yPosition);
  yPosition += 6;

  // Contractor Information (centered)
  centerText(`Contractor: ${invoiceData.contractor.name}`, yPosition);
  yPosition += 6;
  centerText(`Contractor Address: ${invoiceData.contractor.address}`, yPosition);
  yPosition += 6;
  centerText(`Pay Period: ${invoiceData.payPeriod.startDate} to ${invoiceData.payPeriod.endDate}`, yPosition);
  yPosition += 6;
  centerText(`Invoice Number: ${invoiceData.invoiceNumber || '-'}`, yPosition);
  
  yPosition += 15;

  // Work Summary Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Work Summary:', 15, yPosition);
  yPosition += 10;

  // Prepare table data
  const entries = invoiceData.entries;
  const tableHeaders = [['Day', 'Date', 'Description', 'Location', 'Ticket #', 'Truck', 'Kms', 'Kms Rate', 'Other', 'Subsistence', 'Total']];
  const tableData = entries.map((entry, index) => [
    (index + 1).toString(),
    entry.date,
    entry.description,
    entry.location || '',
    entry.ticketNumber || '',
    `$${entry.truck.toFixed(2)}`,
    entry.kms.toString(),
    `$${entry.kmsRate.toFixed(2)}`,
    `$${entry.other.toFixed(2)}`,
    `$${50.00.toFixed(2)}`, // Daily subsistence rate
    `$${entry.total.toFixed(2)}`
  ]);

  // Add work summary table
  try {
    const autoTable = (await import('jspdf-autotable')).default;
    autoTable(doc, {
      startY: yPosition,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 }, // Day
        1: { halign: 'center', cellWidth: 22 }, // Date
        2: { halign: 'left', cellWidth: 35 },   // Description
        3: { halign: 'center', cellWidth: 20 }, // Location
        4: { halign: 'center', cellWidth: 18 }, // Ticket #
        5: { halign: 'right', cellWidth: 18 },  // Truck
        6: { halign: 'center', cellWidth: 12 }, // Kms
        7: { halign: 'right', cellWidth: 20 },  // Kms Rate
        8: { halign: 'right', cellWidth: 18 },  // Other
        9: { halign: 'right', cellWidth: 25 },  // Subsistence
        10: { halign: 'right', cellWidth: 25 },  // Total
      },
      margin: { left: 15, right: 15 },
    });
  } catch (importError) {
    console.warn('AutoTable import failed, using fallback:', importError);
    // Fallback: simple text representation
    doc.text('Table not available', 15, yPosition);
    yPosition += 10;
  }

  // Get the final Y position after the table
  yPosition = (doc as any).lastAutoTable?.finalY + 15 || yPosition + 50;

  // Summary sections with icons
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  // Total Truck Charges
  doc.text('⊕ Total Truck Charges', 15, yPosition);
  doc.text(`$${invoiceData.totals.totalTruckCharges.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
  yPosition += 8;

  // Total Kms Charges
  doc.text('⊕ Total Kms Charges', 15, yPosition);
  doc.text(`$${invoiceData.totals.totalKmsCharges.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
  yPosition += 8;

  // Total Other Charges
  doc.text('⊕ Total Other Charges', 15, yPosition);
  doc.text(`$${invoiceData.totals.totalOtherCharges.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
  yPosition += 15;

  // Financial Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Financial Summary:', 15, yPosition);
  yPosition += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  // Subtotal
  doc.text('⊖ Subtotal', 15, yPosition);
  doc.text(`$${invoiceData.totals.subtotal.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
  yPosition += 10;

  // GST (5%)
  doc.text('% GST (5%)', 15, yPosition);
  doc.text(`$${invoiceData.totals.gst.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
  yPosition += 10;

  // Subsistence (Tax-Free) - with yellow highlight effect
  doc.setFillColor(255, 255, 200); // Light yellow background
  doc.rect(13, yPosition - 5, pageWidth - 26, 8, 'F');
  doc.text('⊕ Subsistence (Tax-Free)', 15, yPosition);
  doc.text(`$${invoiceData.totals.subsistence.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
  yPosition += 15;

  // Grand Total - green color
  doc.setTextColor(34, 139, 34); // Green color
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('$ Grand Total', 15, yPosition);
  doc.text(`$${invoiceData.totals.grandTotal.toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  return doc;
}

// Function to open PDF in new window for review
export async function generateAndPreviewPDF(invoiceData: InvoiceData): Promise<void> {
  try {
    console.log('🎯 Generating professional PDF preview...');
    
    const doc = await generateProfessionalInvoicePDF(invoiceData);
    
    // Convert to blob
    const pdfBlob = doc.output('blob');
    
    // Create object URL
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Open in new window for preview
    const newWindow = window.open(pdfUrl, '_blank');
    
    if (!newWindow) {
      alert('Please allow popups to preview the PDF');
      return;
    }
    
    // Clean up URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 10000);
    
    console.log('✅ PDF preview opened in new window');
    
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    alert('Failed to generate PDF preview');
  }
}

// Helper function to convert your simulation data to invoice format
export function convertSimulationToInvoiceData(simulationData: any): InvoiceData {
  const entries: InvoiceEntry[] = simulationData.entries
    .filter((entry: any) => entry.completed)
    .map((entry: any, index: number) => ({
      day: index + 1,
      date: entry.date, // Use date string directly
      description: entry.description || 'Stack Production Testing',
      location: entry.location || '', // Empty as shown in reference
      ticketNumber: entry.ticketNumber || '', // Empty as shown in reference
      truck: entry.truckRate || 0, // Use actual truck rate
      kms: entry.kmsDriven || 0, // Use actual kms
      kmsRate: entry.kmsRate || 0, // Use actual kms rate
      other: entry.otherCharges || 0, // Use actual other charges
      total: entry.dailyTotal || 0 // Use actual daily total
    }));

  // Calculate totals exactly like in the preview
  const totalTruckCharges = entries.reduce((sum, entry) => sum + entry.truck, 0);
  const totalKmsCharges = entries.reduce((sum, entry) => sum + (entry.kms * entry.kmsRate), 0);
  const totalOtherCharges = entries.reduce((sum, entry) => sum + entry.other, 0);
  const subtotal = entries.reduce((sum, entry) => sum + entry.total, 0);
  const gst = subtotal * 0.05; // 5% GST
  const subsistence = 50.00; // Per day subsistence rate
  const totalSubsistence = entries.length * subsistence;
  const grandTotal = subtotal + gst + totalSubsistence;

  return {
    client: {
      name: simulationData.clientName || 'Acme Energy Ltd.',
      address: simulationData.clientAddress || '123 Main St, Calgary, AB'
    },
    contractor: {
      name: simulationData.contractorName || 'John Doe',
      address: simulationData.contractorAddress || '456 Contractor Rd, Edmonton, AB'
    },
    invoiceDate: new Date().toLocaleDateString('en-CA'),
    payPeriod: {
      startDate: simulationData.startDate,
      endDate: simulationData.endDate
    },
    invoiceNumber: simulationData.invoiceNumber || '-',
    entries,
    totals: {
      totalTruckCharges,
      totalKmsCharges,
      totalOtherCharges,
      subtotal,
      gst,
      subsistence: totalSubsistence,
      grandTotal
    }
  };
} 