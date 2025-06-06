import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const {
      trialInvoiceId,
      date,
      worked,
      dayRate,
      truckUsed,
      truckRate,
      travelKms,
      subsistence
    } = await request.json();

    // Validate required fields
    if (!trialInvoiceId || !date) {
      return NextResponse.json(
        { success: false, error: 'Trial invoice ID and date are required' },
        { status: 400 }
      );
    }

    // Calculate totals
    let dailyTotal = 0;
    let taxableAmount = 0;
    let nonTaxableAmount = 0;

    if (worked) {
      // Day rate (taxable)
      taxableAmount += dayRate;
      
      // Truck rate (taxable if applicable)
      if (truckUsed) {
        taxableAmount += truckRate;
      }
      
      // Travel reimbursement (non-taxable) - $0.68 per km standard rate
      const travelReimbursement = travelKms * 0.68;
      nonTaxableAmount += travelReimbursement;
      
      // Subsistence (non-taxable)
      nonTaxableAmount += subsistence;
      
      // Calculate GST (5% on taxable amount)
      const gstAmount = taxableAmount * 0.05;
      
      dailyTotal = taxableAmount + gstAmount + nonTaxableAmount;
    }

    // Create check-in record
    const { data: checkIn, error: checkInError } = await supabaseAdmin
      .from('contractor_checkins')
      .insert({
        trial_invoice_id: trialInvoiceId,
        checkin_date: date,
        worked_today: worked,
        day_rate: worked ? dayRate : 0,
        truck_used: worked ? truckUsed : false,
        truck_rate: worked && truckUsed ? truckRate : 0,
        travel_kms: worked ? travelKms : 0,
        travel_reimbursement: worked ? travelKms * 0.68 : 0,
        subsistence: worked ? subsistence : 0,
        taxable_amount: taxableAmount,
        gst_amount: taxableAmount * 0.05,
        non_taxable_amount: nonTaxableAmount,
        daily_total: dailyTotal,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (checkInError) {
      console.error('Error creating check-in:', checkInError);
      return NextResponse.json(
        { success: false, error: 'Failed to save check-in' },
        { status: 500 }
      );
    }

    // Update invoice total by fetching all check-ins for this trial
    const { data: allCheckIns, error: fetchError } = await supabaseAdmin
      .from('contractor_checkins')
      .select('daily_total')
      .eq('trial_invoice_id', trialInvoiceId)
      .eq('worked_today', true);

    if (!fetchError && allCheckIns) {
      const totalAmount = allCheckIns.reduce((sum, checkIn) => sum + (checkIn.daily_total || 0), 0);
      
      // Update the related invoice
      await supabaseAdmin
        .from('invoices')
        .update({ 
          amount: totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', trialInvoiceId);
    }

    return NextResponse.json({
      success: true,
      checkIn: checkIn,
      summary: {
        dailyTotal: dailyTotal,
        taxableAmount: taxableAmount,
        nonTaxableAmount: nonTaxableAmount,
        gstAmount: taxableAmount * 0.05
      }
    });

  } catch (error) {
    console.error('Contractor check-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
