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
    let taxableAmount = 0;
    let nonTaxableAmount = 0;

    if (worked) {
      // Day rate (taxable)
      taxableAmount += dayRate || 0;
      
      // Truck rate (taxable if applicable)
      if (truckUsed) {
        taxableAmount += truckRate || 0;
      }
      
      // Travel reimbursement (non-taxable) - $0.68 per km standard rate
      const travelReimbursement = (travelKms || 0) * 0.68;
      nonTaxableAmount += travelReimbursement;
      
      // Subsistence (non-taxable)
      nonTaxableAmount += subsistence || 0;
    }

    // Calculate GST (5% on taxable amount)
    const gstAmount = taxableAmount * 0.05;
    const dailyTotal = taxableAmount + gstAmount + nonTaxableAmount;

    // Check if entry already exists for this date
    const { data: existingEntry } = await supabaseAdmin
      .from('daily_entries')
      .select('id')
      .eq('trial_invoice_id', trialInvoiceId)
      .eq('entry_date', date)
      .single();

    let result;
    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabaseAdmin
        .from('daily_entries')
        .update({
          worked: worked,
          day_rate_used: worked ? dayRate : 0,
          truck_rate_used: worked && truckUsed ? truckRate : 0,
          travel_kms_actual: worked ? travelKms : 0,
          subsistence_actual: worked ? subsistence : 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingEntry.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating daily entry:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to update daily entry' },
          { status: 500 }
        );
      }
      result = data;
    } else {
      // Create new entry
      const { data, error } = await supabaseAdmin
        .from('daily_entries')
        .insert({
          trial_invoice_id: trialInvoiceId,
          entry_date: date,
          worked: worked,
          day_rate_used: worked ? dayRate : 0,
          truck_rate_used: worked && truckUsed ? truckRate : 0,
          travel_kms_actual: worked ? travelKms : 0,
          subsistence_actual: worked ? subsistence : 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating daily entry:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to create daily entry' },
          { status: 500 }
        );
      }
      result = data;
    }

    // Update trial invoice totals
    const { data: allEntries, error: fetchError } = await supabaseAdmin
      .from('daily_entries')
      .select('*')
      .eq('trial_invoice_id', trialInvoiceId)
      .eq('worked', true);

    if (!fetchError && allEntries) {
      const totalEarned = allEntries.reduce((sum, entry) => {
        const dayAmount = entry.day_rate_used || 0;
        const truckAmount = entry.truck_rate_used || 0;
        const travelAmount = (entry.travel_kms_actual || 0) * 0.68;
        const subsistenceAmount = entry.subsistence_actual || 0;
        
        const entryTaxable = dayAmount + truckAmount;
        const entryGst = entryTaxable * 0.05;
        
        return sum + entryTaxable + entryGst + travelAmount + subsistenceAmount;
      }, 0);
      
      // Update the trial invoice with current totals
      await supabaseAdmin
        .from('trial_invoices')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', trialInvoiceId);
    }

    return NextResponse.json({
      success: true,
      entry: result,
      summary: {
        dailyTotal: dailyTotal,
        taxableAmount: taxableAmount,
        nonTaxableAmount: nonTaxableAmount,
        gstAmount: gstAmount
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
