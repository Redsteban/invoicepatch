export interface PayPeriod {
  periodNumber: number
  startDate: Date
  endDate: Date
  isPartial: boolean
  workingDays: number
  totalDays: number
}

export interface PayrollSchedule {
  contractStartDate: Date
  firstPeriodEnd: Date
  periods: PayPeriod[]
}

// Helper function to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Helper function to calculate period details
function calculatePeriod(
  startDate: Date, 
  endDate: Date, 
  periodNumber: number, 
  isPartial: boolean
): PayPeriod {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  
  // For simplicity, assume 5 working days per week (Mon-Fri)
  // In a real application, this would consider actual work schedule
  const workingDays = Math.ceil(totalDays * (5/7))
  
  return {
    periodNumber,
    startDate,
    endDate,
    isPartial,
    workingDays,
    totalDays
  }
}

export function calculatePayrollSchedule(
  startDate: string,
  firstPeriodEnd: string,
  numberOfPeriods: number = 26
): PayrollSchedule {
  const start = new Date(startDate)
  const firstEnd = new Date(firstPeriodEnd)
  const periods: PayPeriod[] = []
  
  // Calculate first period (may be partial)
  const firstPeriod = calculatePeriod(start, firstEnd, 1, true)
  periods.push(firstPeriod)
  
  // Calculate subsequent 14-day periods
  let currentPeriodStart = addDays(firstEnd, 1)
  
  for (let i = 2; i <= numberOfPeriods; i++) {
    const periodEnd = addDays(currentPeriodStart, 13)
    const period = calculatePeriod(currentPeriodStart, periodEnd, i, false)
    periods.push(period)
    currentPeriodStart = addDays(periodEnd, 1)
  }
  
  return {
    contractStartDate: start,
    firstPeriodEnd: firstEnd,
    periods
  }
} 