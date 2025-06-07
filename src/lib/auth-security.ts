import { createClient } from '@supabase/supabase-js';
import { DataEncryption } from './encryption';
import { APISecurity } from './security';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SecurityEvent {
  type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'data_access';
  userId?: string;
  ip: string;
  userAgent: string;
  details?: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high';
}

export class AuthSecurity {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  
  // In production, use Redis or database
  private static loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
  private static activeSessions = new Map<string, { userId: string; lastActivity: number; ip: string }>();

  /**
   * Enhanced login with security monitoring
   */
  static async secureLogin(email: string, password: string, ip: string, userAgent: string): Promise<{
    success: boolean;
    user?: any;
    session?: any;
    error?: string;
    requiresMFA?: boolean;
  }> {
    const key = `login:${ip}:${email}`;
    
    // Check if account is locked
    const lockStatus = this.checkAccountLock(key);
    if (lockStatus.locked) {
      await this.logSecurityEvent({
        type: 'failed_login',
        ip,
        userAgent,
        details: { email, reason: 'account_locked' },
        risk_level: 'high'
      });
      
      return {
        success: false,
        error: `Account temporarily locked. Try again in ${Math.ceil(lockStatus.remainingTime! / 60000)} minutes.`
      };
    }

    try {
      // Attempt login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Record failed attempt
        this.recordFailedLogin(key);
        
        await this.logSecurityEvent({
          type: 'failed_login',
          ip,
          userAgent,
          details: { email, error: error.message },
          risk_level: 'medium'
        });

        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Success - clear failed attempts
      this.loginAttempts.delete(key);

      // Create secure session
      const sessionToken = DataEncryption.generateSecureToken();
      this.activeSessions.set(sessionToken, {
        userId: data.user!.id,
        lastActivity: Date.now(),
        ip
      });

      await this.logSecurityEvent({
        type: 'login',
        userId: data.user!.id,
        ip,
        userAgent,
        details: { email },
        risk_level: 'low'
      });

      return {
        success: true,
        user: data.user,
        session: data.session
      };

    } catch (error) {
      await this.logSecurityEvent({
        type: 'failed_login',
        ip,
        userAgent,
        details: { email, error: 'system_error' },
        risk_level: 'high'
      });

      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Enhanced signup with security validation
   */
  static async secureSignup(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }, ip: string, userAgent: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    // Validate password strength
    const passwordValidation = this.validatePasswordStrength(userData.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: passwordValidation.message
      };
    }

    // Check for suspicious patterns
    const suspiciousCheck = await this.checkSuspiciousActivity(ip, userAgent);
    if (suspiciousCheck.suspicious) {
      await this.logSecurityEvent({
        type: 'suspicious_activity',
        ip,
        userAgent,
        details: { email: userData.email, reason: suspiciousCheck.reason },
        risk_level: 'high'
      });

      return {
        success: false,
        error: 'Account creation temporarily unavailable. Please try again later.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            phone: userData.phone
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      await this.logSecurityEvent({
        type: 'login',
        userId: data.user?.id,
        ip,
        userAgent,
        details: { email: userData.email, action: 'signup' },
        risk_level: 'low'
      });

      return {
        success: true,
        user: data.user
      };

    } catch (error) {
      return {
        success: false,
        error: 'Account creation failed. Please try again.'
      };
    }
  }

  /**
   * Session validation and management
   */
  static async validateSession(sessionToken: string, ip: string): Promise<{
    valid: boolean;
    userId?: string;
    shouldRefresh?: boolean;
  }> {
    const session = this.activeSessions.get(sessionToken);
    
    if (!session) {
      return { valid: false };
    }

    const now = Date.now();
    const timeSinceLastActivity = now - session.lastActivity;

    // Check session timeout
    if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
      this.activeSessions.delete(sessionToken);
      return { valid: false };
    }

    // Check if IP changed (potential session hijacking)
    if (session.ip !== ip) {
      await this.logSecurityEvent({
        type: 'suspicious_activity',
        userId: session.userId,
        ip,
        userAgent: '',
        details: { reason: 'ip_change', originalIP: session.ip },
        risk_level: 'high'
      });

      this.activeSessions.delete(sessionToken);
      return { valid: false };
    }

    // Update last activity
    session.lastActivity = now;
    this.activeSessions.set(sessionToken, session);

    // Suggest refresh if session is more than 4 hours old
    const shouldRefresh = timeSinceLastActivity > (4 * 60 * 60 * 1000);

    return {
      valid: true,
      userId: session.userId,
      shouldRefresh
    };
  }

  /**
   * Password strength validation
   */
  private static validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
    }

    // Check against common passwords
    const commonPasswords = ['password', '123456', 'password123', 'admin', 'letmein'];
    if (commonPasswords.includes(password.toLowerCase())) {
      return { valid: false, message: 'Password is too common. Please choose a stronger password.' };
    }

    return { valid: true };
  }

  /**
   * Check for suspicious activity
   */
  private static async checkSuspiciousActivity(ip: string, userAgent: string): Promise<{
    suspicious: boolean;
    reason?: string;
  }> {
    // Check for rapid signups from same IP
    const recentSignups = Array.from(this.loginAttempts.entries())
      .filter(([key, data]) => key.includes(ip) && Date.now() - data.lastAttempt < 60000)
      .length;

    if (recentSignups > 3) {
      return { suspicious: true, reason: 'rapid_signups' };
    }

    // Check for suspicious user agents
    const suspiciousAgents = ['bot', 'crawler', 'spider', 'scraper'];
    if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
      return { suspicious: true, reason: 'suspicious_user_agent' };
    }

    return { suspicious: false };
  }

  /**
   * Record failed login attempt
   */
  private static recordFailedLogin(key: string): void {
    const now = Date.now();
    const existing = this.loginAttempts.get(key) || { count: 0, lastAttempt: 0 };

    existing.count += 1;
    existing.lastAttempt = now;

    if (existing.count >= this.MAX_LOGIN_ATTEMPTS) {
      existing.lockedUntil = now + this.LOCKOUT_DURATION;
    }

    this.loginAttempts.set(key, existing);
  }

  /**
   * Check account lock status
   */
  private static checkAccountLock(key: string): { locked: boolean; remainingTime?: number } {
    const existing = this.loginAttempts.get(key);
    
    if (!existing || !existing.lockedUntil) {
      return { locked: false };
    }

    const now = Date.now();
    const remainingTime = existing.lockedUntil - now;

    if (remainingTime <= 0) {
      // Lock expired, remove it
      this.loginAttempts.delete(key);
      return { locked: false };
    }

    return { locked: true, remainingTime };
  }

  /**
   * Log security events
   */
  private static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    await APISecurity.auditLog({
      action: `auth_${event.type}`,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      details: {
        ...event.details,
        risk_level: event.risk_level
      },
      success: event.type === 'login'
    });

    // In production, also send high-risk events to security monitoring
    if (event.risk_level === 'high') {
      console.warn('[SECURITY ALERT]', JSON.stringify(event));
      // await securityMonitoringService.alert(event);
    }
  }

  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions(): void {
    const now = Date.now();
    
    for (const [token, session] of this.activeSessions.entries()) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.activeSessions.delete(token);
      }
    }
  }
}

export default AuthSecurity; 