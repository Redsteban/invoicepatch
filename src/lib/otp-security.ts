import { createClient } from '@supabase/supabase-js';
import { DataEncryption } from './encryption';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface OTPConfig {
  length: number;
  expiryMinutes: number;
  maxAttempts: number;
  resendCooldownMinutes: number;
}

interface OTPRecord {
  id: string;
  email: string;
  code: string;
  purpose: 'login' | 'trial_access' | 'password_reset' | 'account_verification';
  expires_at: string;
  attempts: number;
  created_at: string;
  verified: boolean;
  ip_address: string;
}

export class OTPSecurity {
  private static readonly DEFAULT_CONFIG: OTPConfig = {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
    resendCooldownMinutes: 2
  };

  /**
   * Generate and send OTP code
   */
  static async generateAndSendOTP(
    email: string,
    purpose: OTPRecord['purpose'],
    ip: string,
    config: Partial<OTPConfig> = {}
  ): Promise<{
    success: boolean;
    otpId?: string;
    error?: string;
    cooldownRemaining?: number;
  }> {
    const mergedConfig = { ...this.DEFAULT_CONFIG, ...config };

    try {
      // Check cooldown period
      const cooldownCheck = await this.checkResendCooldown(email, purpose);
      if (!cooldownCheck.canSend) {
        return {
          success: false,
          error: `Please wait ${cooldownCheck.remainingMinutes} minutes before requesting another code`,
          cooldownRemaining: cooldownCheck.remainingMinutes
        };
      }

      // Check for too many recent attempts
      const recentAttempts = await this.getRecentOTPAttempts(email, ip);
      if (recentAttempts >= 10) { // Max 10 OTP requests per hour per email/IP
        return {
          success: false,
          error: 'Too many OTP requests. Please try again in 1 hour.'
        };
      }

      // Generate secure OTP code
      const code = this.generateSecureOTP(mergedConfig.length);
      const expiresAt = new Date(Date.now() + mergedConfig.expiryMinutes * 60 * 1000);

      // Store OTP in database (you'll need to create this table)
      const { data: otpRecord, error: dbError } = await supabase
        .from('otp_codes')
        .insert({
          email: email.toLowerCase(),
          code: DataEncryption.hash(code), // Store hashed version
          purpose,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          verified: false,
          ip_address: ip
        })
        .select()
        .single();

      if (dbError) {
        console.error('OTP database error:', dbError);
        return {
          success: false,
          error: 'Failed to generate verification code'
        };
      }

      // Send OTP via email
      const emailSent = await this.sendOTPEmail(email, code, purpose, mergedConfig.expiryMinutes);
      
      if (!emailSent) {
        // Clean up if email failed
        await supabase.from('otp_codes').delete().eq('id', otpRecord.id);
        return {
          success: false,
          error: 'Failed to send verification code'
        };
      }

      return {
        success: true,
        otpId: otpRecord.id
      };

    } catch (error) {
      console.error('OTP generation error:', error);
      return {
        success: false,
        error: 'Failed to generate verification code'
      };
    }
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(
    email: string,
    code: string,
    purpose: OTPRecord['purpose'],
    ip: string
  ): Promise<{
    success: boolean;
    error?: string;
    attemptsRemaining?: number;
  }> {
    try {
      // Get the most recent valid OTP for this email and purpose
      const { data: otpRecord, error: fetchError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('purpose', purpose)
        .eq('verified', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpRecord) {
        return {
          success: false,
          error: 'Invalid or expired verification code'
        };
      }

      // Check attempts limit
      if (otpRecord.attempts >= this.DEFAULT_CONFIG.maxAttempts) {
        // Mark as used up
        await supabase
          .from('otp_codes')
          .update({ verified: true }) // Mark as used to prevent further attempts
          .eq('id', otpRecord.id);

        return {
          success: false,
          error: 'Too many invalid attempts. Please request a new code.'
        };
      }

      // Verify the code
      const hashedInputCode = DataEncryption.hash(code);
      const isValid = hashedInputCode === otpRecord.code;

      if (isValid) {
        // Mark as verified
        await supabase
          .from('otp_codes')
          .update({ 
            verified: true,
            verified_at: new Date().toISOString(),
            verified_ip: ip
          })
          .eq('id', otpRecord.id);

        // Clean up old OTP codes for this email
        await this.cleanupOldOTPs(email);

        return { success: true };
      } else {
        // Increment attempts
        await supabase
          .from('otp_codes')
          .update({ attempts: otpRecord.attempts + 1 })
          .eq('id', otpRecord.id);

        const attemptsRemaining = this.DEFAULT_CONFIG.maxAttempts - (otpRecord.attempts + 1);

        return {
          success: false,
          error: `Invalid verification code. ${attemptsRemaining} attempts remaining.`,
          attemptsRemaining
        };
      }

    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: 'Failed to verify code'
      };
    }
  }

  /**
   * Generate secure numeric OTP
   */
  private static generateSecureOTP(length: number): string {
    const digits = '0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomByte = crypto.randomBytes(1)[0];
      result += digits[randomByte % digits.length];
    }
    
    return result;
  }

