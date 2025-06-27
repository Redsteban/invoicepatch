import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  email: string;
  invoiceData: {
    entries: any[];
    contractorName: string;
    clientName: string;
    clientAddress: string;
    contractorAddress: string;
    startDate: string;
    endDate: string;
    subsistence: number;
    totalTruckCharges: number;
    totalKmsCharges: number;
    totalOtherCharges: number;
    subtotal: number;
    gst: number;
    totalSubsistence: number;
    grandTotal: number;
    invoiceNumber: string;
    invoiceDate: string;
  };
  consent: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Email API endpoint called');
    
    // Parse request body
    const body: EmailRequest = await request.json();
    console.log('📥 Request data:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.email || !body.invoiceData) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Email and invoice data are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    console.log('🔧 SMTP Config:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      // Don't log password
    });

    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
      console.log('❌ Missing SMTP configuration');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Create transporter
    console.log('📤 Creating email transporter...');
    const transporter = nodemailer.createTransport(smtpConfig);

    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Generate PDF buffer using the same HTML generator as the preview
    console.log('📄 Generating PDF...');
    const pdfBuffer = await generateInvoicePDFBuffer(body.invoiceData);
    console.log(`✅ PDF generated (${pdfBuffer.length} bytes)`);

    // Create email HTML
    const emailHTML = createInvoiceEmailHTML(body.invoiceData, body.email);

    // Email options
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || '',
      to: body.email,
      subject: `Invoice ${body.invoiceData.invoiceNumber} - ${body.invoiceData.contractorName}`,
      html: emailHTML,
      attachments: [
        {
          filename: `invoice-${body.invoiceData.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    console.log('📧 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result && result.messageId);

    // Store subscriber if consent given
    if (body.consent) {
      console.log('📝 Storing subscriber email...');
      await storeSubscriber(body.email);
    }

    return NextResponse.json({
      success: true,
      messageId: result && result.messageId,
      message: 'Invoice sent successfully'
    });

  } catch (error: any) {
    console.error('💥 Email sending failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to generate PDF as buffer using the same HTML as preview
async function generateInvoicePDFBuffer(invoiceData: any): Promise<Buffer> {
  try {
    // Import required libraries
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;
    
    // Create the same HTML as the preview
    const invoiceHTML = createInvoiceHTML(invoiceData);
    
    // For server-side PDF generation, we'll use a simplified approach
    // since html2canvas requires a DOM environment
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    // Center the header information
    const centerText = (text: string, yPos: number) => {
      const textWidth = doc.getTextWidth(text);
      const x = (pageWidth - textWidth) / 2;
      doc.text(text, x, yPos);
    };

    centerText(`Client: ${invoiceData.clientName}`, y);
    y += 6;
    centerText(`Client Address: ${invoiceData.clientAddress}`, y);
    y += 6;
    centerText(`Invoice Date: ${invoiceData.invoiceDate}`, y);
    y += 6;
    centerText(`Contractor: ${invoiceData.contractorName}`, y);
    y += 6;
    centerText(`Contractor Address: ${invoiceData.contractorAddress}`, y);
    y += 6;
    centerText(`Pay Period: ${invoiceData.startDate} to ${invoiceData.endDate}`, y);
    y += 6;
    centerText(`Invoice Number: ${invoiceData.invoiceNumber}`, y);
    y += 15;

    // Work Summary header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Work Summary:', 15, y);
    y += 10;

    // Create table with entries - only show worked days
    const tableHeaders = [['Day', 'Date', 'Description', 'Location', 'Ticket #', 'Truck', 'Kms', 'Kms Rate', 'Other', 'Subsistence', 'Total']];
    const workedEntries = invoiceData.entries.filter((entry: any) => entry.worked);
    const tableData = workedEntries.map((entry: any, index: number) => [
      (index + 1).toString(),
      entry.date,
      entry.description,
      entry.location || '',
      entry.ticketNumber || '',
      entry.worked ? `$${entry.truckRate}` : '-',
      entry.worked ? entry.kmsDriven.toString() : '-',
      entry.worked ? `$${entry.kmsRate}` : '-',
      entry.worked ? `$${entry.otherCharges}` : '-',
      entry.worked ? `$${invoiceData.subsistence.toFixed(2)}` : '-',
      entry.worked ? `$${entry.dailyTotal.toFixed(2)}` : '-'
    ]);

    // Add table using autoTable
    try {
      const autoTable = (await import('jspdf-autotable')).default;
      autoTable(doc, {
        startY: y,
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
        margin: { left: 15, right: 15 },
      });
      y = (doc as any).lastAutoTable?.finalY + 10 || y + 50;
    } catch (importError) {
      console.warn('AutoTable import failed, using fallback:', importError);
      y += 50;
    }

    // Summary sections
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    doc.text('⊕ Total Truck Charges', 15, y);
    doc.text(`$${invoiceData.totalTruckCharges.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 7;

    doc.text('⊕ Total Kms Charges', 15, y);
    doc.text(`$${invoiceData.totalKmsCharges.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 7;

    doc.text('⊕ Total Other Charges', 15, y);
    doc.text(`$${invoiceData.totalOtherCharges.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 15;

    // Financial Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Financial Summary:', 15, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    doc.text('⊖ Subtotal', 15, y);
    doc.text(`$${invoiceData.subtotal.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 8;

    doc.text('% GST (5%)', 15, y);
    doc.text(`$${invoiceData.gst.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 8;

    // Subsistence with yellow background
    doc.setFillColor(255, 255, 200);
    doc.rect(10, y - 4, pageWidth - 20, 8, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, y - 4, pageWidth - 20, 8, 'S');
    
    doc.text('⊕ Subsistence (Tax-Free)', 15, y);
    doc.text(`$${invoiceData.totalSubsistence.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });
    y += 15;

    // Grand Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 139, 34);
    doc.text('$ Grand Total', 15, y);
    doc.text(`$${invoiceData.grandTotal.toFixed(2)}`, pageWidth - 15, y, { align: 'right' });

    // Convert to buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}

// Helper function to create the same HTML as the preview
function createInvoiceHTML(invoiceData: any): string {
  const workedEntries = invoiceData.entries.filter((entry: any) => entry.worked);
  
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #3c4043; line-height: 1.4;">
      <!-- Header Section - Exact match to preview -->
      <div style="text-align: center; margin-bottom: 30px; font-size: 11px;">
        <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Client:</span> ${invoiceData.clientName}</div>
        <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Client Address:</span> ${invoiceData.clientAddress}</div>
        <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Invoice Date:</span> ${invoiceData.invoiceDate}</div>
        <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Contractor:</span> ${invoiceData.contractorName}</div>
        <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Contractor Address:</span> ${invoiceData.contractorAddress}</div>
        <div style="margin-bottom: 4px;"><span style="font-weight: 600;">Pay Period:</span> ${invoiceData.startDate} to ${invoiceData.endDate}</div>
        <div><span style="font-weight: 600;">Invoice Number:</span> ${invoiceData.invoiceNumber}</div>
      </div>

      <!-- Work Summary -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 10px; color: black;">Work Summary:</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 9px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Day</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Date</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Description</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Location</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Ticket #</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Truck</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Kms</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Kms Rate</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Other</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Subsistence</th>
              <th style="border: 1px solid #ccc; padding: 6px; text-align: center; font-weight: bold;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${workedEntries.map((entry: any, index: number) => `
              <tr>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${entry.date}</td>
                <td style="border: 1px solid #ccc; padding: 6px;">${entry.description || invoiceData.clientName}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${entry.location || ''}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${entry.ticketNumber || ''}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">${entry.worked ? `$${(entry.truckRate || 0).toFixed(2)}` : '-'}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${entry.worked ? (entry.kmsDriven || 0) : '-'}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">${entry.worked ? `$${(entry.kmsRate || 0).toFixed(2)}` : '-'}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">${entry.worked ? `$${(entry.otherCharges || 0).toFixed(2)}` : '-'}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right;">${entry.worked ? `$${invoiceData.subsistence.toFixed(2)}` : '-'}</td>
                <td style="border: 1px solid #ccc; padding: 6px; text-align: right; font-weight: bold;">${entry.worked ? `$${(entry.dailyTotal || 0).toFixed(2)}` : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Summary Sections - Exact match to preview -->
      <div style="margin-bottom: 20px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>⊕ Total Truck Charges</span>
          <span>$${invoiceData.totalTruckCharges.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>⊕ Total Kms Charges</span>
          <span>$${invoiceData.totalKmsCharges.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>⊕ Total Other Charges</span>
          <span>$${invoiceData.totalOtherCharges.toFixed(2)}</span>
        </div>
      </div>

      <!-- Financial Summary - Exact match to preview -->
      <div style="margin-bottom: 20px;">
        <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 10px; color: black;">Financial Summary:</h3>
        <div style="font-size: 11px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; background-color: #f9fafb; padding: 4px; border-radius: 3px;">
            <span>⊖ Subtotal</span>
            <span>$${invoiceData.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; background-color: #f9fafb; padding: 4px; border-radius: 3px;">
            <span>% GST (5%)</span>
            <span>$${invoiceData.gst.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; background-color: #fef3c7; padding: 4px; border-radius: 3px; border: 1px solid #fde68a;">
            <span>⊕ Subsistence (Tax-Free)</span>
            <span>$${invoiceData.totalSubsistence.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Grand Total - Exact match to preview -->
      <div style="text-align: center; margin-top: 20px; border-top: 2px dashed #d1d5db; padding-top: 15px;">
        <div style="font-size: 18px; font-weight: bold; color: #059669;">
          $ Grand Total: $${invoiceData.grandTotal.toFixed(2)}
        </div>
      </div>
    </div>
  `;
}

// Helper function to create email HTML
function createInvoiceEmailHTML(invoiceData: any, email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #667eea; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>InvoicePatch</h1>
        <p>Your Professional Invoice</p>
      </div>
      <div class="content">
        <h2>Invoice ${invoiceData.invoiceNumber}</h2>
        <p>Dear ${email},</p>
        <p>Thank you for using InvoicePatch! Your invoice is attached as a PDF.</p>
        
        <h3>Invoice Summary:</h3>
        <ul>
          <li>Invoice Number: ${invoiceData.invoiceNumber}</li>
          <li>Period: ${invoiceData.startDate} to ${invoiceData.endDate}</li>
          <li>Total Amount: $${invoiceData.grandTotal.toFixed(2)}</li>
        </ul>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
      </div>
      <div class="footer">
        <p>This email was sent by InvoicePatch</p>
        <p>© 2024 InvoicePatch. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

// Helper function to store subscriber
async function storeSubscriber(email: string): Promise<void> {
  // For now, just log it. You can implement database storage later
  console.log(`📝 Subscriber stored: ${email}`);
} 