import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import type { PreOrderCustomerInsert } from '@/lib/types';

// Define interfaces locally since we can't import from types
interface CheckoutFormData {
  email: string;
  company_name: string;
  contractor_count: number;
  current_invoicing_method: string;
  biggest_pain_point: string;
}

interface CheckoutRequest {
  priceId: string;
  customerData: CheckoutFormData;
  planType: string;
  amount: number;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system is not configured yet' },
        { status: 503 }
      );
    }

    const { priceId, customerData, planType, amount }: CheckoutRequest = await request.json();

    // Validate required fields
    if (!priceId || !customerData?.email || !customerData?.company_name || !planType || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price ID format
    if (priceId.includes('placeholder')) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Store customer data in Supabase first
    try {
      // Create checkout session first to get session ID
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        customer_email: customerData.email,
        metadata: {
          email: customerData.email,
          company_name: customerData.company_name,
          plan_type: planType,
          product: 'InvoicePatch Pre-order',
        },
        custom_fields: [
          {
            key: 'company_name',
            label: { type: 'custom', custom: 'Company Name' },
            type: 'text',
          },
          {
            key: 'contractor_count',
            label: { type: 'custom', custom: 'Number of Contractors' },
            type: 'numeric',
          }
        ],
      });

      // Prepare customer data for Supabase with proper types
      const customerInsert: PreOrderCustomerInsert = {
        email: customerData.email,
        company_name: customerData.company_name,
        contractor_count: customerData.contractor_count,
        current_invoicing_method: customerData.current_invoicing_method as any,
        biggest_pain_point: customerData.biggest_pain_point as any,
        amount_paid: amount,
        plan_type: planType as any,
        stripe_session_id: session.id,
        status: 'pending'
      };

      // Store customer data with session ID
      const { error: dbError } = await supabaseAdmin
        .from('pre_order_customers')
        .insert(customerInsert);

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue with checkout even if DB fails, we can capture via webhook
      }

      return NextResponse.json({ sessionId: session.id });

    } catch (dbError) {
      console.error('Error storing customer data:', dbError);
      
      // Create session anyway and rely on webhook for data capture
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
        customer_email: customerData.email,
        metadata: {
          email: customerData.email,
          company_name: customerData.company_name,
          plan_type: planType,
          product: 'InvoicePatch Pre-order',
        },
      });

      return NextResponse.json({ sessionId: session.id });
    }

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 