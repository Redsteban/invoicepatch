import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculatePayrollSchedule } from '@/lib/payroll';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Calculate payroll schedule based on start date and first period end
    const schedule = calculatePayrollSchedule(body.startDate, body.firstPeriodEnd);
    
    // Create the invoice record
    const { data: invoice, error } = await supabaseAdmin
      .from('trial_invoices')
      .insert([{
        user_id: body.userId || '123e4567-e89b-12d3-a456-426614174000', // In real app, get from auth
        ticket_number: body.ticketNumber,
        company: body.company,
        location: body.location,
        day_rate: body.dayRate,
        truck_rate: body.truckRate,
        travel_kms: body.travelKms,
        subsistence: body.subsistence,
        work_days: body.workDays,
        start_date: body.startDate,
        first_period_end: body.firstPeriodEnd,
        invoice_frequency: 'bi-weekly',
        payroll_schedule: schedule.periods,
        current_period: 1,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;

    // Create initial daily entries for the first period (optional)
    const firstPeriod = schedule.periods[0];
    const entriesToCreate = [];
    
    let currentDate = new Date(body.startDate);
    const endDate = new Date(firstPeriod.endDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (body.workDays.includes(dayOfWeek)) {
        entriesToCreate.push({
          trial_invoice_id: invoice.id,
          entry_date: currentDate.toISOString().split('T')[0],
          worked: false, // Will be updated during daily check-ins
          created_at: new Date().toISOString()
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (entriesToCreate.length > 0) {
      await supabaseAdmin
        .from('daily_entries')
        .insert(entriesToCreate);
    }

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      message: 'Setup complete! Your first period ends on ' + firstPeriod.endDate.toLocaleDateString()
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete setup' },
      { status: 500 }
    );
  }
} 