import { NextRequest, NextResponse } from 'next/server';
import { OTPSecurity } from '../../../../lib/otp-security';
import { createSecureApi } from '../../../../lib/secure-api';

async function handleRequestSignupOTP(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Generate and send OTP for account verification
    const result = await OTPSecurity.generateAndSendOTP(email, 'account_verification', ip);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `We've sent a 6-digit verification code to ${email}. Please check your inbox to complete your registration.`,
        otpId: result.otpId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to send verification code',
          cooldownRemaining: result.cooldownRemaining
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Signup OTP request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = createSecureApi(handleRequestSignupOTP, 'public'); 