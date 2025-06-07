import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')

    console.log('=== CONTRACTOR INVOICES API CALLED ===')
    console.log('Query params:', { userEmail })

    // Input validation
    if (!userEmail) {
      console.log('Validation failed: missing userEmail')
      return NextResponse.json(
        { success: false, error: 'userEmail is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      console.log('Validation failed: invalid email format')
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Fetch trial invoices for the user with better error handling
    const { data: trialInvoices, error: trialError } = await supabaseAdmin
      .from('trial_invoices')
      .select('*')
      .eq('contractor_email', userEmail)
      .order('created_at', { ascending: false })

    if (trialError) {
      console.error('Error fetching trial invoices:', trialError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch trial invoices',
          details: trialError.message 
        },
        { status: 500 }
      )
    }

    // Try to fetch regular invoices - handle both user_id and email cases
    let regularInvoices = []
    try {
      // First try with email as user_id (backward compatibility)
      const { data: invoicesByEmail, error: emailError } = await supabaseAdmin
        .from('invoices')
        .select('*')
        .eq('user_id', userEmail)
        .order('created_at', { ascending: false })

      if (!emailError && invoicesByEmail) {
        regularInvoices = invoicesByEmail
      } else {
        // Try to find user by email in profiles table if it exists
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single()

        if (profile) {
          const { data: invoicesByProfile } = await supabaseAdmin
            .from('invoices')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })

          regularInvoices = invoicesByProfile || []
        }
      }
    } catch (profileError) {
      // If profiles table doesn't exist or other error, continue with empty regular invoices
      console.log('Could not fetch regular invoices, continuing with trial invoices only')
      regularInvoices = []
    }

    // Get daily entries for each trial invoice to calculate real totals
    const transformedTrialInvoices = await Promise.all(
      (trialInvoices || []).map(async (trial) => {
        try {
          // Get daily entries for this trial
          const { data: entries, error: entriesError } = await supabaseAdmin
            .from('daily_entries')
            .select('*')
            .eq('trial_invoice_id', trial.id)

          if (entriesError) {
            console.warn(`Failed to fetch entries for trial ${trial.id}:`, entriesError)
            // Continue with zero values if entries can't be fetched
          }

          // Calculate totals from daily entries
          const workEntries = entries || []
          const workedDays = workEntries.filter(entry => entry.worked).length
          
          let totalEarned = 0
          workEntries.forEach(entry => {
            if (entry.worked) {
              // TAXABLE AMOUNTS (subject to 5% GST)
              const dayRateAmount = entry.day_rate_used || 0
              const truckRateAmount = entry.truck_used ? (entry.truck_rate_used || 0) : 0
              const taxableSubtotal = dayRateAmount + truckRateAmount
              
              // TAX-FREE REIMBURSEMENTS (not subject to GST)
              const travelReimbursement = (entry.travel_kms_actual || 0) * 0.68
              const subsistenceReimbursement = entry.subsistence_actual || 0
              const nonTaxableSubtotal = travelReimbursement + subsistenceReimbursement
              
              // Calculate GST (5% on taxable services only)
              const gstAmount = taxableSubtotal * 0.05
              
              // Calculate total: taxable + GST + tax-free reimbursements
              const entryTotal = taxableSubtotal + gstAmount + nonTaxableSubtotal
              totalEarned += entryTotal
            }
          })

          return {
            id: trial.id,
            invoice_number: `TRIAL-${trial.sequence_number}`,
            period_start: trial.start_date,
            period_end: trial.end_date,
            submission_deadline: trial.end_date,
            status: trial.status || 'active',
            company: trial.company,
            location: trial.location,
            ticket_number: trial.sequence_number,
            total_days_worked: workedDays,
            grand_total: Math.round(totalEarned * 100) / 100, // Round to 2 decimals
            contractor_name: trial.contractor_name,
            contractor_email: trial.contractor_email,
            day_rate: trial.day_rate,
            truck_rate: trial.truck_rate,
            travel_kms: trial.travel_kms,
            subsistence: trial.subsistence,
            type: 'trial'
          }
        } catch (trialProcessError) {
          console.error(`Error processing trial invoice ${trial.id}:`, trialProcessError)
          // Return trial with zero values if processing fails
          return {
            id: trial.id,
            invoice_number: `TRIAL-${trial.sequence_number}`,
            period_start: trial.start_date,
            period_end: trial.end_date,
            submission_deadline: trial.end_date,
            status: trial.status || 'active',
            company: trial.company,
            location: trial.location,
            ticket_number: trial.sequence_number,
            total_days_worked: 0,
            grand_total: 0,
            contractor_name: trial.contractor_name,
            contractor_email: trial.contractor_email,
            day_rate: trial.day_rate,
            truck_rate: trial.truck_rate,
            travel_kms: trial.travel_kms,
            subsistence: trial.subsistence,
            type: 'trial'
          }
        }
      })
    )

    // Transform regular invoices
    const transformedRegularInvoices = (regularInvoices || []).map(invoice => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      period_start: invoice.period_start,
      period_end: invoice.period_end,
      submission_deadline: invoice.submission_deadline,
      status: invoice.status,
      company: invoice.company,
      location: invoice.location,
      ticket_number: invoice.ticket_number,
      total_days_worked: 0, // Would need to calculate from work_days
      grand_total: 0, // Would need to calculate from work_days
      type: 'regular'
    }))

    // Combine all invoices
    const allInvoices = [...transformedTrialInvoices, ...transformedRegularInvoices]

    const responseData = {
      success: true,
      invoices: allInvoices,
      stats: {
        totalInvoices: allInvoices.length,
        trialInvoices: transformedTrialInvoices.length,
        regularInvoices: transformedRegularInvoices.length,
        activeInvoices: allInvoices.filter(inv => inv.status === 'active').length
      }
    }

    console.log('Contractor invoices API returning:', responseData)
    
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('=== CONTRACTOR INVOICES API ERROR ===', error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Server error: ${error.message}`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('=== CONTRACTOR INVOICES POST API CALLED ===')
    console.log('Request body:', body)

    const {
      userEmail,
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

    // Input validation
    if (!userEmail || !invoiceNumber || !periodStart || !periodEnd) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { success: false, error: 'userEmail, invoiceNumber, periodStart, and periodEnd are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Try to get user ID from profiles table first, then fallback to email
    let userId = userEmail
    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single()

      if (profile) {
        userId = profile.id
      }
    } catch (profileError) {
      // If profiles table doesn't exist, use email as user_id
      console.log('Using email as user_id for invoice creation')
    }

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert([{
        user_id: userId,
        invoice_number: invoiceNumber,
        period_start: periodStart,
        period_end: periodEnd,
        submission_deadline: submissionDeadline,
        ticket_number: ticketNumber,
        location: location || 'Project Site',
        company: company || 'Construction Company',
        day_rate: parseFloat(dayRate) || 450,
        truck_rate: parseFloat(truckRate) || 150,
        travel_rate_per_km: parseFloat(travelRate) || 0.68,
        subsistence_rate: parseFloat(subsistenceRate) || 75,
        work_days: workDays || [],
        status: 'active',
        grand_total: 0 // Will be calculated from work days
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating invoice:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create invoice',
          details: error.message 
        },
        { status: 500 }
      )
    }

    console.log('Invoice created successfully:', invoice.id)

    return NextResponse.json({ 
      success: true, 
      invoice,
      message: 'Invoice created successfully'
    })

  } catch (error: any) {
    console.error('=== CONTRACTOR INVOICES POST API ERROR ===', error)
    return NextResponse.json(
      { 
        success: false, 
        error: `Server error: ${error.message}`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 