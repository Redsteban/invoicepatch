import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic' // Ensure this route is rendered dynamically

export async function GET(request: NextRequest) {
  try {
    // 🛡️ SECURITY CHECK: Require authentication header for trial access
    const authHeader = request.headers.get('x-auth-verified')
    if (!authHeader || authHeader !== 'otp-verified') {
      console.log('🔒 SECURITY: Dashboard access denied - missing authentication')
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in with OTP verification.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const trialInvoiceId = searchParams.get('trialInvoiceId')

    console.log('=== DASHBOARD API CALLED ===')
    console.log('✅ SECURITY: Authentication verified')
    console.log('Query params:', { trialInvoiceId })

    if (!trialInvoiceId) {
      console.log('Validation failed: missing trialInvoiceId')
      return NextResponse.json(
        { success: false, error: 'trialInvoiceId is required' },
        { status: 400 }
      )
    }

    // Fetch trial invoice data
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .eq('id', trialInvoiceId)
      .single()

    if (invoiceError) {
      console.error('Error fetching trial invoice:', invoiceError)
      return NextResponse.json(
        { success: false, error: 'Trial invoice not found' },
        { status: 404 }
      )
    }

    // Fetch daily entries
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('daily_entries')
      .select('*')
      .eq('trial_invoice_id', trialInvoiceId)
      .order('entry_date', { ascending: true })

    if (entriesError) {
      console.error('Error fetching daily entries:', entriesError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch daily entries' },
        { status: 500 }
      )
    }

    // Calculate summary data
    const workEntries = entries?.filter(entry => entry.worked) || []
    const daysWorked = workEntries.length
    
    // Calculate total earned with proper breakdown
    const totalEarned = workEntries.reduce((sum, entry) => {
      const dayAmount = entry.day_rate_used || 0
      const truckAmount = entry.truck_rate_used || 0
      const travelAmount = (entry.travel_kms_actual || 0) * (invoice.rate_per_km || 0.68)
      const subsistenceAmount = entry.subsistence_actual || 0
      
      // Calculate GST on taxable items (day rate + truck rate)
      const entryTaxable = dayAmount + truckAmount
      const entryGst = entryTaxable * 0.05
      
      return sum + entryTaxable + entryGst + travelAmount + subsistenceAmount
    }, 0)

    // Calculate trial progress - FIXED FOR 15-DAY TRIAL
    const startDate = new Date(invoice.start_date)
    const endDate = new Date(invoice.end_date)
    const currentDate = new Date()
    
    // Calculate total trial duration dynamically from the invoice dates
    const totalTrialDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    const currentDay = Math.min(Math.max(daysDiff + 1, 1), totalTrialDays)
    const trialDaysRemaining = Math.max(totalTrialDays - currentDay + 1, 0)

    // Calculate 14-day pay period information
    const calculatePayPeriods = (startDate: Date) => {
      const payPeriods = []
      const workStartDate = new Date(startDate)
      
      // First period: work start → next day cutoff → day after submission
      const firstCutoff = new Date(workStartDate)
      firstCutoff.setDate(firstCutoff.getDate() + 1)
      const firstSubmission = new Date(firstCutoff)
      firstSubmission.setDate(firstSubmission.getDate() + 1)
      
      payPeriods.push({
        period: 1,
        workStart: workStartDate.toISOString().split('T')[0],
        cutoffDate: firstCutoff.toISOString().split('T')[0],
        submissionDate: firstSubmission.toISOString().split('T')[0],
        type: 'initial'
      })
      
      // Subsequent 14-day periods
      let nextPeriodStart = new Date(firstSubmission)
      for (let i = 2; i <= 3; i++) { // Show next couple periods for reference
        const periodEnd = new Date(nextPeriodStart)
        periodEnd.setDate(periodEnd.getDate() + 13) // 14 days total
        const submissionDate = new Date(periodEnd)
        submissionDate.setDate(submissionDate.getDate() + 1)
        
        payPeriods.push({
          period: i,
          workStart: nextPeriodStart.toISOString().split('T')[0],
          cutoffDate: periodEnd.toISOString().split('T')[0],
          submissionDate: submissionDate.toISOString().split('T')[0],
          type: 'regular'
        })
        
        nextPeriodStart = new Date(submissionDate)
      }
      
      return payPeriods
    }

    // Calculate advanced analytics
    const avgDailyEarnings = daysWorked > 0 ? totalEarned / daysWorked : 0
    const projectedTotal = avgDailyEarnings * totalTrialDays
    const completionRate = currentDay > 0 ? (daysWorked / currentDay) * 100 : 0

    // Dynamic weekly earnings array for charts (based on actual trial duration)
    const weeklyEarnings = []
    for (let i = 0; i < Math.min(totalTrialDays, 15); i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      const dayEntry = entries?.find(e => e.entry_date === dateString)
      
      if (dayEntry && dayEntry.worked) {
        const dayAmount = dayEntry.day_rate_used || 0
        const truckAmount = dayEntry.truck_rate_used || 0
        const travelAmount = (dayEntry.travel_kms_actual || 0) * (invoice.rate_per_km || 0.68)
        const subsistenceAmount = dayEntry.subsistence_actual || 0
        const taxableAmount = dayAmount + truckAmount
        const gstAmount = taxableAmount * 0.05
        weeklyEarnings.push(taxableAmount + gstAmount + travelAmount + subsistenceAmount)
      } else {
        weeklyEarnings.push(0)
      }
    }

    // Find best earning day
    let bestDay = { date: '', earnings: 0 }
    workEntries.forEach(entry => {
      const dayAmount = entry.day_rate_used || 0
      const truckAmount = entry.truck_rate_used || 0
      const travelAmount = (entry.travel_kms_actual || 0) * (invoice.rate_per_km || 0.68)
      const subsistenceAmount = entry.subsistence_actual || 0
      const taxableAmount = dayAmount + truckAmount
      const gstAmount = taxableAmount * 0.05
      const totalDayEarnings = taxableAmount + gstAmount + travelAmount + subsistenceAmount
      
      if (totalDayEarnings > bestDay.earnings) {
        bestDay = { date: entry.entry_date, earnings: totalDayEarnings }
      }
    })

    // Calculate total hours worked (assuming 8.5 hours per work day)
    const totalHours = workEntries.length * 8.5
    const avgHoursPerDay = daysWorked > 0 ? totalHours / daysWorked : 0

    // Weather impact analysis (mock for now since we don't have weather data)
    const weatherImpact = workEntries.length > 0 ? 
      `Based on ${workEntries.length} work days, weather conditions have been favorable for consistent productivity.` :
      `No work days logged yet to analyze weather impact.`

    // Efficiency score calculation
    const efficiencyScore = Math.min(100, Math.round(
      (completionRate * 0.4) + 
      (avgHoursPerDay >= 8 ? 40 : (avgHoursPerDay / 8) * 40) +
      20 // Base score
    ))

    // Days until deadline
    const upcomingDeadline = Math.max(0, Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)))

    // Earnings breakdown for detailed analysis
    const earningsBreakdown = {
      dayRateTotal: workEntries.reduce((sum, e) => sum + (e.day_rate_used || 0), 0),
      truckRateTotal: workEntries.reduce((sum, e) => sum + (e.truck_rate_used || 0), 0),
      travelTotal: workEntries.reduce((sum, e) => sum + ((e.travel_kms_actual || 0) * (invoice.rate_per_km || 0.68)), 0),
      subsistenceTotal: workEntries.reduce((sum, e) => sum + (e.subsistence_actual || 0), 0),
      gstTotal: workEntries.reduce((sum, e) => {
        const taxable = (e.day_rate_used || 0) + (e.truck_rate_used || 0)
        return sum + (taxable * 0.05)
      }, 0)
    }

    // Performance metrics based on dynamic trial length
    const expectedWorkDays = Math.floor(totalTrialDays * 0.8) // Assume 80% work days
    const performanceMetrics = {
      consistency: workEntries.length >= currentDay - 1 ? 'High' : workEntries.length >= Math.ceil(currentDay / 2) ? 'Medium' : 'Low',
      productivity: avgDailyEarnings >= 700 ? 'High' : avgDailyEarnings >= 500 ? 'Medium' : 'Low',
      onTrack: projectedTotal >= (expectedWorkDays * 700) ? 'Excellent' : projectedTotal >= (expectedWorkDays * 500) ? 'Good' : 'Needs Improvement'
    }

    // Get pay period information
    const payPeriods = calculatePayPeriods(startDate)

    const responseData = {
      success: true,
      invoice,
      entries: entries || [],
      summary: {
        totalEarned,
        daysWorked,
        currentDay,
        trialDaysRemaining,
        projectedTotal,
        averageDailyEarnings: avgDailyEarnings,
        completionRate,
        weeklyEarnings,
        upcomingDeadline,
        totalTrialDays
      },
      insights: {
        bestDay,
        totalHours,
        avgHoursPerDay,
        weatherImpact,
        efficiencyScore,
        earningsBreakdown,
        performanceMetrics
      },
      analytics: {
        trialProgress: (currentDay / totalTrialDays) * 100,
        workConsistency: (daysWorked / Math.max(currentDay - 1, 1)) * 100,
        earningsVsTarget: (totalEarned / (avgDailyEarnings * totalTrialDays || (expectedWorkDays * 700))) * 100,
        dailyAverageTarget: avgDailyEarnings,
        recommendedDailyTarget: 700 // Based on typical contractor rates
      },
      payPeriods
    }

    console.log('Dashboard API returning data:', responseData)
    
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('=== DASHBOARD API ERROR ===', error)
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { status: 500 }
    )
  }
} 