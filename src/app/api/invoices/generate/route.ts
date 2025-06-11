import { NextRequest, NextResponse } from 'next/server';
import { 
  generateInvoiceForPeriod, 
  saveGeneratedInvoice,
  generateCurrentPeriodInvoice,
  generateBulkInvoices 
} from '@/lib/invoiceGeneration';

export async function POST(request: NextRequest) {
  try {
    console.log('📋 Invoice generation API called');
    
    const body = await request.json();
    const { 
      trialInvoiceId, 
      periodNumber, 
      action = 'single',
      periodNumbers 
    } = body;

    if (!trialInvoiceId) {
      return NextResponse.json(
        { success: false, error: 'Trial invoice ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'current':
        // Generate invoice for current active period
        result = await generateCurrentPeriodInvoice(trialInvoiceId);
        break;

      case 'bulk':
        // Generate multiple invoices
        if (!periodNumbers || !Array.isArray(periodNumbers)) {
          return NextResponse.json(
            { success: false, error: 'Period numbers array is required for bulk generation' },
            { status: 400 }
          );
        }
        result = await generateBulkInvoices(trialInvoiceId, periodNumbers);
        break;

      case 'single':
      default:
        // Generate single period invoice
        if (!periodNumber) {
          return NextResponse.json(
            { success: false, error: 'Period number is required for single invoice generation' },
            { status: 400 }
          );
        }
        result = await generateInvoiceForPeriod(trialInvoiceId, periodNumber);
        break;
    }

    console.log(`✅ Invoice generation completed for action: ${action}`);

    return NextResponse.json({
      success: true,
      action,
      data: result,
      message: `Invoice${action === 'bulk' ? 's' : ''} generated successfully`
    });

  } catch (error: any) {
    console.error('❌ Invoice generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate invoice',
        details: error.stack 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trialInvoiceId = searchParams.get('trialInvoiceId');
    const action = searchParams.get('action') || 'list';

    if (!trialInvoiceId) {
      return NextResponse.json(
        { success: false, error: 'Trial invoice ID is required' },
        { status: 400 }
      );
    }

    // Import here to avoid circular dependency issues
    const { getContractorInvoices } = await import('@/lib/invoiceGeneration');
    
    const invoices = await getContractorInvoices(trialInvoiceId);

    return NextResponse.json({
      success: true,
      action,
      data: invoices,
      count: invoices.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching invoices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch invoices'
      },
      { status: 500 }
    );
  }
} 