import { OTPSecurity } from './otp-security';
import RateLimiter from './rateLimiter';

export interface OTPResult {
  success: boolean;
  message: string;
  otpId?: string;
  attemptsRemaining?: number;
  cooldownRemaining?: number;
}

export type OTPPurpose = 'login' | 'trial_access' | 'password_reset' | 'account_verification';

export class OTPService {
  /**
   * Generate and send OTP with enhanced rate limiting
   */
  static async generateAndSendOTP(
    email: string,
    purpose: OTPPurpose,
    ipAddress: string,
    userAgent?: string
  ): Promise<OTPResult> {
    try {
      // Enhanced rate limiting check
      const rateLimitResult = await RateLimiter.recordOTPRequest(email, ipAddress);
      if (!rateLimitResult.allowed) {
        return {
          success: false,
          message: rateLimitResult.message || 'Rate limit exceeded. Please try again later.'
        };
      }

      // Use existing OTP security system
      const result = await OTPSecurity.generateAndSendOTP(email, purpose, ipAddress);

      if (result.success) {
        return {
          success: true,
          message: 'Verification code sent successfully',
          otpId: result.otpId
        };
      } else {
        return {
          success: false,
          message: result.error || 'Failed to send verification code',
          cooldownRemaining: result.cooldownRemaining
        };
      }

    } catch (error) {
      console.error('OTP Service - Generate error:', error);
      return {
        success: false,
        message: 'Failed to generate verification code'
      };
    }
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(
    email: string,
    code: string,
    purpose: OTPPurpose,
    ipAddress: string
  ): Promise<OTPResult> {
    try {
      // Use existing OTP security system
      const result = await OTPSecurity.verifyOTP(email, code, purpose, ipAddress);

      if (result.success) {
        return {
          success: true,
          message: 'Verification code verified successfully'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Invalid verification code',
          attemptsRemaining: result.attemptsRemaining
        };
      }

    } catch (error) {
      console.error('OTP Service - Verify error:', error);
      return {
        success: false,
        message: 'Failed to verify code'
      };
    }
  }

  /**
   * Request trial access OTP (convenience method)
   */
  static async requestTrialAccessOTP(
    email: string,
    ipAddress: string
  ): Promise<OTPResult> {
    try {
      const result = await OTPSecurity.requestTrialAccessOTP(email, ipAddress);

      return {
        success: result.success,
        message: result.message,
        otpId: result.otpId,
        cooldownRemaining: result.cooldownRemaining
      };

    } catch (error) {
      console.error('OTP Service - Trial access error:', error);
      return {
        success: false,
        message: 'Failed to send trial access code'
      };
    }
  }

  /**
   * Verify trial access OTP (convenience method)
   */
  static async verifyTrialAccessOTP(
    email: string,
    code: string,
    ipAddress: string
  ): Promise<OTPResult> {
    try {
      // Use the standard verifyOTP method with 'trial_access' purpose
      const result = await OTPSecurity.verifyOTP(email, code, 'trial_access', ipAddress);

      return {
        success: result.success,
        message: result.success ? 'Trial access verified successfully' : (result.error || 'Invalid verification code'),
        attemptsRemaining: result.attemptsRemaining
      };

    } catch (error) {
      console.error('OTP Service - Verify trial access error:', error);
      return {
        success: false,
        message: 'Failed to verify trial access code'
      };
    }
  }

  /**
   * Check if user can request a new OTP (cooldown check)
   */
  static async canRequestOTP(
    email: string,
    purpose: OTPPurpose
  ): Promise<{
    canRequest: boolean;
    cooldownRemaining?: number;
    message?: string;
  }> {
    try {
      // This would need to be implemented in the existing OTPSecurity class
      // For now, we'll do a basic rate limit check
      const rateLimitResult = await RateLimiter.getRateLimitStatus('otp_request', email);

      if (!rateLimitResult.allowed) {
        return {
          canRequest: false,
          message: 'Rate limit exceeded',
          cooldownRemaining: rateLimitResult.resetTime ? 
            Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / 60000) : undefined
        };
      }

      return {
        canRequest: true
      };

    } catch (error) {
      console.error('OTP Service - Can request check error:', error);
      return {
        canRequest: true // Fail open
      };
    }
  }

  /**
   * Clean up expired OTPs and rate limit records
   */
  static async cleanup(): Promise<void> {
    try {
      // Clean up rate limits
      await RateLimiter.cleanup();
      
      // The OTP cleanup is handled by the existing OTPSecurity class
      console.log('OTP Service cleanup completed');

    } catch (error) {
      console.error('OTP Service - Cleanup error:', error);
    }
  }

  /**
   * Get OTP statistics for monitoring
   */
  static async getOTPStats(
    email?: string,
    timeframe: 'hour' | 'day' | 'week' = 'day'
  ): Promise<{
    totalRequests: number;
    successfulVerifications: number;
    failedVerifications: number;
    rateLimitHits: number;
  }> {
    try {
      // This would require additional database queries
      // For now, return basic rate limit info
      const rateLimitResult = await RateLimiter.getRateLimitStatus('otp_request', email);

      return {
        totalRequests: rateLimitResult.requestCount || 0,
        successfulVerifications: 0, // Would need to track this
        failedVerifications: 0, // Would need to track this
        rateLimitHits: rateLimitResult.allowed ? 0 : 1
      };

    } catch (error) {
      console.error('OTP Service - Stats error:', error);
      return {
        totalRequests: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        rateLimitHits: 0
      };
    }
  }
}

export default OTPService; 