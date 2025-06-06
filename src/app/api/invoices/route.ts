import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'temp-user'
    
    const { data: invoices, error } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('period_start', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, invoices })
  } catch (error: any) {
    console.error('Get invoices error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      invoiceNumber,
      periodStart,
      periodEnd,
      submissionDeadline,
      ticketNumber,
      location,
      company,
      dayRate,
      truckRate,
      travelRate,
      subsistenceRate,
      workDays
    } = body

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert([{
        user_id: 'temp-user',
        invoice_number: invoiceNumber,
        period_start: periodStart,
        period_end: periodEnd,
        submission_deadline: submissionDeadline,
        ticket_number: ticketNumber,
        location: location,
        company: company,
        day_rate: dayRate,
        truck_rate: truckRate,
        travel_rate_per_km: travelRate,
        subsistence_rate: subsistenceRate,
        work_days: workDays
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, invoice })
  } catch (error: any) {
    console.error('Create invoice error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
} 