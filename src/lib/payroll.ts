export interface PayPeriod {
  periodNumber: number
  startDate: Date
  endDate: Date
  submissionDeadline: Date
  paymentDate: Date
  isPartialPeriod: boolean
  daysInPeriod: number
}

export interface PayrollSchedule {
  contractStartDate: Date
  firstPeriodEnd: Date
  periods: PayPeriod[]
}

export function getCurrentPayPeriod(schedule: PayrollSchedule): PayPeriod | null {
  const today = new Date()
  return schedule.periods.find(period => 
    today >= period.startDate && today <= period.endDate
  ) || null
}

export function getUpcomingDeadlines(
  schedule: PayrollSchedule, 
  daysAhead: number = 30
): PayPeriod[] {
  const today = new Date()
  const futureDate = addDays(today, daysAhead)
  
  return schedule.periods.filter(period =>
    period.submissionDeadline >= today && period.submissionDeadline <= futureDate
  )
}

export function calculatePayrollSchedule(
  contractStartDate: string,
  numberOfPeriods: number = 26 // One year of bi-weekly periods
): PayrollSchedule {
  const startDate = new Date(contractStartDate)
  const periods: PayPeriod[] = []
  
  const firstPeriodEnd = findNextPeriodEnd(startDate)
  
  const firstPeriod = calculatePeriod(
    startDate,
    firstPeriodEnd,
    1,
    true // Check if partial
  )
  periods.push(firstPeriod)
  
  let currentPeriodStart = addDays(firstPeriodEnd, 1)
  
  for (let i = 2; i <= numberOfPeriods; i++) {
    const periodEnd = addDays(currentPeriodStart, 13) // 14-day period
    const period = calculatePeriod(
      currentPeriodStart,
      periodEnd,
      i,
      false // Full period
    )
    periods.push(period)
    currentPeriodStart = addDays(periodEnd, 1)
  }
  
  return {
    contractStartDate: startDate,
    firstPeriodEnd,
    periods
  }
}

function calculatePeriod(
  startDate: Date,
  endDate: Date,
  periodNumber: number,
  checkPartial: boolean
): PayPeriod {
  const daysInPeriod = differenceInDays(endDate, startDate) + 1
  const isPartialPeriod = checkPartial && daysInPeriod < 14
  
  const submissionDeadline = addDays(endDate, 1)
  
  const paymentDate = getNextFriday(endDate)
  
  return {
    periodNumber,
    startDate,
    endDate,
    submissionDeadline,
    paymentDate,
    isPartialPeriod,
    daysInPeriod
  }
}

function findNextPeriodEnd(startDate: Date): Date {
  const dayOfWeek = startDate.getDay()
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7
  
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    return addDays(startDate, 13 + ((4 - dayOfWeek + 7) % 7))
  } else {
    return addDays(startDate, daysUntilThursday)
  }
}

function getNextFriday(date: Date): Date {
  const dayOfWeek = date.getDay()
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7
  return addDays(date, daysUntilFriday)
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function formatPeriodDates(period: PayPeriod): string {
  const startStr = period.startDate.toLocaleDateString('en-CA')
  const endStr = period.endDate.toLocaleDateString('en-CA')
  const submissionStr = period.submissionDeadline.toLocaleDateString('en-CA')
  const paymentStr = period.paymentDate.toLocaleDateString('en-CA')
  
  return `Period ${period.periodNumber}: ${startStr} - ${endStr} (${period.daysInPeriod} days)
    Submit by: ${submissionStr}
    Payment: ${paymentStr}${period.isPartialPeriod ? ' (Partial Period)' : ''}`
}

export function isStatutoryHoliday(date: Date): boolean {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const holidays = [
    { month: 1, day: 1 }, // New Year's Day
    { month: 7, day: 1 }, // Canada Day
    { month: 12, day: 25 }, // Christmas Day
    { month: 12, day: 26 }, // Boxing Day
  ]
  
  return holidays.some(holiday => 
    holiday.month === month && holiday.day === day
  )
}

export function adjustPaymentDate(date: Date): Date {
  let adjustedDate = new Date(date)
  
  while (adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6) {
    adjustedDate = addDays(adjustedDate, 1)
  }
  
  while (isStatutoryHoliday(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, 1)
    while (adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6) {
      adjustedDate = addDays(adjustedDate, 1)
    }
  }
  
  return adjustedDate
} 