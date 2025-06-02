import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import type { PreOrderCustomerInsert } from '@/lib/types';
import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
const stripeInstance = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })
  : null;

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
  // Check if during build time
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    console.log('Build time detected - skipping checkout creation');
    return NextResponse.json({ error: 'Build time - checkout not available' }, { status: 503 });
  }

  // Check if Stripe is configured
  if (!stripeInstance) {
    console.warn('Stripe not configured - cannot create checkout session');
    return NextResponse.json({ error: 'Payment processing not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { 
      email, 
      company_name, 
      plan_type = 'contractor_monthly',
      success_url,
      cancel_url 
    } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Store customer data in Supabase first (if configured)
    let customerId = null;
    if (isSupabaseConfigured()) {
      try {
        // Generate referral code
        const baseCode = email.split('@')[0].slice(0, 6).toUpperCase();
        let referralCode = baseCode;
        let counter = 1;

        // Check if code exists, increment if needed
        let codeExists = true;
        while (codeExists) {
          const { data } = await supabaseAdmin
            .from('pre_order_customers')
            .select('referral_code')
            .eq('referral_code', referralCode)
            .single();

          if (!data) {
            codeExists = false;
          } else {
            referralCode = `${baseCode}${counter}`;
            counter++;
          }
        }

        // Prepare customer data for Supabase with proper types
        const customerData = {
          email,
          company_name: company_name || 'Not provided',
          contractor_count: 1,
          current_invoicing_method: 'manual' as const,
          biggest_pain_point: 'late_payments' as const,
          plan_type: plan_type as 'contractor_monthly' | 'manager_platform' | 'complete_system',
          referral_code: referralCode,
          amount_paid: 0,
          status: 'pending' as const,
          subscription_source: 'checkout' as const,
          consent_marketing: true,
        };

        const { error: dbError } = await supabaseAdmin
          .from('pre_order_customers')
          .insert(customerData)
          .select('id')
          .single();

        if (dbError) {
          console.error('Error storing customer data:', dbError);
          // Don't fail the checkout creation if database insert fails
        }
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        // Continue with checkout creation even if database fails
      }
    } else {
      console.warn('Supabase not configured - skipping customer data storage');
    }

    // Create Stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: getPlanName(plan_type),
              description: getPlanDescription(plan_type),
              metadata: {
                plan_type,
              },
            },
            unit_amount: getPlanPrice(plan_type),
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        plan_type,
        customer_email: email,
        company_name: company_name || '',
      },
      custom_fields: company_name ? [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Company Name',
          },
          type: 'text',
          optional: true,
        },
      ] : undefined,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

function getPlanName(planType: string): string {
  switch (planType) {
    case 'contractor_monthly':
      return 'Contractor Monthly Plan';
    case 'manager_platform':
      return 'Manager Platform';
    case 'complete_system':
      return 'Complete System';
    default:
      return 'InvoicePatch Plan';
  }
}

function getPlanDescription(planType: string): string {
  switch (planType) {
    case 'contractor_monthly':
      return 'Monthly subscription for contractors';
    case 'manager_platform':
      return 'Advanced platform for project managers';
    case 'complete_system':
      return 'Complete invoicing and reconciliation system';
    default:
      return 'InvoicePatch subscription';
  }
}

function getPlanPrice(planType: string): number {
  // Prices in cents (CAD)
  switch (planType) {
    case 'contractor_monthly':
      return 4900; // $49 CAD
    case 'manager_platform':
      return 14900; // $149 CAD
    case 'complete_system':
      return 39900; // $399 CAD
    default:
      return 4900;
  }
} 