import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, companyName, trialDays = 15 } = await request.json();

    // Input validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: email, password, firstName, lastName'
      }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 8 characters long'
      }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Account with this email already exists'
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user record (if users table exists)
    let userId: string;
    
    try {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          company_name: companyName || `${firstName} ${lastName}`,
          role: 'contractor',
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + (trialDays * 24 * 60 * 60 * 1000)).toISOString(),
          is_trial: true,
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) {
        console.error('User creation error:', userError);
        // If users table doesn't exist, we'll proceed without it for now
        userId = `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      } else {
        userId = user.id;
      }
    } catch (error) {
      console.error('User table not available, proceeding with trial invoice only');
      userId = `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Create trial invoice - this is the main functionality
    const trialStartDate = new Date();
    const trialEndDate = new Date(Date.now() + (trialDays * 24 * 60 * 60 * 1000));

    const trialInvoiceData: any = {
      contractor_email: email,
      contractor_name: `${firstName} ${lastName}`,
      company_name: companyName || `${firstName} ${lastName}`,
      period_start: trialStartDate.toISOString().split('T')[0],
      period_end: trialEndDate.toISOString().split('T')[0],
      day_rate: 450.00,
      truck_rate: 150.00,
      rate_per_km: 0.68,
      subsistence_rate: 125.00,
      sequence_number: `TRIAL-${Date.now()}`,
      status: 'active',
      trial_day: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Additional fields for compatibility
      start_date: trialStartDate.toISOString().split('T')[0],
      end_date: trialEndDate.toISOString().split('T')[0],
      total_earned: 0,
      days_worked: 0,
      work_days: [],
      location: 'Project Site',
      company: companyName || `${firstName} ${lastName}`,
      contractor_phone: null
    };

    // Add user_id if we have one
    if (userId && !userId.startsWith('trial_')) {
      trialInvoiceData.user_id = userId;
    }

    const { data: trialInvoice, error: invoiceError } = await supabaseAdmin
      .from('trial_invoices')
      .insert([trialInvoiceData])
      .select()
      .single();

    if (invoiceError) {
      console.error('Trial invoice creation error:', invoiceError);
      return NextResponse.json({
        success: false,
        message: 'Failed to create trial invoice'
      }, { status: 500 });
    }

    // Generate a simple session token for immediate access
    const sessionToken = `trial_${trialInvoice.id}_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: 'Trial account created successfully! You can now access your dashboard.',
      user: {
        id: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        companyName: companyName || `${firstName} ${lastName}`,
        role: 'contractor',
        trialDays: trialDays,
        trialStartDate: trialStartDate.toISOString(),
        trialEndDate: trialEndDate.toISOString()
      },
      trialInvoice: {
        id: trialInvoice.id,
        sequenceNumber: trialInvoice.sequence_number,
        periodStart: trialInvoice.period_start,
        periodEnd: trialInvoice.period_end,
        dayRate: trialInvoice.day_rate,
        truckRate: trialInvoice.truck_rate,
        status: trialInvoice.status
      },
      sessionToken,
      redirectUrl: `/contractor/dashboard`
    });

  } catch (error) {
    console.error('Trial signup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}