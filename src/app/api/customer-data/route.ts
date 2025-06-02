import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// ConvertKit API integration
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;

// Email sequence form IDs (you'll need to create these in ConvertKit)
const EMAIL_SEQUENCES = {
  welcome: process.env.CONVERTKIT_WELCOME_FORM_ID,
  founder_perks: process.env.CONVERTKIT_FOUNDER_PERKS_FORM_ID,
  development_updates: process.env.CONVERTKIT_DEV_UPDATES_FORM_ID,
};

interface CustomerData {
  email: string;
  company_name?: string;
  plan_type: string;
  amount_paid: number;
  customer_id: string;
  session_id: string;
}

async function subscribeToConvertKit(email: string, firstName: string, formId: string, tags: string[] = []) {
  if (!CONVERTKIT_API_KEY || !formId) {
    console.log('ConvertKit not configured, skipping email subscription');
    return;
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email,
        first_name: firstName,
        tags: tags.join(','),
      }),
    });

    if (!response.ok) {
      throw new Error(`ConvertKit API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully subscribed to ConvertKit:', data);
    return data;
  } catch (error) {
    console.error('Error subscribing to ConvertKit:', error);
  }
}

async function triggerEmailSequence(customerData: CustomerData) {
  const firstName = customerData.company_name?.split(' ')[0] || customerData.email.split('@')[0];
  
  // Tags for segmentation
  const tags = [
    'founding-member',
    customerData.plan_type,
    'success-page-visit'
  ];

  // Subscribe to welcome sequence
  if (EMAIL_SEQUENCES.welcome) {
    await subscribeToConvertKit(
      customerData.email,
      firstName,
      EMAIL_SEQUENCES.welcome,
      [...tags, 'welcome-sequence']
    );
  }

  // Subscribe to founder perks sequence
  if (EMAIL_SEQUENCES.founder_perks) {
    await subscribeToConvertKit(
      customerData.email,
      firstName,
      EMAIL_SEQUENCES.founder_perks,
      [...tags, 'founder-perks']
    );
  }

  // Subscribe to development updates
  if (EMAIL_SEQUENCES.development_updates) {
    await subscribeToConvertKit(
      customerData.email,
      firstName,
      EMAIL_SEQUENCES.development_updates,
      [...tags, 'dev-updates']
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'line_items', 'line_items.data.price.product'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract customer data
    const customer = session.customer as Stripe.Customer;
    const lineItems = session.line_items?.data || [];
    const firstLineItem = lineItems[0];
    const product = firstLineItem?.price?.product as Stripe.Product;

    // Determine plan type from metadata or product
    let planType = 'contractor_monthly'; // default
    if (product?.metadata?.plan_type) {
      planType = product.metadata.plan_type;
    } else if (product?.name?.toLowerCase().includes('manager')) {
      planType = 'manager_platform';
    } else if (product?.name?.toLowerCase().includes('complete')) {
      planType = 'complete_system';
    }

    const customerData: CustomerData = {
      email: customer?.email || session.customer_details?.email || '',
      company_name: customer?.name || session.customer_details?.name || '',
      plan_type: planType,
      amount_paid: session.amount_total || 0,
      customer_id: customer?.id || '',
      session_id: sessionId,
    };

    // Trigger email sequences
    if (customerData.email) {
      await triggerEmailSequence(customerData);
    }

    // Store customer data in your database here if needed
    // await storeCustomerData(customerData);

    return NextResponse.json(customerData);
  } catch (error) {
    console.error('Error retrieving customer data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve customer data' },
      { status: 500 }
    );
  }
}

// Optional: Create customer data endpoint for manual triggers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'slack_invite':
        // You could trigger a Slack invite API here
        // For now, we'll just track the action
        console.log(`Slack invite triggered for ${email}`);
        break;
      
      case 'pdf_download':
        // Track PDF download
        console.log(`PDF download for ${email}`);
        break;
      
      case 'referral_signup':
        // Handle referral program signup
        console.log(`Referral signup for ${email}`);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling customer action:', error);
    return NextResponse.json(
      { error: 'Failed to handle action' },
      { status: 500 }
    );
  }
} 