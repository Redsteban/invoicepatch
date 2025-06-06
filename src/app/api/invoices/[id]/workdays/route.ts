import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id

    const { data: workDays, error } = await supabaseAdmin
      .from('work_days')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('work_date', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, workDays })
  } catch (error: any) {
    console.error('Get work days error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    const body = await request.json()
    
    const {
      workDate,
      dayRateUsed,
      truckUsed,
      truckRateUsed,
      travelKms,
      subsistenceUsed,
      notes
    } = body

    const { data: workDay, error } = await supabaseAdmin
      .from('work_days')
      .insert([{
        invoice_id: invoiceId,
        work_date: workDate,
        day_rate_used: dayRateUsed,
        truck_used: truckUsed,
        truck_rate_used: truckRateUsed,
        travel_kms: travelKms,
        subsistence_used: subsistenceUsed,
        notes: notes
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, workDay })
  } catch (error: any) {
    console.error('Create work day error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    const body = await request.json()
    
    const {
      workDayId,
      workDate,
      dayRateUsed,
      truckUsed,
      truckRateUsed,
      travelKms,
      subsistenceUsed,
      notes
    } = body

    const { data: workDay, error } = await supabaseAdmin
      .from('work_days')
      .update({
        work_date: workDate,
        day_rate_used: dayRateUsed,
        truck_used: truckUsed,
        truck_rate_used: truckRateUsed,
        travel_kms: travelKms,
        subsistence_used: subsistenceUsed,
        notes: notes
      })
      .eq('id', workDayId)
      .eq('invoice_id', invoiceId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, workDay })
  } catch (error: any) {
    console.error('Update work day error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    const { searchParams } = new URL(request.url)
    const workDayId = searchParams.get('workDayId')

    if (!workDayId) {
      return NextResponse.json(
        { success: false, error: 'workDayId is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('work_days')
      .delete()
      .eq('id', workDayId)
      .eq('invoice_id', invoiceId)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Work day deleted successfully' })
  } catch (error: any) {
    console.error('Delete work day error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
} 