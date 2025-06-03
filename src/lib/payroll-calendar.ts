// Stack Production Testing 2025 Biweekly Payroll Calendar System
// Automated invoice generation based on payroll cut-off dates

export interface PayrollPeriod {
  id: string;
  year: number;
  month: number;
  payDate: Date;
  cutOffDate: Date;
  workPeriodStart: Date;
  workPeriodEnd: Date;
  invoiceGenerationDate: Date; // Saturday after cut-off Friday
  isHoliday?: boolean;
  holidayName?: string;
}

export interface AutoInvoiceConfig {
  contractorId: string;
  companyName: string;
  standardDayRate: number;
  standardTruckRate?: number;
  standardMileageRate: number;
  defaultProjectCode: string;
  defaultAFECode: string;
  autoSubmit: boolean;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

export interface WorkPeriodData {
  contractorId: string;
  periodId: string;
  daysWorked: number;
  hoursWorked: number;
  overtimeHours: number;
  truckDays?: number;
  mileage: number;
  expenses: Array<{
    category: string;
    amount: number;
    description: string;
    receiptUrl?: string;
  }>;
  timeEntries: Array<{
    date: string;
    startTime: string;
    endTime: string;
    breakTime: number;
    description: string;
    projectCode: string;
  }>;
}

export interface NotificationSchedule {
  type: 'invoice_created' | 'reminder_tuesday' | 'urgent_thursday' | 'final_friday';
  scheduledDate: Date;
  sent: boolean;
  invoiceId: string;
  contractorId: string;
}

// Stack Production Testing 2025 Payroll Calendar
export const STACK_PAYROLL_2025: PayrollPeriod[] = [
  // January
  {
    id: 'stack-2025-01-01',
    year: 2025,
    month: 1,
    payDate: new Date('2025-01-03'),
    cutOffDate: new Date('2025-01-02'),
    workPeriodStart: new Date('2024-12-23'),
    workPeriodEnd: new Date('2025-01-02'),
    invoiceGenerationDate: new Date('2025-01-04') // Saturday
  },
  {
    id: 'stack-2025-01-02',
    year: 2025,
    month: 1,
    payDate: new Date('2025-01-17'),
    cutOffDate: new Date('2025-01-16'),
    workPeriodStart: new Date('2025-01-03'),
    workPeriodEnd: new Date('2025-01-16'),
    invoiceGenerationDate: new Date('2025-01-18') // Saturday
  },
  {
    id: 'stack-2025-01-03',
    year: 2025,
    month: 1,
    payDate: new Date('2025-01-31'),
    cutOffDate: new Date('2025-01-30'),
    workPeriodStart: new Date('2025-01-17'),
    workPeriodEnd: new Date('2025-01-30'),
    invoiceGenerationDate: new Date('2025-02-01') // Saturday
  },

  // February
  {
    id: 'stack-2025-02-01',
    year: 2025,
    month: 2,
    payDate: new Date('2025-02-14'),
    cutOffDate: new Date('2025-02-13'),
    workPeriodStart: new Date('2025-01-31'),
    workPeriodEnd: new Date('2025-02-13'),
    invoiceGenerationDate: new Date('2025-02-15') // Saturday
  },
  {
    id: 'stack-2025-02-02',
    year: 2025,
    month: 2,
    payDate: new Date('2025-02-28'),
    cutOffDate: new Date('2025-02-27'),
    workPeriodStart: new Date('2025-02-14'),
    workPeriodEnd: new Date('2025-02-27'),
    invoiceGenerationDate: new Date('2025-03-01') // Saturday
  },

  // March
  {
    id: 'stack-2025-03-01',
    year: 2025,
    month: 3,
    payDate: new Date('2025-03-14'),
    cutOffDate: new Date('2025-03-13'),
    workPeriodStart: new Date('2025-02-28'),
    workPeriodEnd: new Date('2025-03-13'),
    invoiceGenerationDate: new Date('2025-03-15') // Saturday
  },
  {
    id: 'stack-2025-03-02',
    year: 2025,
    month: 3,
    payDate: new Date('2025-03-28'),
    cutOffDate: new Date('2025-03-27'),
    workPeriodStart: new Date('2025-03-14'),
    workPeriodEnd: new Date('2025-03-27'),
    invoiceGenerationDate: new Date('2025-03-29') // Saturday
  },

  // April
  {
    id: 'stack-2025-04-01',
    year: 2025,
    month: 4,
    payDate: new Date('2025-04-11'),
    cutOffDate: new Date('2025-04-10'),
    workPeriodStart: new Date('2025-03-28'),
    workPeriodEnd: new Date('2025-04-10'),
    invoiceGenerationDate: new Date('2025-04-12') // Saturday
  },
  {
    id: 'stack-2025-04-02',
    year: 2025,
    month: 4,
    payDate: new Date('2025-04-25'),
    cutOffDate: new Date('2025-04-24'),
    workPeriodStart: new Date('2025-04-11'),
    workPeriodEnd: new Date('2025-04-24'),
    invoiceGenerationDate: new Date('2025-04-26') // Saturday
  },

  // May
  {
    id: 'stack-2025-05-01',
    year: 2025,
    month: 5,
    payDate: new Date('2025-05-09'),
    cutOffDate: new Date('2025-05-08'),
    workPeriodStart: new Date('2025-04-25'),
    workPeriodEnd: new Date('2025-05-08'),
    invoiceGenerationDate: new Date('2025-05-10') // Saturday
  },
  {
    id: 'stack-2025-05-02',
    year: 2025,
    month: 5,
    payDate: new Date('2025-05-23'),
    cutOffDate: new Date('2025-05-22'),
    workPeriodStart: new Date('2025-05-09'),
    workPeriodEnd: new Date('2025-05-22'),
    invoiceGenerationDate: new Date('2025-05-24') // Saturday
  },

  // June
  {
    id: 'stack-2025-06-01',
    year: 2025,
    month: 6,
    payDate: new Date('2025-06-06'),
    cutOffDate: new Date('2025-06-05'),
    workPeriodStart: new Date('2025-05-23'),
    workPeriodEnd: new Date('2025-06-05'),
    invoiceGenerationDate: new Date('2025-06-07') // Saturday
  },
  {
    id: 'stack-2025-06-02',
    year: 2025,
    month: 6,
    payDate: new Date('2025-06-20'),
    cutOffDate: new Date('2025-06-19'),
    workPeriodStart: new Date('2025-06-06'),
    workPeriodEnd: new Date('2025-06-19'),
    invoiceGenerationDate: new Date('2025-06-21') // Saturday
  },

  // July
  {
    id: 'stack-2025-07-01',
    year: 2025,
    month: 7,
    payDate: new Date('2025-07-04'),
    cutOffDate: new Date('2025-07-03'),
    workPeriodStart: new Date('2025-06-20'),
    workPeriodEnd: new Date('2025-07-03'),
    invoiceGenerationDate: new Date('2025-07-05') // Saturday
  },
  {
    id: 'stack-2025-07-02',
    year: 2025,
    month: 7,
    payDate: new Date('2025-07-18'),
    cutOffDate: new Date('2025-07-17'),
    workPeriodStart: new Date('2025-07-04'),
    workPeriodEnd: new Date('2025-07-17'),
    invoiceGenerationDate: new Date('2025-07-19') // Saturday
  },

  // August
  {
    id: 'stack-2025-08-01',
    year: 2025,
    month: 8,
    payDate: new Date('2025-08-01'),
    cutOffDate: new Date('2025-07-31'),
    workPeriodStart: new Date('2025-07-18'),
    workPeriodEnd: new Date('2025-07-31'),
    invoiceGenerationDate: new Date('2025-08-02') // Saturday
  },
  {
    id: 'stack-2025-08-02',
    year: 2025,
    month: 8,
    payDate: new Date('2025-08-15'),
    cutOffDate: new Date('2025-08-14'),
    workPeriodStart: new Date('2025-08-01'),
    workPeriodEnd: new Date('2025-08-14'),
    invoiceGenerationDate: new Date('2025-08-16') // Saturday
  },
  {
    id: 'stack-2025-08-03',
    year: 2025,
    month: 8,
    payDate: new Date('2025-08-29'),
    cutOffDate: new Date('2025-08-28'),
    workPeriodStart: new Date('2025-08-15'),
    workPeriodEnd: new Date('2025-08-28'),
    invoiceGenerationDate: new Date('2025-08-30') // Saturday
  },

  // September
  {
    id: 'stack-2025-09-01',
    year: 2025,
    month: 9,
    payDate: new Date('2025-09-12'),
    cutOffDate: new Date('2025-09-11'),
    workPeriodStart: new Date('2025-08-29'),
    workPeriodEnd: new Date('2025-09-11'),
    invoiceGenerationDate: new Date('2025-09-13') // Saturday
  },
  {
    id: 'stack-2025-09-02',
    year: 2025,
    month: 9,
    payDate: new Date('2025-09-26'),
    cutOffDate: new Date('2025-09-25'),
    workPeriodStart: new Date('2025-09-12'),
    workPeriodEnd: new Date('2025-09-25'),
    invoiceGenerationDate: new Date('2025-09-27') // Saturday
  },

  // October
  {
    id: 'stack-2025-10-01',
    year: 2025,
    month: 10,
    payDate: new Date('2025-10-10'),
    cutOffDate: new Date('2025-10-09'),
    workPeriodStart: new Date('2025-09-26'),
    workPeriodEnd: new Date('2025-10-09'),
    invoiceGenerationDate: new Date('2025-10-11') // Saturday
  },
  {
    id: 'stack-2025-10-02',
    year: 2025,
    month: 10,
    payDate: new Date('2025-10-24'),
    cutOffDate: new Date('2025-10-23'),
    workPeriodStart: new Date('2025-10-10'),
    workPeriodEnd: new Date('2025-10-23'),
    invoiceGenerationDate: new Date('2025-10-25') // Saturday
  },

  // November
  {
    id: 'stack-2025-11-01',
    year: 2025,
    month: 11,
    payDate: new Date('2025-11-07'),
    cutOffDate: new Date('2025-11-06'),
    workPeriodStart: new Date('2025-10-24'),
    workPeriodEnd: new Date('2025-11-06'),
    invoiceGenerationDate: new Date('2025-11-08') // Saturday
  },
  {
    id: 'stack-2025-11-02',
    year: 2025,
    month: 11,
    payDate: new Date('2025-11-21'),
    cutOffDate: new Date('2025-11-20'),
    workPeriodStart: new Date('2025-11-07'),
    workPeriodEnd: new Date('2025-11-20'),
    invoiceGenerationDate: new Date('2025-11-22') // Saturday
  },

  // December
  {
    id: 'stack-2025-12-01',
    year: 2025,
    month: 12,
    payDate: new Date('2025-12-05'),
    cutOffDate: new Date('2025-12-04'),
    workPeriodStart: new Date('2025-11-21'),
    workPeriodEnd: new Date('2025-12-04'),
    invoiceGenerationDate: new Date('2025-12-06') // Saturday
  },
  {
    id: 'stack-2025-12-02',
    year: 2025,
    month: 12,
    payDate: new Date('2025-12-19'),
    cutOffDate: new Date('2025-12-18'),
    workPeriodStart: new Date('2025-12-05'),
    workPeriodEnd: new Date('2025-12-18'),
    invoiceGenerationDate: new Date('2025-12-20') // Saturday
  }
];

export class PayrollCalendarManager {
  private payrollPeriods: PayrollPeriod[];

