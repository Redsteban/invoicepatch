/**
 * Environment Security Configuration
 * Validates and manages secure environment variables
 */

interface SecurityEnvironment {
  NODE_ENV: string;
  NEXT_PUBLIC_BASE_URL: string;
  ENCRYPTION_KEY: string;
  SESSION_SECRET: string;
  SUPABASE_JWT_SECRET: string;
  // Add other security-critical env vars
}

class EnvironmentSecurity {
  private static instance: EnvironmentSecurity;
  private secureEnv: Partial<SecurityEnvironment> = {};
  
  private constructor() {
    this.validateEnvironment();
  }

  static getInstance(): EnvironmentSecurity {
    if (!EnvironmentSecurity.instance) {
      EnvironmentSecurity.instance = new EnvironmentSecurity();
    }
    return EnvironmentSecurity.instance;
  }

  /**
   * Validate critical environment variables on startup
   */
  private validateEnvironment(): void {
    const errors: string[] = [];

    // Check for required environment variables
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_BASE_URL'
    ];

    required.forEach(envVar => {
      if (!process.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    });

    // Validate environment-specific requirements
    if (process.env.NODE_ENV === 'production') {
      this.validateProductionEnvironment(errors);
    }

    // Generate or validate encryption keys
    this.validateEncryptionKeys(errors);

    if (errors.length > 0) {
      console.error('[SECURITY ERROR] Environment validation failed:');
      errors.forEach(error => console.error(`  - ${error}`));
      
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment security validation failed in production');
      }
    }
  }

  /**
   * Production-specific environment validation
   */
  private validateProductionEnvironment(errors: string[]): void {
    // Ensure HTTPS is enforced
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl && !baseUrl.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_BASE_URL must use HTTPS in production');
    }

    // Check for secure session configuration
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
      errors.push('SESSION_SECRET must be at least 32 characters in production');
    }

    // Validate database security
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
      errors.push('Supabase URL must use HTTPS in production');
    }

    // Check for debug flags that should be disabled
    if (process.env.DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === 'true') {
      errors.push('Debug mode should be disabled in production');
    }
  }

  /**
   * Validate and generate encryption keys
   */
  private validateEncryptionKeys(errors: string[]): void {
    if (!process.env.ENCRYPTION_KEY) {
      // Generate a secure encryption key for development
      if (process.env.NODE_ENV !== 'production') {
        const crypto = require('crypto');
        process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
        console.warn('[SECURITY WARNING] Generated temporary encryption key for development');
      } else {
        errors.push('ENCRYPTION_KEY is required in production');
      }
    } else {
      // Validate encryption key format
      const key = process.env.ENCRYPTION_KEY;
      if (key.length < 64) { // 32 bytes = 64 hex characters
        errors.push('ENCRYPTION_KEY must be at least 32 bytes (64 hex characters)');
      }
    }
  }

  /**
   * Get secure environment variable
   */
  getSecureEnv(key: keyof SecurityEnvironment): string | undefined {
    return process.env[key];
  }

  /**
   * Check if environment is secure for production
   */
  isProductionReady(): boolean {
    try {
      this.validateEnvironment();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Security configuration for different environments
   */
  getSecurityConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';

    return {
      // Session configuration
      session: {
        secure: isProduction, // Only send cookies over HTTPS in production
        httpOnly: true,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/'
      },

      // Rate limiting
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: isProduction ? 100 : 1000, // Stricter in production
        skipSuccessfulRequests: false,
        skipFailedRequests: false
      },

      // CORS
      cors: {
        origin: isProduction 
          ? [process.env.NEXT_PUBLIC_BASE_URL!]
          : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
      },

      // Logging
      logging: {
        level: isProduction ? 'warn' : 'debug',
        auditLog: isProduction,
        errorReporting: isProduction,
        sensitiveDataMasking: true
      },

      // Security headers
      headers: {
        contentSecurityPolicy: this.getCSPPolicy(),
        strictTransportSecurity: isProduction,
        frameOptions: 'DENY',
        contentTypeOptions: 'nosniff',
        referrerPolicy: 'strict-origin-when-cross-origin'
      }
    };
  }

  /**
   * Generate Content Security Policy based on environment
   */
  private getCSPPolicy(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    
    const policy = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        ...(isProduction ? [] : ["'unsafe-inline'", "'unsafe-eval'"]),
        'https://js.stripe.com',
        'https://va.vercel-scripts.com'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for CSS-in-JS
        'https://fonts.googleapis.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:'
      ],
      'connect-src': [
        "'self'",
        'https://*.supabase.co',
        'https://api.stripe.com',
        'https://vitals.vercel-insights.com'
      ],
      'frame-src': [
        'https://js.stripe.com'
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    };

    return Object.entries(policy)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }
}

// Security checklist for deployment
export const SECURITY_CHECKLIST = {
  environment: [
    'HTTPS enforced in production',
    'Secure environment variables set',
    'Debug mode disabled',
    'Error reporting configured',
    'Session secrets generated'
  ],
  
  database: [
    'Row Level Security (RLS) enabled',
    'Database backups configured',
    'Connection encryption enabled',
    'Audit logging enabled',
    'Access controls implemented'
  ],
  
  application: [
    'Rate limiting configured',
    'Input validation implemented',
    'CSRF protection enabled',
    'XSS protection enabled',
    'Security headers configured'
  ],
  
  monitoring: [
    'Security event logging',
    'Performance monitoring',
    'Error tracking',
    'Audit trail implementation',
    'Alerting configured'
  ]
};

export default EnvironmentSecurity.getInstance(); 