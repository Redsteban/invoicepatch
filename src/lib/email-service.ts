import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create email transporter based on environment variables
function createTransporter() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'hostinger';
  
  if (emailProvider === 'sendgrid') {
    // SendGrid SMTP
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (emailProvider === 'gmail') {
    // Gmail SMTP
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else if (emailProvider === 'hostinger') {
    // Hostinger SMTP
    return nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Custom SMTP
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
}

export class EmailService {
  private static transporter = createTransporter();

  static async sendEmail(options: EmailOptions): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Check if email is configured
      if (!process.env.EMAIL_FROM || !process.env.SMTP_USER) {
        console.log('📧 Email not configured, would send:', options.subject, 'to', options.to);
        return {
          success: true,
          message: 'Email sent (development mode - not actually sent)'
        };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);

      return {
        success: true,
        message: 'Email sent successfully'
      };

    } catch (error: any) {
      console.error('❌ Email sending failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async sendOTP(email: string, otp: string, type: 'signup' | 'password_reset' = 'signup'): Promise<{ success: boolean; message?: string; error?: string }> {
    const isPasswordReset = type === 'password_reset';
    
    const subject = isPasswordReset 
      ? 'Reset Your InvoicePatch Password'
      : 'Your InvoicePatch Verification Code';

    const text = isPasswordReset
      ? `Your password reset verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
      : `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${isPasswordReset ? 'Reset Your Password' : 'Verify Your Email'}</h2>
        <p>Hello,</p>
        <p>${isPasswordReset ? 'You requested to reset your password.' : 'Thank you for signing up!'}</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0; color: #333;">Your verification code is:</h3>
          <h1 style="font-size: 32px; letter-spacing: 8px; color: #2563eb; margin: 10px 0;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        ${isPasswordReset ? '<p style="color: #666; font-size: 14px;">If you didn\'t request this, please ignore this email.</p>' : ''}
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">InvoicePatch - Professional Invoice Management</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      text,
      html
    });
  }

  static async sendWelcomeEmail(email: string, username: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const subject = 'Welcome to InvoicePatch!';
    
    const text = `Welcome to InvoicePatch, ${username}!\n\nYour account has been created successfully. You can now start managing your invoices professionally.\n\nBest regards,\nThe InvoicePatch Team`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to InvoicePatch!</h2>
        <p>Hello ${username},</p>
        <p>Your account has been created successfully! 🎉</p>
        <p>You can now start managing your invoices professionally with our powerful tools.</p>
        <div style="background: #2563eb; color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin: 0;">Get Started</h3>
          <p style="margin: 10px 0;">Log in to your dashboard and create your first invoice!</p>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">InvoicePatch - Professional Invoice Management</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      text,
      html
    });
  }
} 