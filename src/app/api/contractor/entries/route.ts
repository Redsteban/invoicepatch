import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invoiceId = searchParams.get('invoiceId')

    console.log('=== CONTRACTOR ENTRIES GET API CALLED ===')
    console.log('Query params:', { invoiceId })

    if (!invoiceId) {
      console.log('Validation failed: missing invoiceId')
      return NextResponse.json(
        { success: false, error: 'invoiceId is required' },
        { status: 400 }
      )
    }

    // Fetch daily entries for the trial invoice
    const { data: entries, error } = await supabaseAdmin
      .from('daily_entries')
      .select('*')
      .eq('trial_invoice_id', invoiceId)
      .order('entry_date', { ascending: true })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch entries' },
        { status: 500 }
      )
    }

    // Transform entries to match frontend interface
    const transformedEntries = (entries || []).map(entry => ({
      id: entry.id,
      entry_date: entry.entry_date,
      worked: entry.worked,
      day_rate_actual: entry.day_rate_used,
      truck_used: entry.truck_used,
      truck_rate_actual: entry.truck_rate_used,
      travel_kms_actual: entry.travel_kms_actual,
      subsistence_actual: entry.subsistence_actual,
      hours_worked: entry.hours_worked || 8,
      notes: entry.notes,
      weather_conditions: entry.weather_conditions || 'clear'
    }))

    const responseData = {
      success: true,
      entries: transformedEntries
    }

    console.log('Entries GET API returning:', responseData)
    
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('=== CONTRACTOR ENTRIES GET API ERROR ===', error)
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== CONTRACTOR ENTRIES POST API CALLED ===')
    console.log('Request body:', body)

    const {
      invoiceId,
      entryDate,
      worked,
      dayRateActual,
      truckUsed,
      truckRateActual,
      travelKms,
      subsistenceActual,
      hoursWorked,
      notes,
      weatherConditions
    } = body

    // Validation
    if (!invoiceId || !entryDate) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { success: false, error: 'invoiceId and entryDate are required' },
        { status: 400 }
      )
    }

    // Check if entry already exists for this date
    const { data: existingEntry } = await supabaseAdmin
      .from('daily_entries')
      .select('id')
      .eq('trial_invoice_id', invoiceId)
      .eq('entry_date', entryDate)
      .single()

    let result
    const entryData = {
      trial_invoice_id: invoiceId,
      entry_date: entryDate,
      worked: worked || false,
      day_rate_used: worked ? (dayRateActual || 0) : 0,
      truck_used: worked ? (truckUsed || false) : false,
      truck_rate_used: (worked && truckUsed) ? (truckRateActual || 0) : 0,
      travel_kms_actual: worked ? (travelKms || 0) : 0,
      subsistence_actual: worked ? (subsistenceActual || 0) : 0,
      hours_worked: worked ? (hoursWorked || 8) : 0,
      notes: notes || null,
      weather_conditions: weatherConditions || 'clear'
    }

    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabaseAdmin
        .from('daily_entries')
        .update(entryData)
        .eq('id', existingEntry.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating entry:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to update entry' },
          { status: 500 }
        )
      }
      
      result = data
      console.log('Updated existing entry:', result)
    } else {
      // Insert new entry
      const { data, error } = await supabaseAdmin
        .from('daily_entries')
        .insert(entryData)
        .select()
        .single()

      if (error) {
        console.error('Error inserting entry:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to insert entry' },
          { status: 500 }
        )
      }
      
      result = data
      console.log('Inserted new entry:', result)
    }

    // Update trial invoice totals (optional - could be done in a trigger)
    // For now, we'll let the dashboard API calculate these on-demand

    const responseData = {
      success: true,
      entry: {
        id: result.id,
        entry_date: result.entry_date,
        worked: result.worked,
        day_rate_actual: result.day_rate_used,
        truck_used: result.truck_used,
        truck_rate_actual: result.truck_rate_used,
        travel_kms_actual: result.travel_kms_actual,
        subsistence_actual: result.subsistence_actual,
        hours_worked: result.hours_worked,
        notes: result.notes,
        weather_conditions: result.weather_conditions
      }
    }

    console.log('Entries POST API returning:', responseData)
    
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('=== CONTRACTOR ENTRIES POST API ERROR ===', error)
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { status: 500 }
    )
  }
} 