  /**
   * Send OTP via email (simplified - use your email service)
   */
  private static async sendOTPEmail(
    email: string,
    code: string,
    purpose: string,
    expiryMinutes: number
  ): Promise<boolean> {
    try {
      // This is a simplified implementation
      // In production, use services like SendGrid, Mailgun, or AWS SES
      
      const emailContent = this.getEmailTemplate(code, purpose, expiryMinutes);
      
      // For development, just log the code
      if (process.env.NODE_ENV === 'development') {
        console.log(`[OTP] ${email}: ${code} (${purpose})`);
        return true;
      }

      // In production, implement actual email sending
      // const emailService = new EmailService();
      // return await emailService.send(email, emailContent);
      
      return true; // Placeholder
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  /**
   * Email template for OTP
   */
  private static getEmailTemplate(code: string, purpose: string, expiryMinutes: number): {
    subject: string;
    html: string;
    text: string;
  } {
    const purposeText = {
      login: 'sign in to your account',
      trial_access: 'access your trial',
      password_reset: 'reset your password',
      account_verification: 'verify your account'
    }[purpose];

    const subject = `InvoicePatch Security Code: ${code}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">InvoicePatch Security Code</h2>
        <p>Your verification code to ${purposeText} is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${code}</span>
        </div>
        <p><strong>This code expires in ${expiryMinutes} minutes.</strong></p>
        <p>If you didn't request this code, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          InvoicePatch Security Team<br>
          This is an automated message, please do not reply.
        </p>
      </div>
    `;

    const text = `
      InvoicePatch Security Code: ${code}
      
      Your verification code to ${purposeText} is: ${code}
      
      This code expires in ${expiryMinutes} minutes.
      
      If you didn't request this code, please ignore this email.
    `;

    return { subject, html, text };
  }

  /**
   * Check resend cooldown
   */
  private static async checkResendCooldown(
    email: string,
    purpose: string
  ): Promise<{ canSend: boolean; remainingMinutes?: number }> {
    const cooldownTime = new Date(Date.now() - this.DEFAULT_CONFIG.resendCooldownMinutes * 60 * 1000);

    const { data: recentOTP } = await supabase
      .from('otp_codes')
      .select('created_at')
      .eq('email', email.toLowerCase())
      .eq('purpose', purpose)
      .gte('created_at', cooldownTime.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!recentOTP) {
      return { canSend: true };
    }

    const timeSinceLastOTP = Date.now() - new Date(recentOTP.created_at).getTime();
    const cooldownMs = this.DEFAULT_CONFIG.resendCooldownMinutes * 60 * 1000;

    if (timeSinceLastOTP < cooldownMs) {
      const remainingMs = cooldownMs - timeSinceLastOTP;
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      
      return { 
        canSend: false, 
        remainingMinutes 
      };
    }

    return { canSend: true };
  }

  /**
   * Get recent OTP attempts for rate limiting
   */
  private static async getRecentOTPAttempts(email: string, ip: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const { data: attempts } = await supabase
      .from('otp_codes')
      .select('id')
      .or(`email.eq.${email.toLowerCase()},ip_address.eq.${ip}`)
      .gte('created_at', oneHourAgo.toISOString());

    return attempts?.length || 0;
  }

  /**
   * Clean up old OTP codes
   */
  private static async cleanupOldOTPs(email: string): Promise<void> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await supabase
      .from('otp_codes')
      .delete()
      .eq('email', email.toLowerCase())
      .lt('created_at', twentyFourHoursAgo.toISOString());
  }

  /**
   * Enhanced trial access with OTP
   */
  static async requestTrialAccessOTP(email: string, ip: string): Promise<{
    success: boolean;
    message: string;
    otpId?: string;
    cooldownRemaining?: number;
  }> {
    // First check if trial exists
    const { data: trial } = await supabase
      .from('trial_invoices')
      .select('id, contractor_name, company')
      .eq('contractor_email', email.toLowerCase())
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!trial) {
      return {
        success: false,
        message: 'No active trial found for this email address.'
      };
    }

    // Generate OTP for trial access
    const otpResult = await this.generateAndSendOTP(email, 'trial_access', ip);
    
    if (otpResult.success) {
      return {
        success: true,
        message: `We've sent a 6-digit verification code to ${email}. Please check your inbox.`,
        otpId: otpResult.otpId
      };
    } else {
      return {
        success: false,
        message: otpResult.error || 'Failed to send verification code',
        cooldownRemaining: otpResult.cooldownRemaining
      };
    }
  }
}

export default OTPSecurity; 