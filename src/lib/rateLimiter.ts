import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface RateLimitResult {
  allowed: boolean;
  message?: string;
  resetTime?: Date;
  requestCount?: number;
  limit?: number;
}

export interface RateLimitConfig {
  windowMinutes: number;
  maxRequests: number;
}

export class RateLimiter {
  private static readonly DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
    otp_request: { windowMinutes: 60, maxRequests: 10 },
    login_attempt: { windowMinutes: 15, maxRequests: 5 },
    api_call: { windowMinutes: 15, maxRequests: 100 },
    password_reset: { windowMinutes: 60, maxRequests: 3 }
  };

  /**
   * Record an OTP request and check rate limits
   */
  static async recordOTPRequest(
    email: string,
    ipAddress?: string
  ): Promise<RateLimitResult> {
    return this.checkAndRecordAction('otp_request', email, ipAddress);
  }

  /**
   * Record a login attempt and check rate limits
   */
  static async recordLoginAttempt(
    email: string,
    ipAddress?: string
  ): Promise<RateLimitResult> {
    return this.checkAndRecordAction('login_attempt', email, ipAddress);
  }

  /**
   * Record an API call and check rate limits
   */
  static async recordAPICall(
    identifier: string,
    ipAddress?: string
  ): Promise<RateLimitResult> {
    return this.checkAndRecordAction('api_call', identifier, ipAddress);
  }

  /**
   * Record a password reset request and check rate limits
   */
  static async recordPasswordReset(
    email: string,
    ipAddress?: string
  ): Promise<RateLimitResult> {
    return this.checkAndRecordAction('password_reset', email, ipAddress);
  }

  /**
   * Generic method to check and record any action
   */
  private static async checkAndRecordAction(
    actionType: string,
    identifier?: string,
    ipAddress?: string,
    customConfig?: RateLimitConfig
  ): Promise<RateLimitResult> {
    try {
      const config = customConfig || this.DEFAULT_CONFIGS[actionType];
      if (!config) {
        throw new Error(`No rate limit configuration found for action: ${actionType}`);
      }

      const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

      // Check current rate limit status
      const { data: existingRecords, error: fetchError } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('action_type', actionType)
        .gte('window_start', windowStart.toISOString())
        .or(
          identifier ? `email.eq.${identifier}` : 'email.is.null',
          ipAddress ? `,ip_address.eq.${ipAddress}` : ''
        );

      if (fetchError) {
        console.error('Rate limit fetch error:', fetchError);
        // Allow the request if we can't check (fail open)
        return { allowed: true };
      }

      // Calculate total requests in the current window
      const totalRequests = existingRecords?.reduce((sum, record) => sum + record.request_count, 0) || 0;

      if (totalRequests >= config.maxRequests) {
        const resetTime = new Date(Date.now() + config.windowMinutes * 60 * 1000);
        return {
          allowed: false,
          message: `Rate limit exceeded. Try again in ${config.windowMinutes} minutes.`,
          resetTime,
          requestCount: totalRequests,
          limit: config.maxRequests
        };
      }

      // Record this request
      await this.recordRequest(actionType, identifier, ipAddress);

      return {
        allowed: true,
        requestCount: totalRequests + 1,
        limit: config.maxRequests
      };

    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow the request if there's an error
      return { allowed: true };
    }
  }

  /**
   * Record a request in the rate_limits table
   */
  private static async recordRequest(
    actionType: string,
    identifier?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() - (now.getTime() % (60 * 1000))); // Round to nearest minute

      // Try to find existing record for this minute window
      const { data: existingRecord, error: fetchError } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('action_type', actionType)
        .eq('window_start', windowStart.toISOString())
        .eq('email', identifier || null)
        .eq('ip_address', ipAddress || null)
        .single();

      if (existingRecord && !fetchError) {
        // Update existing record
        await supabase
          .from('rate_limits')
          .update({
            request_count: existingRecord.request_count + 1,
            updated_at: now.toISOString()
          })
          .eq('id', existingRecord.id);
      } else {
        // Create new record
        await supabase
          .from('rate_limits')
          .insert({
            email: identifier || null,
            ip_address: ipAddress || null,
            action_type: actionType,
            window_start: windowStart.toISOString(),
            request_count: 1
          });
      }
    } catch (error) {
      console.error('Error recording rate limit:', error);
      // Don't throw - this is a background operation
    }
  }

  /**
   * Get current rate limit status for an action
   */
  static async getRateLimitStatus(
    actionType: string,
    identifier?: string,
    ipAddress?: string
  ): Promise<RateLimitResult> {
    try {
      const config = this.DEFAULT_CONFIGS[actionType];
      if (!config) {
        return { allowed: true };
      }

      const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

      const { data: records, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('action_type', actionType)
        .gte('window_start', windowStart.toISOString())
        .or(
          identifier ? `email.eq.${identifier}` : 'email.is.null',
          ipAddress ? `,ip_address.eq.${ipAddress}` : ''
        );

      if (error) {
        console.error('Rate limit status error:', error);
        return { allowed: true };
      }

      const totalRequests = records?.reduce((sum, record) => sum + record.request_count, 0) || 0;
      const allowed = totalRequests < config.maxRequests;

      return {
        allowed,
        requestCount: totalRequests,
        limit: config.maxRequests,
        resetTime: allowed ? undefined : new Date(Date.now() + config.windowMinutes * 60 * 1000)
      };

    } catch (error) {
      console.error('Rate limit status check error:', error);
      return { allowed: true };
    }
  }

  /**
   * Clean up old rate limit records
   */
  static async cleanup(): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

      await supabase
        .from('rate_limits')
        .delete()
        .lt('created_at', cutoffTime.toISOString());

    } catch (error) {
      console.error('Rate limit cleanup error:', error);
    }
  }

  /**
   * Reset rate limits for a specific identifier (admin function)
   */
  static async resetRateLimit(
    actionType: string,
    identifier?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      let query = supabase
        .from('rate_limits')
        .delete()
        .eq('action_type', actionType);

      if (identifier) {
        query = query.eq('email', identifier);
      }

      if (ipAddress) {
        query = query.eq('ip_address', ipAddress);
      }

      await query;

    } catch (error) {
      console.error('Rate limit reset error:', error);
    }
  }
}

export default RateLimiter; 