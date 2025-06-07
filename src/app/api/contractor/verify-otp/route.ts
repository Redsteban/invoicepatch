import { NextRequest, NextResponse } from 'next/server';
import { OTPSecurity } from '../../../lib/otp-security';
import { createSecureApi } from '../../../lib/secure-api';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function handleVerifyOTP(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, purpose = 'trial_access' } = body;

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

    // OTP verified successfully - now find the trial
    const { data: trial, error: trialError } = await supabase
      .from('trial_invoices')
      .select('id, contractor_name, company, status, start_date, end_date')
      .eq('contractor_email', email.toLowerCase())
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (trialError || !trial) {
      console.error('Trial lookup error:', trialError);
      return NextResponse.json(
        { success: false, error: 'No active trial found for this email' },
        { status: 404 }
      );
    }

    // Log successful access
    console.log(`Successful OTP verification for trial access: ${email} -> ${trial.id}`);

    return NextResponse.json({
      success: true,
      message: 'Verification successful! Redirecting to your trial...',
      trialId: trial.id,
      trial: {
        id: trial.id,
        contractorName: trial.contractor_name,
        company: trial.company,
        startDate: trial.start_date,
        endDate: trial.end_date
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = createSecureApi(handleVerifyOTP, 'public'); 