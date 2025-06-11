import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines 
} from '@/lib/payrollCalculation';

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

    // Calculate Canadian bi-weekly payroll schedule using our enhanced system
    let payrollSchedule;
    let currentPeriod;
    let upcomingDeadlines;
    
    if (useManualSchedule) {
      // For manual schedules, use the existing logic but also generate Canadian schedule for reference
      const legacyPeriods = [];
      
      if (scheduleType === 'custom' && customCutoffDate && customSubmissionDate) {
        // Custom specific dates
        legacyPeriods.push({
          period: 1,
          workStart: startDate.toISOString().split('T')[0],
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
          const periodStart = new Date(startDate);
          periodStart.setDate(startDate.getDate() + ((i - 1) * periodLength));
          
          // Find next cutoff day
          const cutoffDate = new Date(periodStart);
          const daysUntilCutoff = (cutoffDayIndex + 7 - cutoffDate.getDay()) % 7;
          cutoffDate.setDate(cutoffDate.getDate() + daysUntilCutoff + (periodLength - 7));
          
          // Find submission day (usually after cutoff)
          const submissionDate = new Date(cutoffDate);
          const daysUntilSubmission = (submissionDayIndex + 7 - cutoffDate.getDay()) % 7;
          if (daysUntilSubmission === 0) submissionDate.setDate(submissionDate.getDate() + 7); // Next week if same day
          else submissionDate.setDate(submissionDate.getDate() + daysUntilSubmission);
          
          legacyPeriods.push({
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
      
      // Also generate Canadian payroll schedule for reference
      const canadianSchedule = calculatePayrollSchedule(startDate.toISOString().split('T')[0], 26);
      payrollSchedule = {
        type: 'manual',
        legacyPeriods,
        canadianReference: canadianSchedule
      };
      currentPeriod = legacyPeriods[0];
    } else {
      // Use enhanced Canadian bi-weekly payroll system
      const canadianSchedule = calculatePayrollSchedule(startDate.toISOString().split('T')[0], 26);
      currentPeriod = getCurrentPayPeriod(canadianSchedule);
      upcomingDeadlines = getUpcomingDeadlines(canadianSchedule, 60);
      
      payrollSchedule = {
        type: 'canadian_biweekly',
        schedule: canadianSchedule,
        currentPeriod,
        upcomingDeadlines
      };
      
      console.log('Canadian payroll schedule generated:', {
        totalPeriods: canadianSchedule.periods.length,
        firstPeriodEnd: canadianSchedule.firstPeriodEnd,
        currentPeriod: currentPeriod?.periodNumber,
        upcomingDeadlines: upcomingDeadlines?.length
      });
    }

    const payPeriods = payrollSchedule.type === 'manual' ? payrollSchedule.legacyPeriods : payrollSchedule.schedule.periods;
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