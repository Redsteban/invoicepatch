import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import type { PreOrderCustomerInsert, PreOrderCustomerUpdate } from '@/lib/types';

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

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment successful:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
          currency: session.currency,
        });

        // Get customer data from Supabase
        try {
          // Update customer record with stripe customer ID
          const { data: customer, error: fetchError } = await supabaseAdmin
            .from('pre_order_customers')
            .select('*')
            .eq('stripe_session_id', session.id)
            .single();

          if (fetchError) {
            console.error('Error fetching customer:', fetchError);
            
            // If customer not found in DB, create from session metadata
            if (session.metadata) {
              const customerInsert: PreOrderCustomerInsert = {
                email: session.customer_email || session.metadata.email,
                company_name: session.metadata.company_name || 'Unknown',
                contractor_count: 1,
                current_invoicing_method: 'manual',
                biggest_pain_point: 'late_payments',
                amount_paid: session.amount_total || 0,
                plan_type: session.metadata.plan_type as any || 'contractor_monthly',
                stripe_customer_id: session.customer as string,
                stripe_session_id: session.id,
                status: 'active'
              };

              const { error: insertError } = await supabaseAdmin
                .from('pre_order_customers')
                .insert(customerInsert);

              if (insertError) {
                console.error('Error inserting customer from webhook:', insertError);
              }
            }
          } else {
            // Update existing customer with Stripe customer ID
            const customerUpdate: PreOrderCustomerUpdate = {
              stripe_customer_id: session.customer as string,
              status: 'active',
              updated_at: new Date().toISOString()
            };

            const { error: updateError } = await supabaseAdmin
              .from('pre_order_customers')
              .update(customerUpdate)
              .eq('id', customer.id);

            if (updateError) {
              console.error('Error updating customer:', updateError);
            }

            // Send welcome email and add to ConvertKit
            await Promise.all([
              sendWelcomeEmail(customer),
              addToConvertKit(customer.email, customer.company_name, customer.plan_type)
            ]);
          }

        } catch (dbError) {
          console.error('Database operation failed in webhook:', dbError);
        }

        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 