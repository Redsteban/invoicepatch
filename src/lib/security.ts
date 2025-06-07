import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { PIIProtection } from './encryption';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

interface SecurityConfig {
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  slowDownWindowMs: number;
  slowDownDelayAfter: number;
  maxDelayMs: number;
  maxRequestSize: number; // in bytes
}

const defaultConfig: SecurityConfig = {
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100, // limit each IP to 100 requests per windowMs
  slowDownWindowMs: 15 * 60 * 1000, // 15 minutes
  slowDownDelayAfter: 50, // allow 50 requests per 15 minutes at full speed
  maxDelayMs: 20000, // maximum delay of 20 seconds
  maxRequestSize: 10 * 1024 * 1024 // 10MB max request size
};

export class APISecurity {
  private static config: SecurityConfig = defaultConfig;

  /**
   * Rate limiting middleware
   */
  static async rateLimit(request: NextRequest, config?: Partial<SecurityConfig>): Promise<NextResponse | null> {
    const mergedConfig = { ...this.config, ...config };
    const ip = this.getClientIP(request);
    const key = `rate_limit:${ip}`;
    
    const now = Date.now();
    const windowStart = now - mergedConfig.rateLimitWindowMs;
    
    // Get existing requests for this IP
    const requests = rateLimitStore.get(key) || [];
    
    // Filter out old requests
    const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    // Check if limit exceeded
    if (recentRequests.length >= mergedConfig.rateLimitMaxRequests) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(mergedConfig.rateLimitWindowMs / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(mergedConfig.rateLimitWindowMs / 1000).toString(),
            'X-RateLimit-Limit': mergedConfig.rateLimitMaxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (now + mergedConfig.rateLimitWindowMs).toString()
          }
        }
      );
    }
    
    // Add current request
    recentRequests.push(now);
    rateLimitStore.set(key, recentRequests);
    
    return null; // Continue processing
  }

  /**
   * Input validation and sanitization
   */
  static validateAndSanitize<T>(data: unknown, schema: z.ZodSchema<T>): { 
    success: boolean; 
    data?: T; 
    error?: string; 
  } {
    try {
      // Sanitize string fields
      const sanitized = this.sanitizeObject(data);
      
      // Validate with Zod schema
      const result = schema.safeParse(sanitized);
      
      if (!result.success) {
        const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return {
          success: false,
          error: `Validation failed: ${errors.join(', ')}`
        };
      }
      
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid input data'
      };
    }
  }

  /**
   * Sanitize object recursively
   */
  private static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj.trim());
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeObject(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  }

  /**
   * CSRF Protection
   */
  static async validateCSRF(request: NextRequest): Promise<boolean> {
    const token = request.headers.get('x-csrf-token');
    const sessionToken = request.headers.get('authorization');
    
    if (!token || !sessionToken) {
      return false;
    }
    
    // Validate CSRF token (implement based on your session management)
    // This is a simplified version - use proper CSRF token validation
    return token.length > 0 && sessionToken.length > 0;
  }

  /**
   * SQL Injection Prevention
   */
  static sanitizeForSQL(input: string): string {
    // Basic SQL injection prevention
    return input
      .replace(/['"\\;]/g, '') // Remove dangerous characters
      .replace(/(\b(ALTER|CREATE|DELETE|DROP|EXEC|EXECUTE|INSERT|SELECT|UNION|UPDATE)\b)/gi, '') // Remove SQL keywords
      .trim();
  }

  /**
   * XSS Prevention
   */
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
  }

  /**
   * Get client IP address
   */
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || cfConnectingIP || 'unknown';
  }

  /**
   * Request size validation
   */
  static async validateRequestSize(request: NextRequest): Promise<boolean> {
    const contentLength = request.headers.get('content-length');
    
    if (!contentLength) {
      return true; // Allow requests without content-length
    }
    
    const size = parseInt(contentLength, 10);
    return size <= this.config.maxRequestSize;
  }

  /**
   * Security headers for responses
   */
  static addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    
    // Remove sensitive headers
    response.headers.delete('X-Powered-By');
    response.headers.delete('Server');
    
    return response;
  }

  /**
   * Audit logging with PII protection
   */
  static async auditLog(event: {
    action: string;
    userId?: string;
    ip: string;
    userAgent: string;
    details?: Record<string, any>;
    success: boolean;
    timestamp?: Date;
  }): Promise<void> {
    const sanitizedEvent = {
      ...event,
      timestamp: event.timestamp || new Date(),
      details: event.details ? this.sanitizeAuditDetails(event.details) : undefined,
      userAgent: PIIProtection.scrubPII(event.userAgent)
    };
    
    // Log to your preferred logging service (e.g., Winston, Pino, etc.)
    console.log('[AUDIT]', JSON.stringify(sanitizedEvent));
    
    // In production, send to centralized logging service
    // await logService.log(sanitizedEvent);
  }

  /**
   * Sanitize audit details to remove sensitive information
   */
  private static sanitizeAuditDetails(details: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(details)) {
      // Don't log sensitive financial data or PII
      if (['password', 'dayRate', 'hourlyRate', 'totalEarned', 'phone', 'email'].includes(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = PIIProtection.scrubPII(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

/**
 * Validation schemas for common endpoints
 */
export const ValidationSchemas = {
  contractorSetup: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[\d\s\-\(\)\+]{10,15}$/),
    company: z.string().min(2).max(100),
    invoiceSequence: z.string().min(1).max(20),
    dayRate: z.number().min(0).max(10000).optional(),
    hourlyRate: z.number().min(0).max(500).optional(),
    truckRate: z.number().min(0).max(1000),
    travelKms: z.number().min(0).max(2000),
    subsistence: z.number().min(0).max(500),
    location: z.string().min(2).max(100),
    rateType: z.enum(['daily', 'hourly']),
    useCustomStartDate: z.boolean(),
    customStartDate: z.string().optional()
  }),

  trialAccess: z.object({
    email: z.string().email()
  }),

  workEntry: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    worked: z.boolean(),
    hours: z.number().min(0).max(24).optional(),
    notes: z.string().max(500).optional()
  })
};

export default APISecurity; 