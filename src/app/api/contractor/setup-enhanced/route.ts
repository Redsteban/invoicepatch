import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines 
} from '@/lib/payrollCalculation';

export async function POST(request: NextRequest) {
  try {
    console.log('=== ENHANCED CONTRACTOR SETUP API STARTED ===');
    
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
      // Enhanced payroll options
      useCanadianPayroll = true,
      numberOfPeriods = 26
    } = body;

    console.log('Enhanced setup request:', { name, email, useCanadianPayroll, numberOfPeriods });

    // Validate required fields
    if (!name || !email) {
      console.log('Validation failed: missing required fields');
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Determine start date
    let startDate: Date;
    if (useCustomStartDate && customStartDate) {
      startDate = new Date(customStartDate);
      console.log('Using custom start date:', customStartDate);
    } else {
      startDate = new Date();
      console.log('Using current date as start date');
    }
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 15); // 15-day trial

    // Calculate Canadian bi-weekly payroll schedule
    const payrollSchedule = calculatePayrollSchedule(
      startDate.toISOString().split('T')[0], 
      numberOfPeriods
    );
    
    const currentPeriod = getCurrentPayPeriod(payrollSchedule);
    const upcomingDeadlines = getUpcomingDeadlines(payrollSchedule, 60); // Next 60 days

    console.log('Canadian payroll schedule calculated:', {
      totalPeriods: payrollSchedule.periods.length,
      firstPeriodEnd: payrollSchedule.firstPeriodEnd,
      currentPeriodNumber: currentPeriod?.periodNumber,
      upcomingDeadlinesCount: upcomingDeadlines.length,
      hasPartialFirstPeriod: payrollSchedule.periods[0]?.isPartialPeriod
    });

    // Prepare enhanced data for insertion
    const enhancedData = {
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
      work_days: [],
      
      // Enhanced Canadian payroll fields
      payroll_type: 'canadian_biweekly',
      payroll_schedule: payrollSchedule.periods, // Store full schedule as JSONB
      first_period_end: payrollSchedule.firstPeriodEnd,
      current_period: currentPeriod?.periodNumber || 1,
      current_period_start: currentPeriod?.startDate || startDate,
      current_period_end: currentPeriod?.endDate || startDate,
      next_submission_deadline: currentPeriod?.submissionDeadline || startDate,
      next_payment_date: currentPeriod?.paymentDate || startDate,
      is_partial_first_period: payrollSchedule.periods[0]?.isPartialPeriod || false,
      
      // Additional metadata
      use_canadian_payroll: useCanadianPayroll,
      custom_start_date: useCustomStartDate || false,
      schedule_generated_at: new Date().toISOString(),
      upcoming_deadlines: upcomingDeadlines
    };

    console.log('Enhanced data prepared for insertion');

    // Create trial invoice with enhanced payroll data
    const { data: invoice, error } = await supabaseAdmin
      .from('trial_invoices')
      .insert([enhancedData])
      .select()
      .single();

    if (error) {
      console.error('Database error creating enhanced trial invoice:', error);
      return NextResponse.json(
        { success: false, error: `Database error: ${error.message}`, details: error },
        { status: 500 }
      );
    }

    console.log('Enhanced trial invoice created successfully:', invoice.id);

    // Return comprehensive response
    return NextResponse.json({ 
      success: true, 
      invoiceId: invoice.id,
      message: 'Enhanced trial setup complete with Canadian payroll!',
      
      // Trial information
      trial: {
        trialDays: 15,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        useCustomStartDate
      },
      
      // Current payroll period
      currentPeriod: currentPeriod ? {
        periodNumber: currentPeriod.periodNumber,
        startDate: currentPeriod.startDate,
        endDate: currentPeriod.endDate,
        submissionDeadline: currentPeriod.submissionDeadline,
        paymentDate: currentPeriod.paymentDate,
        isPartialPeriod: currentPeriod.isPartialPeriod,
        daysInPeriod: currentPeriod.daysInPeriod
      } : null,
      
      // Next deadlines
      upcomingDeadlines: upcomingDeadlines.slice(0, 3).map(period => ({
        periodNumber: period.periodNumber,
        submissionDeadline: period.submissionDeadline,
        paymentDate: period.paymentDate,
        daysInPeriod: period.daysInPeriod
      })),
      
      // Schedule summary
      payrollSummary: {
        type: 'canadian_biweekly',
        totalPeriods: payrollSchedule.periods.length,
        firstPeriodEnd: payrollSchedule.firstPeriodEnd,
        hasPartialFirstPeriod: payrollSchedule.periods[0]?.isPartialPeriod,
        nextSubmission: currentPeriod?.submissionDeadline,
        nextPayment: currentPeriod?.paymentDate
      }
    });

  } catch (error: any) {
    console.error('Enhanced setup error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: `Failed to setup enhanced trial: ${error.message}`, details: error.stack },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve payroll information for existing contractors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');
    const email = searchParams.get('email');

    if (!invoiceId && !email) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID or email is required' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from('trial_invoices');
    
    if (invoiceId) {
      query = query.eq('id', invoiceId);
    } else if (email) {
      query = query.eq('contractor_email', email);
    }

    const { data: invoice, error } = await query.select().single();

    if (error || !invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // If this invoice doesn't have enhanced payroll data, generate it
    if (!invoice.payroll_schedule || !invoice.use_canadian_payroll) {
      const startDate = invoice.start_date;
      const payrollSchedule = calculatePayrollSchedule(startDate, 26);
      const currentPeriod = getCurrentPayPeriod(payrollSchedule);
      const upcomingDeadlines = getUpcomingDeadlines(payrollSchedule, 60);

      return NextResponse.json({
        success: true,
        invoice,
        payrollData: {
          schedule: payrollSchedule,
          currentPeriod,
          upcomingDeadlines,
          generated: true // Indicates this was generated on-demand
        }
      });
    }

    // Return existing enhanced payroll data
    return NextResponse.json({
      success: true,
      invoice,
      payrollData: {
        schedule: {
          periods: invoice.payroll_schedule,
          firstPeriodEnd: invoice.first_period_end,
          contractStartDate: invoice.start_date
        },
        currentPeriod: {
          periodNumber: invoice.current_period,
          submissionDeadline: invoice.next_submission_deadline,
          paymentDate: invoice.next_payment_date
        },
        upcomingDeadlines: invoice.upcoming_deadlines || [],
        generated: false // Indicates this was stored data
      }
    });

  } catch (error: any) {
    console.error('GET payroll data error:', error);
    return NextResponse.json(
      { success: false, error: `Failed to retrieve payroll data: ${error.message}` },
      { status: 500 }
    );
  }
} 