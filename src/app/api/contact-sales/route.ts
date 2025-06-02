import { NextRequest, NextResponse } from 'next/server';

interface ContactSalesData {
  customerData: {
    email: string;
    company_name: string;
    contractor_count: string;
    current_invoicing_method: string;
    biggest_pain_point?: string;
  };
  planType: string;
  planName: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactSalesData = await request.json();
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to sales team
    // 3. Add to CRM system
    // 4. Send confirmation email to customer
    
    console.log('Contact sales request:', {
      email: data.customerData.email,
      company: data.customerData.company_name,
      plan: data.planName,
      contractors: data.customerData.contractor_count,
      currentMethod: data.customerData.current_invoicing_method,
      painPoint: data.customerData.biggest_pain_point,
      timestamp: new Date().toISOString()
    });

    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Contact request submitted successfully' 
    });

  } catch (error) {
    console.error('Contact sales error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact request' },
      { status: 500 }
    );
  }
} 