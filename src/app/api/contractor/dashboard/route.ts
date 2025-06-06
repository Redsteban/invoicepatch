import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trialInvoiceId = searchParams.get('trialInvoiceId')

    console.log('=== DASHBOARD API CALLED ===')
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
    
    // Calculate total earned
    const totalEarned = workEntries.reduce((sum, entry) => {
      const dayAmount = entry.day_rate_used || 0
      const truckAmount = entry.truck_rate_used || 0
      const travelAmount = (entry.travel_kms_actual || 0) * 0.68
      const subsistenceAmount = entry.subsistence_actual || 0
      
      const entryTaxable = dayAmount + truckAmount
      const entryGst = entryTaxable * 0.05
      
      return sum + entryTaxable + entryGst + travelAmount + subsistenceAmount
    }, 0)

    // Calculate trial progress
    const startDate = new Date(invoice.start_date)
    const currentDate = new Date()
    const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    const currentDay = Math.min(Math.max(daysDiff + 1, 1), 5)
    const trialDaysRemaining = Math.max(5 - currentDay, 0)

    // Calculate projected total (if we have work days to average from)
    const avgDailyEarnings = daysWorked > 0 ? totalEarned / daysWorked : 0
    const projectedTotal = avgDailyEarnings * 5

    const responseData = {
      success: true,
      invoice,
      entries: entries || [],
      summary: {
        totalEarned,
        daysWorked,
        currentDay,
        trialDaysRemaining,
        projectedTotal
      }
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