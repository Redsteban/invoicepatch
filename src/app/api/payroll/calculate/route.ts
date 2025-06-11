import { NextRequest, NextResponse } from 'next/server';
import { 
  calculatePayrollSchedule, 
  getCurrentPayPeriod, 
  getUpcomingDeadlines 
} from '../../../../../lib/payrollCalculation';

export async function POST(request: NextRequest) {
  try {
    const { contractStartDate, numberOfPeriods = 26 } = await request.json();

    console.log('📊 Payroll calculation request:', { contractStartDate, numberOfPeriods });

    // Input validation
    if (!contractStartDate || typeof contractStartDate !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Contract start date is required' },
        { status: 400 }
      );
    }

    // Validate date format
    const startDate = new Date(contractStartDate);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Calculate payroll schedule
    const schedule = calculatePayrollSchedule(contractStartDate, numberOfPeriods);
    const currentPeriod = getCurrentPayPeriod(schedule);
    const upcomingDeadlines = getUpcomingDeadlines(schedule, 60); // Next 60 days

    console.log('✅ Payroll schedule calculated successfully');

    return NextResponse.json({
      success: true,
      data: {
        schedule,
        currentPeriod,
        upcomingDeadlines,
        summary: {
          totalPeriods: schedule.periods.length,
          contractStartDate: schedule.contractStartDate,
          firstPeriodEnd: schedule.firstPeriodEnd,
          hasPartialFirstPeriod: schedule.periods[0]?.isPartialPeriod || false
        }
      }
    });

  } catch (error: any) {
    console.error('Payroll calculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
