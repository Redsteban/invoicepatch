import { NextRequest, NextResponse } from 'next/server';
import { OTPSecurity } from '../../../lib/otp-security';
import { createSecureApi } from '../../../lib/secure-api';

async function handleRequestOTP(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, purpose = 'trial_access' } = body;

    // Input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
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

    // Generate and send OTP
    const result = await OTPSecurity.requestTrialAccessOTP(email, ip);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        otpId: result.otpId
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          cooldownRemaining: result.cooldownRemaining
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('OTP request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = createSecureApi(handleRequestOTP, 'public'); 