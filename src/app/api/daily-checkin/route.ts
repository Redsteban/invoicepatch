import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  calculateDailyAlbertaTax,
  validateTaxCalculation,
  DailyWorkData,
  AlbertaInvoiceCalculation
} from '@/lib/albertaTax';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface DailyCheckInSubmission {
  date: string;
  trial_id: string;
  workedToday: boolean;
  dayRateUsed: boolean;
  truckUsed: boolean;
  travelKMs: number;
  subsistence: number;
  additionalCharges: number;
  workStartTime: string;
  workEndTime: string;
  notes: string;
  calculation: AlbertaInvoiceCalculation;
}

export async function POST(request: NextRequest) {
  try {
    const data: DailyCheckInSubmission = await request.json();

    // Validate required fields
    if (!data.date || !data.trial_id) {
      return NextResponse.json(
        { error: 'Missing required fields: date and trial_id' },
        { status: 400 }
      );
    }

    // Get trial data for validation
    const { data: trialData, error: trialError } = await supabase
      .from('trial_invoices')
      .select('*')
      .eq('trial_id', data.trial_id)
      .single();

    if (trialError || !trialData) {
      return NextResponse.json(
        { error: 'Trial not found' },
        { status: 404 }
      );
    }

    // Server-side calculation validation
    let serverCalculation: AlbertaInvoiceCalculation | null = null;
    
    if (data.workedToday) {
      const dailyData: DailyWorkData = {
        dayRate: trialData.day_rate,
        dayRateUsed: data.dayRateUsed,
        truckRate: trialData.truck_rate,
        truckUsed: data.truckUsed,
        travelKMs: Number(data.travelKMs) || 0,
        subsistence: Number(data.subsistence) || 0,
        additionalCharges: Number(data.additionalCharges) || 0
      };

      serverCalculation = calculateDailyAlbertaTax(dailyData);
      
      // Validate calculation
      const validation = validateTaxCalculation(serverCalculation);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: 'Invalid calculation', details: validation.errors },
          { status: 400 }
        );
      }

      // Verify client calculation matches server calculation (within tolerance)
      if (data.calculation) {
        const tolerance = 0.01;
        if (Math.abs(serverCalculation.grandTotal - data.calculation.grandTotal) > tolerance) {
          console.warn('Client/server calculation mismatch', {
            server: serverCalculation.grandTotal,
            client: data.calculation.grandTotal
          });
        }
      }
    }

    // Prepare check-in data for database
    const checkInData = {
      trial_id: data.trial_id,
      check_in_date: data.date,
      worked_today: data.workedToday,
      
      // Work details
      day_rate_used: data.dayRateUsed,
      truck_used: data.truckUsed,
      travel_kms: data.workedToday ? Number(data.travelKMs) || 0 : 0,
      subsistence: data.workedToday ? Number(data.subsistence) || 0 : 0,
      additional_charges: data.workedToday ? Number(data.additionalCharges) || 0 : 0,
      
      // Work hours
      work_start_time: data.workedToday ? data.workStartTime : null,
      work_end_time: data.workedToday ? data.workEndTime : null,
      
      // Calculated totals (use server calculation for accuracy)
      taxable_subtotal: serverCalculation?.taxableSubtotal || 0,
      gst_amount: serverCalculation?.gstAmount || 0,
      after_tax_subtotal: serverCalculation?.afterTaxSubtotal || 0,
      travel_reimbursement: serverCalculation?.travelReimbursement || 0,
      non_taxable_total: serverCalculation?.nonTaxableTotal || 0,
      daily_total: serverCalculation?.grandTotal || 0,
      
      // Additional info
      notes: data.notes || '',
      status: 'completed',
      submitted_at: new Date().toISOString(),
      
      // Metadata
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Check if check-in already exists for this date
    const { data: existingCheckIn, error: checkError } = await supabase
      .from('daily_checkins')
      .select('id, check_in_date')
      .eq('trial_id', data.trial_id)
      .eq('check_in_date', data.date)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing check-in:', checkError);
      return NextResponse.json(
        { error: 'Database error checking existing check-in' },
        { status: 500 }
      );
    }

    let result;
    if (existingCheckIn) {
      // Update existing check-in
      const { data: updatedCheckIn, error: updateError } = await supabase
        .from('daily_checkins')
        .update({
          ...checkInData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCheckIn.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating check-in:', updateError);
        return NextResponse.json(
          { error: 'Failed to update daily check-in' },
          { status: 500 }
        );
      }
      result = updatedCheckIn;
    } else {
      // Insert new check-in
      const { data: newCheckIn, error: insertError } = await supabase
        .from('daily_checkins')
        .insert([checkInData])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting check-in:', insertError);
        return NextResponse.json(
          { error: 'Failed to save daily check-in' },
          { status: 500 }
        );
      }
      result = newCheckIn;
    }

    // Update trial statistics
    await updateTrialStatistics(data.trial_id);

    // Return success response
    return NextResponse.json({
      success: true,
      checkIn: result,
      calculation: serverCalculation,
      message: existingCheckIn ? 'Daily check-in updated successfully' : 'Daily check-in saved successfully'
    });

  } catch (error) {
    console.error('Daily check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve daily check-in data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trialId = searchParams.get('trial');
    const date = searchParams.get('date');

    if (!trialId) {
      return NextResponse.json(
        { error: 'Trial ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('daily_checkins')
      .select('*')
      .eq('trial_id', trialId)
      .order('check_in_date', { ascending: false });

    if (date) {
      query = query.eq('check_in_date', date);
    } else {
      // Get last 30 days if no specific date
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte('check_in_date', thirtyDaysAgo.toISOString().split('T')[0]);
    }

    const { data: checkIns, error } = await query;

    if (error) {
      console.error('Error retrieving check-ins:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve check-ins' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkIns: checkIns || [],
      count: checkIns?.length || 0
    });

  } catch (error) {
    console.error('Error retrieving check-ins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateTrialStatistics(trialId: string) {
  try {
    // Get all check-ins for this trial
    const { data: checkIns, error } = await supabase
      .from('daily_checkins')
      .select('worked_today, daily_total, check_in_date')
      .eq('trial_id', trialId)
      .eq('status', 'completed');

    if (error || !checkIns) {
      console.error('Error getting check-ins for stats update:', error);
      return;
    }

    const workDays = checkIns.filter(c => c.worked_today).length;
    const totalEarnings = checkIns.reduce((sum, c) => sum + (c.daily_total || 0), 0);
    const lastCheckIn = checkIns.length > 0 ? checkIns[0].check_in_date : null;

    // Update trial with latest statistics
    await supabase
      .from('trial_invoices')
      .update({
        total_work_days: workDays,
        total_earnings: totalEarnings,
        last_checkin_date: lastCheckIn,
        updated_at: new Date().toISOString()
      })
      .eq('trial_id', trialId);

  } catch (error) {
    console.error('Error updating trial statistics:', error);
    // Don't fail the whole request if stats update fails
  }
} 