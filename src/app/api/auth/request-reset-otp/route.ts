import { NextRequest, NextResponse } from 'next/server';
import { OTPSecurity } from '@/lib/otp-security';
import { createSecureApi } from '@/lib/secure-api';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function handleRequestResetOTP(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

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

    // Check if user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (userError || !user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: `If an account with ${email} exists, we've sent a verification code to reset your password.`
      });
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Generate and send OTP for password reset
    const result = await OTPSecurity.generateAndSendOTP(email, 'password_reset', ip);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `We've sent a 6-digit verification code to ${email}. Please check your inbox.`,
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
    console.error('Password reset OTP request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = createSecureApi(handleRequestResetOTP, 'public'); 