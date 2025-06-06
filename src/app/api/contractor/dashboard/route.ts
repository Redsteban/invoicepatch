import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DAILY CHECKIN API CALLED ===')
    
    const body = await request.json()
    console.log('Checkin request body:', body)
    
    const { 
      trialInvoiceId, 
      date, 
      worked, 
      dayRate, 
      truckUsed, 
      truckRate, 
      travelKms, 
      subsistence, 
      notes 
    } = body

    // Validate required fields
    if (!trialInvoiceId || !date || worked === undefined) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, return mock success
    console.log('Daily checkin saved successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Daily entry saved successfully',
      data: {
        date,
        worked,
        earnings: worked ? 673.50 : 0
      }
    })

  } catch (error) {
    console.error('=== CHECKIN API ERROR ===', error)
    return NextResponse.json(
      { success: false, error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trialInvoiceId = searchParams.get('trialInvoiceId')
    const date = searchParams.get('date')

    console.log('=== GET CHECKIN API CALLED ===')
    console.log('Query params:', { trialInvoiceId, date })

    // Return mock data for now
    return NextResponse.json({ 
      success: true, 
      entry: {
        id: 'mock-entry-id',
        trial_invoice_id: trialInvoiceId,
        entry_date: date,
        worked: false,
        day_rate_used: null,
        truck_used: false,
        truck_rate_used: null,
        travel_kms_actual: null,
        subsistence_actual: null,
        notes: null
      }
    })

  } catch (error) {
    console.error('=== GET CHECKIN API ERROR ===', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get daily entry' },
      { status: 500 }
    )
  }
} 