  constructor(periods: PayrollPeriod[] = STACK_PAYROLL_2025) {
    this.payrollPeriods = periods;
  }

  // Get current payroll period
  getCurrentPeriod(): PayrollPeriod | null {
    const now = new Date();
    return this.payrollPeriods.find(period => 
      now >= period.workPeriodStart && now <= period.workPeriodEnd
    ) || null;
  }

  // Get next payroll period
  getNextPeriod(): PayrollPeriod | null {
    const now = new Date();
    return this.payrollPeriods.find(period => 
      period.workPeriodStart > now
    ) || null;
  }

  // Get period by ID
  getPeriodById(periodId: string): PayrollPeriod | null {
    return this.payrollPeriods.find(period => period.id === periodId) || null;
  }

  // Get periods for a specific month
  getPeriodsForMonth(year: number, month: number): PayrollPeriod[] {
    return this.payrollPeriods.filter(period => 
      period.year === year && period.month === month
    );
  }

  // Get all periods that need invoice generation on a specific date
  getPeriodsForInvoiceGeneration(date: Date): PayrollPeriod[] {
    const dateStr = date.toDateString();
    return this.payrollPeriods.filter(period => 
      period.invoiceGenerationDate.toDateString() === dateStr
    );
  }

  // Calculate work days in a period (excluding weekends and holidays)
  calculateWorkDays(period: PayrollPeriod): number {
    let workDays = 0;
    const currentDate = new Date(period.workPeriodStart);
    
    while (currentDate <= period.workPeriodEnd) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Saturday or Sunday
        workDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workDays;
  }

