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
      subsistence,
      location,
      company
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Calculate 5-day trial period
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 5);

    // Create trial invoice with user's details
    const { data: invoice, error } = await supabaseAdmin
      .from('trial_invoices')
      .insert([{
        ticket_number: invoiceSequence || `TRIAL-${Date.now()}`,
        location: location || 'Project Site',
        company: company || 'Construction Company',
        day_rate: dayRate || 450.00,
        truck_rate: truckRate || 150.00,
        travel_kms: travelKms || 45.0,
        subsistence: subsistence || 75.00,
        work_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        invoice_frequency: 'trial',
        contractor_name: name,
        contractor_email: email,
        contractor_phone: phone || null,
        status: 'active',
        trial_day: 1
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Create initial daily entry for today with user's rates
    const today = new Date().toISOString().split('T')[0];
    await supabaseAdmin
      .from('daily_entries')
      .insert([{
        trial_invoice_id: invoice.id,
        entry_date: today,
        worked: false, // Will be updated when user logs work
        day_rate_used: dayRate || 450.00,
        truck_rate_used: truckRate || 150.00,
        travel_kms_actual: travelKms || 45.0,
        subsistence_actual: subsistence || 75.00
      }]);

    console.log('Trial created successfully:', invoice.id);

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      message: 'Trial setup complete! Start logging your work.',
      trialDays: 5
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to setup trial' },
      { status: 500 }
    );
  }
} 