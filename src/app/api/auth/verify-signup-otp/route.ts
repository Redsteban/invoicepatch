import { NextRequest, NextResponse } from 'next/server';
import { OTPSecurity } from '@/lib/otp-security';
import { createSecureApi } from '@/lib/secure-api';

async function handleVerifySignupOTP(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'account_verification' } = body;

    // Input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Valid 6-digit code is required' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Verify OTP
    const verificationResult = await OTPSecurity.verifyOTP(email, code, purpose, ip);

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.error,
          attemptsRemaining: verificationResult.attemptsRemaining
        },
        { status: 400 }
      );
    }

    // OTP verified successfully
    return NextResponse.json({
      success: true,
      message: 'Email verification completed successfully. You can now create your account.'
    });

  } catch (error) {
    console.error('Signup OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = createSecureApi(handleVerifySignupOTP, 'public'); 