import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  email: string;
  invoiceData: {
    invoiceNumber: string;
    contractorName: string;
    clientName: string;
    period: string;
    entries: any[];
    totals: {
      subtotal: number;
      tax: number;
      total: number;
    };
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

    // Generate PDF buffer (modified version that returns buffer instead of downloading)
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

// Helper function to generate PDF as buffer
async function generateInvoicePDFBuffer(invoiceData: any): Promise<Buffer> {
  // Import jsPDF dynamically for server-side use
  const jsPDF = (await import('jspdf')).default;
  const doc = new jsPDF();
  
  // Add content (simplified version)
  doc.setFontSize(20);
  doc.text('INVOICE', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 20, 50);
  doc.text(`Total: $${invoiceData.totals.total.toFixed(2)}`, 20, 70);
  
  // Convert to buffer
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
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
          <li>Period: ${invoiceData.period}</li>
          <li>Total Amount: $${invoiceData.totals.total.toFixed(2)}</li>
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