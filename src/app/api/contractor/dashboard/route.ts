import { NextRequest, NextResponse } from 'next/server'

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

    // Mock data with the structure the dashboard component expects
    const mockData = {
      success: true,
      invoice: {
        id: trialInvoiceId,
        sequence_number: 'INV-001',
        contractor_name: 'Test Contractor',
        start_date: '2024-01-15',
        end_date: '2024-01-19'
      },
      entries: [
        {
          id: 'entry-1',
          entry_date: '2024-01-15',
          worked: true,
          day_rate_used: 450,
          truck_used: true,
          truck_rate_used: 150,
          travel_kms_actual: 45,
          subsistence_actual: 75,
          total_earnings: 673.50
        },
        {
          id: 'entry-2', 
          entry_date: '2024-01-16',
          worked: true,
          day_rate_used: 450,
          truck_used: true,
          truck_rate_used: 150,
          travel_kms_actual: 45,
          subsistence_actual: 75,
          total_earnings: 673.50
        }
      ],
      summary: {
        totalEarned: 1347.00,
        daysWorked: 2,
        currentDay: 3,
        trialDaysRemaining: 2,
        projectedTotal: 3367.50
      }
    }

    console.log('Dashboard API returning mock data:', mockData)
    
    return NextResponse.json(mockData)

  } catch (error) {
    console.error('=== DASHBOARD API ERROR ===', error)
    return NextResponse.json(
      { success: false, error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 