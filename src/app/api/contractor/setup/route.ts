import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create contractor profile
    const { data: contractor, error: contractorError } = await supabase
      .from('contractors')
      .insert({
        name,
        email,
        phone,
        status: 'demo',
        daily_rate: 450,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (contractorError) {
      console.error('Error creating contractor:', contractorError);
      return NextResponse.json(
        { success: false, error: 'Failed to create contractor profile' },
        { status: 500 }
      );
    }

    // Create demo work order
    const { data: workOrder, error: workOrderError } = await supabase
      .from('work_orders')
      .insert({
        contractor_id: contractor.id,
        project_name: 'Calgary Downtown Development',
        location: 'Calgary Downtown',
        daily_rate: 450,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
        status: 'active',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (workOrderError) {
      console.error('Error creating work order:', workOrderError);
      return NextResponse.json(
        { success: false, error: 'Failed to create work order' },
        { status: 500 }
      );
    }

    // Create initial demo invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        contractor_id: contractor.id,
        work_order_id: workOrder.id,
        invoice_number: `INV-${Date.now()}`,
        amount: 450,
        days_worked: 1,
        description: 'Day 1 - Site preparation and setup',
        status: 'draft',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError);
      return NextResponse.json(
        { success: false, error: 'Failed to create demo invoice' },
        { status: 500 }
      );
    }

    // Return success with invoice ID for redirection
    return NextResponse.json({
      success: true,
      contractorId: contractor.id,
      invoiceId: invoice.id,
      workOrderId: workOrder.id,
    });

  } catch (error) {
    console.error('Contractor setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 