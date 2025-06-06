import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trialInvoiceId = searchParams.get('trialInvoiceId')

    if (!trialInvoiceId) {
      return NextResponse.json(
        { success: false, error: 'Trial invoice ID required' },
        { status: 400 }
      )
    }

    // Get trial invoice details
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .eq('id', trialInvoiceId)
      .single()

    if (invoiceError) {
      console.error('Invoice error:', invoiceError)
      throw invoiceError
    }

    // Get all daily entries for this trial
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from('daily_entries')
      .select('*')
      .eq('trial_invoice_id', trialInvoiceId)
      .order('entry_date', { ascending: true })

    if (entriesError) {
      console.error('Entries error:', entriesError)
      throw entriesError
    }

    // Calculate 5-day trial summary
    const startDate = new Date(invoice.start_date)
    const currentDate = new Date()
    const currentDay = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const trialDaysRemaining = Math.max(0, 5 - currentDay)

    // Calculate earnings
    const totalEarned = entries.reduce((sum, entry) => {
      if (!entry.worked) return sum
      
      const dayAmount = entry.day_rate_used || 0
      const truckAmount = entry.truck_rate_used || 0
      const travelAmount = (entry.travel_kms_actual || 0) * 0.68 // CRA mileage rate
      const subsistenceAmount = entry.subsistence_actual || 0
      
      const taxableAmount = dayAmount + truckAmount
      const gst = taxableAmount * 0.05
      
      return sum + taxableAmount + gst + travelAmount + subsistenceAmount
    }, 0)

    const daysWorked = entries.filter(entry => entry.worked).length
    
    // Project total for 5 days based on current rate
    const avgDailyEarning = daysWorked > 0 ? totalEarned / daysWorked : 673.50
    const projectedTotal = avgDailyEarning * 5

    return NextResponse.json({ 
      success: true,
      invoice,
      entries,
      summary: {
        totalEarned,
        daysWorked,
        currentDay: Math.min(currentDay, 5),
        trialDaysRemaining,
        projectedTotal
      }
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
} 