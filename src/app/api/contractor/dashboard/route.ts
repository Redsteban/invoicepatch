import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trialInvoiceId = searchParams.get('trialInvoiceId')

    if (!trialInvoiceId) {
      return NextResponse.json(
        { success: false, error: 'Trial invoice ID is required' },
        { status: 400 }
      )
    }

    // Fetch trial invoice details
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .eq('id', trialInvoiceId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { success: false, error: 'Trial invoice not found' },
        { status: 404 }
      )
    }

    // Fetch all daily entries for this trial
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('daily_entries')
      .select('*')
      .eq('trial_invoice_id', trialInvoiceId)
      .order('entry_date', { ascending: true })

    if (entriesError) {
      console.error('Error fetching entries:', entriesError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch daily entries' },
        { status: 500 }
      )
    }

    // Calculate summary metrics
    const workedEntries = (entries || []).filter(entry => entry.worked === true)
    const daysWorked = workedEntries.length
    
    // Calculate total earnings (day rate + truck + travel + subsistence + GST)
    const baseEarningsPerDay = 450 + 150 + (45 * 0.68) + 75 // $675.60 per day
    const taxablePerDay = 450 + 150 // $600 taxable
    const gstPerDay = taxablePerDay * 0.05 // $30 GST
    const totalPerDay = baseEarningsPerDay + gstPerDay // $705.60 total with GST

    const totalEarned = daysWorked * totalPerDay
    const projectedTotal = 5 * totalPerDay // Full 5-day projection

    // Calculate current day and remaining days
    const startDate = new Date(invoice.start_date)
    const today = new Date()
    const diffTime = today.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const currentDay = Math.max(1, Math.min(diffDays + 1, 5))
    const trialDaysRemaining = Math.max(0, 5 - currentDay + 1)

    const summary = {
      totalEarned: Math.round(totalEarned * 100) / 100,
      daysWorked,
      currentDay,
      trialDaysRemaining,
      projectedTotal: Math.round(projectedTotal * 100) / 100
    }

    return NextResponse.json({
      success: true,
      invoice,
      entries: entries || [],
      summary
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
} 