import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('🔒 Password reset OTP request for:', email);

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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP email
    const emailResult = await EmailService.sendOTP(email, otp, 'password_reset');

    if (emailResult.success) {
      console.log('✅ Password reset OTP sent to:', email, 'OTP:', otp);
      
      return NextResponse.json({
        success: true,
        message: `We've sent a 6-digit verification code to ${email}. Please check your inbox.`,
        // For development, include OTP in response (remove in production)
        ...(process.env.NODE_ENV === 'development' && { devOtp: otp })
      });
    } else {
      console.error('❌ Failed to send password reset OTP:', emailResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to send verification code' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Password reset OTP request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 