import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // Create manager session
    const { data: session, error: sessionError } = await supabase
      .from('manager_sessions')
      .insert({
        session_id: `MGR-${Date.now()}`,
        files_uploaded: files.length,
        upload_timestamp: new Date().toISOString(),
        status: 'processing',
        demo_type: 'manager_trial'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating manager session:', sessionError);
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      );
    }

    // Generate sample reconciliation data for demo
    const sampleInvoices = generateSampleInvoices(files.length);
    
    // Create invoice records for the demo
    const invoicePromises = sampleInvoices.map(invoice => 
      supabase
        .from('demo_invoices')
        .insert({
          session_id: session.session_id,
          invoice_number: invoice.invoice_number,
          contractor_name: invoice.contractor_name,
          amount: invoice.amount,
          status: invoice.status,
          filename: invoice.filename,
          upload_date: new Date().toISOString(),
          reconciliation_confidence: invoice.confidence,
          issues: invoice.issues || []
        })
    );

    await Promise.all(invoicePromises);

    // Update session status
    await supabase
      .from('manager_sessions')
      .update({ 
        status: 'completed',
        processed_timestamp: new Date().toISOString(),
        total_amount: sampleInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        matched_invoices: sampleInvoices.filter(inv => inv.status === 'matched').length,
        flagged_invoices: sampleInvoices.filter(inv => inv.status === 'review').length
      })
      .eq('session_id', session.session_id);

    return NextResponse.json({
      success: true,
      sessionId: session.session_id,
      processedFiles: files.length,
      summary: {
        totalAmount: sampleInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        matchedInvoices: sampleInvoices.filter(inv => inv.status === 'matched').length,
        flaggedInvoices: sampleInvoices.filter(inv => inv.status === 'review').length,
        totalInvoices: sampleInvoices.length
      }
    });

  } catch (error) {
    console.error('Manager upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateSampleInvoices(fileCount: number) {
  const contractors = [
    'Northern Drilling Corp',
    'Precision Oilfield Services',
    'Alberta Pipeline Solutions',
    'Mountain View Construction',
    'Energy Services Inc',
    'Western Well Services',
    'Summit Drilling',
    'Prairie Energy Corp'
  ];

  const projects = [
    'Montney Development Phase 2',
    'Pipeline Integrity Assessment',
    'Well Site Preparation',
    'Facility Maintenance',
    'Equipment Installation',
    'Site Restoration',
    'Emergency Response',
    'Safety Inspection'
  ];

  const invoices = [];
  
  for (let i = 0; i < Math.max(fileCount, 5); i++) {
    const contractor = contractors[i % contractors.length];
    const project = projects[i % projects.length];
    const amount = Math.floor(Math.random() * 50000) + 5000;
    const isMatched = Math.random() > 0.15; // 85% match rate
    
    invoices.push({
      invoice_number: `INV-${Date.now()}-${i + 1}`,
      contractor_name: contractor,
      project_name: project,
      amount: amount,
      status: isMatched ? 'matched' : 'review',
      filename: `invoice_${i + 1}.pdf`,
      confidence: isMatched ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 40,
      issues: isMatched ? [] : ['Rate discrepancy', 'Missing AFE reference']
    });
  }

  return invoices;
} 