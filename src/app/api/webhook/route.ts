import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import type { PreOrderCustomerInsert, PreOrderCustomerUpdate } from '@/lib/types';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;

// Define interfaces for the webhook
interface CustomerData {
  id: string;
  email: string;
  company_name: string;
  plan_type: string;
  amount_paid: number;
  contractor_count: number;
  current_invoicing_method: string;
  biggest_pain_point: string;
}

// Email automation functions
async function sendWelcomeEmail(customer: CustomerData) {
  // Implement your welcome email logic here
  console.log('Sending welcome email to:', customer.email);
  
  // Example: Send via your email service
  // await emailService.sendWelcomeEmail(customer);
}

async function addToConvertKit(email: string, companyName: string, planType: string) {
  if (!CONVERTKIT_API_KEY) {
    console.log('ConvertKit not configured, skipping email automation');
    return;
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email,
        first_name: companyName,
        tags: ['customer', planType, 'webhook'],
      }),
    });

    if (!response.ok) {
      console.error('ConvertKit subscription failed:', await response.text());
    } else {
      console.log('Successfully added to ConvertKit:', email);
    }
  } catch (error) {
    console.error('Error adding to ConvertKit:', error);
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  // Skip Supabase operations if not configured (e.g., during build)
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - skipping database operations');
    return;
  }

  try {
    const customerEmail = session.customer_details?.email || 
                         (session.customer as Stripe.Customer)?.email;
    
    if (!customerEmail) {
      console.error('No customer email found in session');
      return;
    }

    // Get customer data from Supabase
    try {
      const { data: customer, error: fetchError } = await supabaseAdmin
        .from('pre_order_customers')
        .select('*')
        .eq('email', customerEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching customer:', fetchError);
        return;
      }

      // Extract plan information from line items
      const lineItems = session.line_items?.data || [];
      const planType = extractPlanType(lineItems);
      const amount = session.amount_total || 0;

      if (!customer) {
        // Create new customer record
        const { error: insertError } = await supabaseAdmin
          .from('pre_order_customers')
          .insert({
            email: customerEmail,
            name: session.customer_details?.name || '',
            plan_type: planType,
            amount_paid: amount,
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
            stripe_session_id: session.id,
            payment_status: 'completed',
            company_name: session.custom_fields?.find(f => f.key === 'company_name')?.text?.value,
            phone: session.customer_details?.phone,
          });

        if (insertError) {
          console.error('Error creating customer:', insertError);
        }
      } else {
        // Update existing customer
        const { error: updateError } = await supabaseAdmin
          .from('pre_order_customers')
          .update({
            plan_type: planType,
            amount_paid: amount,
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
            stripe_session_id: session.id,
            payment_status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail);

        if (updateError) {
          console.error('Error updating customer:', updateError);
        }
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

function extractPlanType(lineItems: Stripe.LineItem[]): string {
  // Extract plan type from line items
  const firstItem = lineItems[0];
  if (!firstItem?.price?.metadata?.plan_type) {
    return 'unknown';
  }
  return firstItem.price.metadata.plan_type;
}

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    console.warn('Stripe not configured - webhook cannot process payments');
    return NextResponse.json({ received: false, error: 'Stripe not configured' }, { status: 501 });
  }

  // Check if during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    console.log('Build time detected - skipping webhook processing');
    return NextResponse.json({ received: true, message: 'Build time - skipped' });
  }

  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing webhook secret');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        await handleSuccessfulPayment(session);
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 