  // Get notification schedule for a period
  getNotificationSchedule(period: PayrollPeriod): NotificationSchedule[] {
    const notifications: NotificationSchedule[] = [];
    
    // Saturday morning - Invoice created
    notifications.push({
      type: 'invoice_created',
      scheduledDate: new Date(period.invoiceGenerationDate.getTime() + 8 * 60 * 60 * 1000), // 8 AM
      sent: false,
      invoiceId: '', // Will be filled when invoice is created
      contractorId: '' // Will be filled when invoice is created
    });

    // Tuesday reminder
    const tuesday = new Date(period.invoiceGenerationDate);
    tuesday.setDate(tuesday.getDate() + 3);
    notifications.push({
      type: 'reminder_tuesday',
      scheduledDate: new Date(tuesday.getTime() + 9 * 60 * 60 * 1000), // 9 AM Tuesday
      sent: false,
      invoiceId: '',
      contractorId: ''
    });

    // Thursday urgent
    const thursday = new Date(period.invoiceGenerationDate);
    thursday.setDate(thursday.getDate() + 5);
    notifications.push({
      type: 'urgent_thursday',
      scheduledDate: new Date(thursday.getTime() + 10 * 60 * 60 * 1000), // 10 AM Thursday
      sent: false,
      invoiceId: '',
      contractorId: ''
    });

    // Friday final notice
    const friday = new Date(period.invoiceGenerationDate);
    friday.setDate(friday.getDate() + 6);
    notifications.push({
      type: 'final_friday',
      scheduledDate: new Date(friday.getTime() + 8 * 60 * 60 * 1000), // 8 AM Friday
      sent: false,
      invoiceId: '',
      contractorId: ''
    });

    return notifications;
  }

