import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { APISecurity, ValidationSchemas } from './security';
import { AuthSecurity } from './auth-security';
import { PIIProtection } from './encryption';

interface SecureApiOptions {
  requireAuth?: boolean;
  rateLimitConfig?: {
    windowMs: number;
    maxRequests: number;
  };
  validationSchema?: z.ZodSchema<any>;
  allowedMethods?: string[];
  corsEnabled?: boolean;
}

interface SecureApiContext {
  request: NextRequest;
  ip: string;
  userAgent: string;
  userId?: string;
  validatedData?: any;
}

type SecureApiHandler = (
  context: SecureApiContext
) => Promise<NextResponse> | NextResponse;

/**
 * Secure API wrapper that applies multiple security layers
 */
export function createSecureApi(
  handler: SecureApiHandler,
  options: SecureApiOptions = {}
) {
  return async function secureApiRoute(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();
    let response: NextResponse;
    let success = false;
    
    try {
      // 1. Extract request information
      const ip = getClientIP(request);
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const method = request.method;

      // 2. Method validation
      if (options.allowedMethods && !options.allowedMethods.includes(method)) {
        return createErrorResponse('Method not allowed', 405);
      }

      // 3. Request size validation
      const validSize = await APISecurity.validateRequestSize(request);
      if (!validSize) {
        await APISecurity.auditLog({
          action: 'request_too_large',
          ip,
          userAgent,
          success: false
        });
        return createErrorResponse('Request too large', 413);
      }

      // 4. Rate limiting
      if (options.rateLimitConfig) {
        const rateLimitResult = await APISecurity.rateLimit(request, options.rateLimitConfig);
        if (rateLimitResult) {
          return rateLimitResult;
        }
      }

      // 5. CSRF protection for state-changing operations
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const csrfValid = await APISecurity.validateCSRF(request);
        if (!csrfValid && process.env.NODE_ENV === 'production') {
          await APISecurity.auditLog({
            action: 'csrf_validation_failed',
            ip,
            userAgent,
            success: false
          });
          return createErrorResponse('CSRF validation failed', 403);
        }
      }

      // 6. Authentication validation
      let userId: string | undefined;
      if (options.requireAuth) {
        const authHeader = request.headers.get('authorization');
        const sessionToken = authHeader?.replace('Bearer ', '');
        
        if (!sessionToken) {
          return createErrorResponse('Authentication required', 401);
        }

        const sessionValidation = await AuthSecurity.validateSession(sessionToken, ip);
        if (!sessionValidation.valid) {
          await APISecurity.auditLog({
            action: 'invalid_session',
            ip,
            userAgent,
            success: false
          });
          return createErrorResponse('Invalid or expired session', 401);
        }

        userId = sessionValidation.userId;
      }

      // 7. Input validation and sanitization
      let validatedData: any;
      if (options.validationSchema && ['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          const body = await request.json();
          const validation = APISecurity.validateAndSanitize(body, options.validationSchema);
          
          if (!validation.success) {
            await APISecurity.auditLog({
              action: 'validation_failed',
              userId,
              ip,
              userAgent,
              details: { error: validation.error },
              success: false
            });
            return createErrorResponse(validation.error!, 400);
          }
          
          validatedData = validation.data;
        } catch (error) {
          return createErrorResponse('Invalid JSON payload', 400);
        }
      }

      // 8. Create secure context
      const context: SecureApiContext = {
        request,
        ip,
        userAgent,
        userId,
        validatedData
      };

      // 9. Execute the handler
      response = await handler(context);
      success = true;

      // 10. Add security headers
      response = APISecurity.addSecurityHeaders(response);

      // 11. CORS handling
      if (options.corsEnabled) {
        response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BASE_URL || '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
      }

    } catch (error: any) {
      console.error('[SECURE API ERROR]', PIIProtection.scrubPII(error.message));
      
      await APISecurity.auditLog({
        action: 'api_error',
        userId: userId,
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { 
          error: PIIProtection.scrubPII(error.message),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        success: false
      });

      response = createErrorResponse(
        process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Internal server error',
        500
      );
    }

    // 12. Performance and audit logging
    const duration = Date.now() - startTime;
    
    if (duration > 5000) { // Log slow requests (>5 seconds)
      await APISecurity.auditLog({
        action: 'slow_request',
        userId,
        ip: getClientIP(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        details: { duration, endpoint: request.url },
        success
      });
    }

    return response;
  };
}

/**
 * Pre-configured secure API creators for common use cases
 */
export const SecureAPI = {
  // Public endpoint with rate limiting
  public: (handler: SecureApiHandler, validationSchema?: z.ZodSchema<any>) =>
    createSecureApi(handler, {
      requireAuth: false,
      rateLimitConfig: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
      validationSchema,
      allowedMethods: ['GET', 'POST'],
      corsEnabled: true
    }),

  // Protected endpoint requiring authentication
  protected: (handler: SecureApiHandler, validationSchema?: z.ZodSchema<any>) =>
    createSecureApi(handler, {
      requireAuth: true,
      rateLimitConfig: { windowMs: 15 * 60 * 1000, maxRequests: 200 },
      validationSchema,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      corsEnabled: true
    }),

  // High-security endpoint for sensitive operations
  highSecurity: (handler: SecureApiHandler, validationSchema?: z.ZodSchema<any>) =>
    createSecureApi(handler, {
      requireAuth: true,
      rateLimitConfig: { windowMs: 15 * 60 * 1000, maxRequests: 50 },
      validationSchema,
      allowedMethods: ['POST', 'PUT'],
      corsEnabled: false
    }),

  // Admin-only endpoint
  admin: (handler: SecureApiHandler, validationSchema?: z.ZodSchema<any>) =>
    createSecureApi(handler, {
      requireAuth: true,
      rateLimitConfig: { windowMs: 15 * 60 * 1000, maxRequests: 30 },
      validationSchema,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      corsEnabled: false
    })
};

/**
 * Helper functions
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || cfConnectingIP || 'unknown';
}

function createErrorResponse(message: string, status: number): NextResponse {
  const response = NextResponse.json(
    { 
      success: false, 
      error: message,
      timestamp: new Date().toISOString()
    },
    { status }
  );
  
  return APISecurity.addSecurityHeaders(response);
}

export default SecureAPI; 