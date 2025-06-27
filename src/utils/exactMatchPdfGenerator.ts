import jsPDF from 'jspdf';

interface InvoiceData {
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
  invoiceNumber: string;
  entries: Array<{
    day: number;
    date: string;
    description: string;
    location: string;
    ticketNumber: string;
    truck: number;
    kms: number;
    kmsRate: number;
    other: number;
    total: number;
  }>;
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

export async function generateExactMatchPDF(invoiceData: InvoiceData): Promise<jsPDF> {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  let yPos = 15;

  // Set default font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60); // Dark gray text

  // Helper function for centered text
  const centerText = (text: string, y: number, fontSize: number = 11) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Header section - exact match to preview
  centerText(`Client: ${invoiceData.client.name}`, yPos);
  yPos += 5;
  centerText(`Client Address: ${invoiceData.client.address}`, yPos);
  yPos += 5;
  centerText(`Invoice Date: ${invoiceData.invoiceDate}`, yPos);
  yPos += 5;
  centerText(`Contractor: ${invoiceData.contractor.name}`, yPos);
  yPos += 5;
  centerText(`Contractor Address: ${invoiceData.contractor.address}`, yPos);
  yPos += 5;
  centerText(`Pay Period: ${invoiceData.payPeriod.startDate} to ${invoiceData.payPeriod.endDate}`, yPos);
  yPos += 5;
  centerText(`Invoice Number: ${invoiceData.invoiceNumber}`, yPos);
  yPos += 15;

  // Work Summary header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Work Summary:', 15, yPos);
  yPos += 10;

  // Create table with exact column widths and styling
  const tableHeaders = [['Day', 'Date', 'Description', 'Location', 'Ticket #', 'Truck', 'Kms', 'Kms Rate', 'Other', 'Total']];
  
  const tableData = invoiceData.entries.map(entry => [
    entry.day.toString(),
    entry.date,
    entry.description,
    entry.location || '',
    entry.ticketNumber || '',
    entry.truck === 0 ? '$0' : `$${entry.truck.toFixed(2)}`,
    entry.kms.toString(),
    `$${entry.kmsRate.toFixed(1)}`,
    entry.other === 0 ? '$0' : `$${entry.other.toFixed(2)}`,
    `$${entry.total.toFixed(2)}`
  ]);

  // Use autoTable with exact styling to match preview
  try {
    const autoTable = (await import('jspdf-autotable')).default;
    autoTable(doc, {
      startY: yPos,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
        textColor: [60, 60, 60],
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 12 },  // Day
        1: { halign: 'center', cellWidth: 20 },  // Date
        2: { halign: 'left', cellWidth: 40 },    // Description
        3: { halign: 'center', cellWidth: 18 },  // Location
        4: { halign: 'center', cellWidth: 18 },  // Ticket #
        5: { halign: 'right', cellWidth: 15 },   // Truck
        6: { halign: 'center', cellWidth: 12 },  // Kms
        7: { halign: 'right', cellWidth: 18 },   // Kms Rate
        8: { halign: 'right', cellWidth: 15 },   // Other
        9: { halign: 'right', cellWidth: 22 },   // Total
      },
      margin: { left: 15, right: 15 },
    });
  } catch (importError) {
    console.warn('AutoTable import failed, using fallback:', importError);
    // Fallback: simple text representation
    doc.text('Table not available', 15, yPos);
    yPos += 10;
  }

  // Get position after table
  yPos = (doc as any).lastAutoTable?.finalY + 10 || yPos + 50;

  // Summary sections with exact spacing and formatting
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  // Total Truck Charges
  doc.text('⊕ Total Truck Charges', 15, yPos);
  doc.text(`$${invoiceData.totals.totalTruckCharges.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 7;

  // Total Kms Charges  
  doc.text('⊕ Total Kms Charges', 15, yPos);
  doc.text(`$${invoiceData.totals.totalKmsCharges.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 7;

  // Total Other Charges
  doc.text('⊕ Total Other Charges', 15, yPos);
  doc.text(`$${invoiceData.totals.totalOtherCharges.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 15;

  // Financial Summary header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary:', 15, yPos);
  yPos += 10;

  // Reset to normal for financial items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  // Subtotal
  doc.text('⊖ Subtotal', 15, yPos);
  doc.text(`$${invoiceData.totals.subtotal.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 8;

  // GST (5%)
  doc.text('% GST (5%)', 15, yPos);
  doc.text(`$${invoiceData.totals.gst.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 8;

  // Subsistence (Tax-Free) with yellow background
  doc.setFillColor(255, 255, 200); // Light yellow
  doc.rect(10, yPos - 4, pageWidth - 20, 8, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(10, yPos - 4, pageWidth - 20, 8, 'S');
  
  doc.text('⊕ Subsistence (Tax-Free)', 15, yPos);
  doc.text(`$${invoiceData.totals.subsistence.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });
  yPos += 15;

  // Grand Total with green styling
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34); // Green color
  doc.text('$ Grand Total', 15, yPos);
  doc.text(`$${invoiceData.totals.grandTotal.toFixed(2)}`, pageWidth - 15, yPos, { align: 'right' });

  return doc;
}

// Function to open PDF in new window (exact match to preview)
export async function generateAndOpenPDF(simulationData: any): Promise<void> {
  try {
    console.log('🎯 Generating exact match PDF...');
    
    // Convert simulation data to exact invoice format
    const invoiceData = convertToExactInvoiceData(simulationData);
    
    // Generate PDF
    const doc = await generateExactMatchPDF(invoiceData);
    
    // Convert to blob
    const pdfBlob = doc.output('blob');
    
    // Create object URL
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Open in new window
    const newWindow = window.open(pdfUrl, '_blank', 'width=800,height=600');
    
    if (!newWindow) {
      alert('Please allow popups to view the PDF');
      return;
    }
    
    // Clean up URL after delay
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 30000);
    
    console.log('✅ PDF opened in new window');
    
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    alert('Failed to generate PDF');
  }
}

// Convert simulation data to exact invoice format
function convertToExactInvoiceData(simulationData: any): InvoiceData {
  const completedEntries = simulationData.entries.filter((entry: any) => entry.completed);
  
  const entries = completedEntries.map((entry: any, index: number) => ({
    day: index + 1,
    date: new Date(entry.date).toLocaleDateString('en-CA'),
    description: entry.description || 'Stack Production Testing',
    location: entry.location || '',
    ticketNumber: entry.ticketNumber || '',
    truck: entry.truckRate || 0,
    kms: entry.kmsDriven || 0,
    kmsRate: entry.kmsRate || 0,
    other: entry.otherCharges || 0,
    total: entry.dailyTotal || 0
  }));

  // Calculate totals exactly like in the preview
  const totalTruckCharges = completedEntries.reduce((sum: number, entry: any) => sum + (entry.truckRate || 0), 0);
  const totalKmsCharges = completedEntries.reduce((sum: number, entry: any) => sum + ((entry.kmsDriven || 0) * (entry.kmsRate || 0)), 0);
  const totalOtherCharges = completedEntries.reduce((sum: number, entry: any) => sum + (entry.otherCharges || 0), 0);
  const subtotal = completedEntries.reduce((sum: number, entry: any) => sum + (entry.dailyTotal || 0), 0);
  const gst = subtotal * 0.05;
  const subsistence = 700.00;
  const grandTotal = subtotal + gst + subsistence;

  return {
    client: {
      name: simulationData.clientName || 'Acme Energy Ltd.',
      address: '123 Main St, Calgary, AB'
    },
    contractor: {
      name: simulationData.contractorName || 'John Doe',
      address: '456 Contractor Rd, Edmonton, AB'
    },
    invoiceDate: new Date().toLocaleDateString('en-CA'),
    payPeriod: {
      startDate: simulationData.startDate,
      endDate: simulationData.endDate
    },
    invoiceNumber: '-',
    entries,
    totals: {
      totalTruckCharges,
      totalKmsCharges,
      totalOtherCharges,
      subtotal,
      gst,
      subsistence,
      grandTotal
    }
  };
} 