  // Check if today is an invoice generation day
  isInvoiceGenerationDay(date: Date = new Date()): boolean {
    const today = date.toDateString();
    return this.payrollPeriods.some(period => 
      period.invoiceGenerationDate.toDateString() === today
    );
  }

  // Get upcoming deadlines (next 7 days)
  getUpcomingDeadlines(date: Date = new Date()): PayrollPeriod[] {
    const oneWeekFromNow = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.payrollPeriods.filter(period => 
      period.cutOffDate >= date && period.cutOffDate <= oneWeekFromNow
    );
  }

  // Format period for display
  formatPeriod(period: PayrollPeriod): string {
    const start = period.workPeriodStart.toLocaleDateString('en-CA', { 
      month: 'short', 
      day: 'numeric' 
    });
    const end = period.workPeriodEnd.toLocaleDateString('en-CA', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${start} - ${end}`;
  }

  // Get year summary
  getYearSummary(year: number = 2025) {
    const yearPeriods = this.payrollPeriods.filter(p => p.year === year);
    
    return {
      totalPeriods: yearPeriods.length,
      totalWorkDays: yearPeriods.reduce((sum, period) => sum + this.calculateWorkDays(period), 0),
      firstPeriod: yearPeriods[0],
      lastPeriod: yearPeriods[yearPeriods.length - 1],
      monthlyBreakdown: this.getMonthlyBreakdown(year)
    };
  }

  // Get monthly breakdown
  private getMonthlyBreakdown(year: number) {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    return months.map(month => ({
      month,
      periods: this.getPeriodsForMonth(year, month).length,
      workDays: this.getPeriodsForMonth(year, month)
        .reduce((sum, period) => sum + this.calculateWorkDays(period), 0)
    }));
  }
}

// Default instance
export const stackPayrollCalendar = new PayrollCalendarManager();

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric'
  });
};

export const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (date: Date): boolean => {
  return date < new Date();
}; 