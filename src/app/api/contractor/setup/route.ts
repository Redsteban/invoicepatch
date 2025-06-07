import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('=== SETUP API STARTED ===');
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV
    });

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
      company,
      customStartDate,
      useCustomStartDate,
      // Manual schedule options
      useManualSchedule,
      cutoffDay,
      submissionDay,
      scheduleType,
      customCutoffDate,
      customSubmissionDate
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

    // Calculate 15-day trial period with custom start date support
    let startDate: Date;
    
    if (useCustomStartDate && customStartDate) {
      startDate = new Date(customStartDate);
      console.log('Using custom start date:', customStartDate);
    } else {
      startDate = new Date();
      console.log('Using current date as start date');
    }
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 15);

    console.log('Dates calculated:', { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString(),
      trialDays: 15,
      useCustomStartDate,
      customStartDate 
    });

    // Calculate pay periods for reference with manual schedule support
    const calculatePayPeriods = (workStart: Date) => {
      const periods = [];
      
      if (useManualSchedule) {
        // Manual schedule calculation
        if (scheduleType === 'custom' && customCutoffDate && customSubmissionDate) {
          // Custom specific dates
          periods.push({
            period: 1,
            workStart: workStart.toISOString().split('T')[0],
            cutoffDate: customCutoffDate,
            submissionDate: customSubmissionDate,
            type: 'custom',
            scheduleType: 'custom'
          });
        } else if (cutoffDay && submissionDay) {
          // Weekly or biweekly with day-of-week selection
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const cutoffDayIndex = dayNames.indexOf(cutoffDay.toLowerCase());
          const submissionDayIndex = dayNames.indexOf(submissionDay.toLowerCase());
          
          const periodLength = scheduleType === 'weekly' ? 7 : 14;
          
          for (let i = 1; i <= 3; i++) {
            const periodStart = new Date(workStart);
            periodStart.setDate(workStart.getDate() + ((i - 1) * periodLength));
            
            // Find next cutoff day
            const cutoffDate = new Date(periodStart);
            const daysUntilCutoff = (cutoffDayIndex + 7 - cutoffDate.getDay()) % 7;
            cutoffDate.setDate(cutoffDate.getDate() + daysUntilCutoff + (periodLength - 7));
            
            // Find submission day (usually after cutoff)
            const submissionDate = new Date(cutoffDate);
            const daysUntilSubmission = (submissionDayIndex + 7 - cutoffDate.getDay()) % 7;
            if (daysUntilSubmission === 0) submissionDate.setDate(submissionDate.getDate() + 7); // Next week if same day
            else submissionDate.setDate(submissionDate.getDate() + daysUntilSubmission);
            
            periods.push({
              period: i,
              workStart: periodStart.toISOString().split('T')[0],
              cutoffDate: cutoffDate.toISOString().split('T')[0],
              submissionDate: submissionDate.toISOString().split('T')[0],
              type: scheduleType,
              scheduleType,
              cutoffDay,
              submissionDay
            });
          }
        }
      } else {
        // Default automatic calculation
        const firstCutoff = new Date(workStart);
        firstCutoff.setDate(firstCutoff.getDate() + 1);
        const firstSubmission = new Date(firstCutoff);
        firstSubmission.setDate(firstSubmission.getDate() + 1);
        
        periods.push({
          period: 1,
          workStart: workStart.toISOString().split('T')[0],
          cutoffDate: firstCutoff.toISOString().split('T')[0],
          submissionDate: firstSubmission.toISOString().split('T')[0],
          type: 'initial'
        });
        
        // Subsequent 14-day periods
        let nextPeriodStart = new Date(firstSubmission);
        for (let i = 2; i <= 3; i++) {
          const periodEnd = new Date(nextPeriodStart);
          periodEnd.setDate(periodEnd.getDate() + 13); // 14 days total
          const submissionDate = new Date(periodEnd);
          submissionDate.setDate(submissionDate.getDate() + 1);
          
          periods.push({
            period: i,
            workStart: nextPeriodStart.toISOString().split('T')[0],
            cutoffDate: periodEnd.toISOString().split('T')[0],
            submissionDate: submissionDate.toISOString().split('T')[0],
            type: 'regular'
          });
          
          nextPeriodStart = new Date(submissionDate);
        }
      }
      
      return periods;
    };

    const payPeriods = calculatePayPeriods(startDate);
    console.log('Pay periods calculated:', payPeriods);

    // Prepare data for insertion (with fallback if columns don't exist)
    const baseData = {
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
      days_worked: 0,
      work_days: [], // Initialize with empty JSON array for trial period work days
      invoice_frequency: scheduleType || 'weekly', // Use selected schedule type
      custom_start_date: useCustomStartDate || false,
      pay_periods: payPeriods,
      // Manual schedule configuration
      manual_schedule: useManualSchedule || false,
      schedule_type: scheduleType || 'biweekly',
      cutoff_day: cutoffDay || 'friday',
      submission_day: submissionDay || 'monday',
      custom_cutoff_date: customCutoffDate || null,
      custom_submission_date: customSubmissionDate || null
    };

    console.log('Data prepared for insertion:', baseData);

    // Create trial invoice with user's details using correct schema
    const { data: invoice, error } = await supabaseAdmin
      .from('trial_invoices')
      .insert([baseData])
      .select()
      .single();

    if (error) {
      console.error('Database error creating trial invoice:', error);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}`, details: error },
        { status: 500 }
      );
    }

    console.log('Trial invoice created successfully:', invoice.id);

    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      message: 'Trial setup complete! Start logging your work.',
      trialDays: 15,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      payPeriods,
      useCustomStartDate
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: `Failed to setup trial: ${error.message}`, details: error.stack },
      { status: 500 }
    );
  }
} 