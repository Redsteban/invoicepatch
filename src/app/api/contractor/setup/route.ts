import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone, 
      invoiceSequence,
      dayRate,
      truckRate,
      travelKms,
      ratePerKm,
      subsistence,
      location,
      company
    } = body;

    console.log('Setup request body:', body);

    // Validate required fields
    if (!name || !email) {
      console.log('Validation failed: missing name or email');
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Calculate 5-day trial period
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 5);

    // Create trial invoice with user's details using correct schema
    const { data: invoice, error } = await supabaseAdmin
      .from('trial_invoices')
      .insert([{
        contractor_name: name,
        contractor_email: email,
        contractor_phone: phone || null,
        sequence_number: invoiceSequence || `TRIAL-${Date.now()}`,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        trial_day: 1,
        day_rate: parseFloat(dayRate) || 450.00,
        truck_rate: parseFloat(truckRate) || 150.00,
        travel_kms: parseInt(travelKms) || 45,
        rate_per_km: parseFloat(ratePerKm) || 0.68,
        subsistence: parseFloat(subsistence) || 75.00,
        location: location || 'Project Site',
        company: company || 'Construction Company',
        total_earned: 0,
        days_worked: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error creating trial invoice:', error);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Trial invoice created successfully:', invoice.id);

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      message: 'Trial setup complete! Start logging your work.',
      trialDays: 5
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to setup trial: ${error.message}` },
      { status: 500 }
    );
  }
} 