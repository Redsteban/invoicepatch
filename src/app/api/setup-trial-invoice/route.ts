import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateTrialPreview } from '@/lib/albertaTax';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TrialInvoiceSetup {
  ticketNumber: string;
  location: string;
  company: string;
  dayRate: number;
  truckRate: number;
  travelKms: number;
  subsistence: number;
  workStartDate: string;
  workDays: string[];
  invoiceFrequency: string;
  preview: {
    dayRate: number;
    truckRate: number;
    travelKms: number;
    subsistence: number;
    taxableAmount: number;
    gst: number;
    afterTax: number;
    travelReimbursement: number;
    reimbursements: number;
    dailyTotal: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: TrialInvoiceSetup = await request.json();

    // Validate required fields
    const requiredFields: (keyof TrialInvoiceSetup)[] = [
      'ticketNumber', 'location', 'company', 'dayRate', 
      'truckRate', 'travelKms', 'subsistence', 'workStartDate', 
      'workDays', 'invoiceFrequency'
    ];

    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate work days array
    if (!Array.isArray(data.workDays) || data.workDays.length === 0) {
      return NextResponse.json(
        { error: 'At least one work day must be selected' },
        { status: 400 }
      );
    }

    // Validate rates are positive
    if (data.dayRate < 0 || data.truckRate < 0 || data.travelKms < 0 || data.subsistence < 0) {
      return NextResponse.json(
        { error: 'All rates and amounts must be positive' },
        { status: 400 }
      );
    }

    // Generate a unique trial ID
    const trialId = `trial_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Calculate additional trial metadata
    const currentDate = new Date();
    const workStartDate = new Date(data.workStartDate);
    const trialEndDate = new Date(workStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

    // Prepare trial data for database
    const calculation = calculateTrialPreview({
      dayRate: data.dayRate,
      truckRate: data.truckRate,
      travelKms: data.travelKms,
      subsistence: data.subsistence
    });

    const trialData = {
      trial_id: trialId,
      ticket_number: data.ticketNumber,
      location: data.location,
      company: data.company,
      day_rate: data.dayRate,
      truck_rate: data.truckRate,
      travel_kms: data.travelKms,
      subsistence: data.subsistence,
      work_start_date: data.workStartDate,
      work_days: data.workDays,
      invoice_frequency: data.invoiceFrequency,
      
      // Trial metadata
      trial_start_date: currentDate.toISOString(),
      trial_end_date: trialEndDate.toISOString(),
      trial_status: 'active',
      days_remaining: 14,
      
      // Daily totals for quick reference using Alberta tax calculation
      daily_taxable_amount: calculation.taxableSubtotal,
      daily_gst: calculation.gstAmount,
      daily_after_tax: calculation.afterTaxSubtotal,
      daily_travel_reimbursement: calculation.travelReimbursement,
      daily_reimbursements: calculation.nonTaxableTotal,
      daily_total: calculation.grandTotal,
      
      // Settings
      notifications_enabled: true,
      auto_save_enabled: true,
      created_at: currentDate.toISOString(),
      updated_at: currentDate.toISOString()
    };

    // Insert trial data into Supabase
    const { data: insertedTrial, error: insertError } = await supabase
      .from('trial_invoices')
      .insert([trialData])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting trial data:', insertError);
      return NextResponse.json(
        { error: 'Failed to save trial setup' },
        { status: 500 }
      );
    }

    // Create the initial daily check-in schedule
    await scheduleInitialCheckIn(trialId, data.workDays, workStartDate);

    // Return success response with trial details
    return NextResponse.json({
      success: true,
      trialId: trialId,
      trialData: insertedTrial,
      message: 'Trial invoice setup completed successfully',
      nextSteps: {
        firstCheckIn: 'Today at 6:00 PM',
        dashboardUrl: `/trial-dashboard?trial=${trialId}`,
        estimatedDailyTotal: calculation.grandTotal
      }
    });

  } catch (error) {
    console.error('Trial setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function scheduleInitialCheckIn(trialId: string, workDays: string[], startDate: Date) {
  try {
    // Create initial check-in record for today if it's a work day
    const today = new Date();
    const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const isWorkDay = workDays.includes(todayDayName);
    
    if (isWorkDay && today >= startDate) {
      // Set check-in time to 6 PM today
      const checkInTime = new Date(today);
      checkInTime.setHours(18, 0, 0, 0); // 6:00 PM
      
      const checkInData = {
        trial_id: trialId,
        check_in_date: today.toISOString().split('T')[0],
        scheduled_time: checkInTime.toISOString(),
        status: 'scheduled',
        work_day: true,
        created_at: new Date().toISOString()
      };

      const { error: checkInError } = await supabase
        .from('daily_checkins')
        .insert([checkInData]);

      if (checkInError) {
        console.error('Error creating initial check-in:', checkInError);
      }
    }

    // Schedule check-ins for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      const futureDayName = futureDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const isWorkDay = workDays.includes(futureDayName);
      
      if (isWorkDay) {
        const checkInTime = new Date(futureDate);
        checkInTime.setHours(18, 0, 0, 0); // 6:00 PM
        
        const checkInData = {
          trial_id: trialId,
          check_in_date: futureDate.toISOString().split('T')[0],
          scheduled_time: checkInTime.toISOString(),
          status: 'scheduled',
          work_day: true,
          created_at: new Date().toISOString()
        };

        await supabase
          .from('daily_checkins')
          .insert([checkInData]);
      }
    }

  } catch (error) {
    console.error('Error scheduling check-ins:', error);
  }
}

// GET endpoint to retrieve trial data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trialId = searchParams.get('trial');

    if (!trialId) {
      return NextResponse.json(
        { error: 'Trial ID is required' },
        { status: 400 }
      );
    }

    const { data: trialData, error } = await supabase
      .from('trial_invoices')
      .select('*')
      .eq('trial_id', trialId)
      .single();

    if (error || !trialData) {
      return NextResponse.json(
        { error: 'Trial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      trial: trialData
    });

  } catch (error) {
    console.error('Error retrieving trial data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 