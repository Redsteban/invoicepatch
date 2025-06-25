import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe - only initialize if we have a real publishable key
export const stripePromise = 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

// Server-side Stripe - only initialize if we have a real secret key
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
      typescript: true,
    })
  : null;

export enum Plan {
  TRIAL = 'trial',
  CONTRACTOR = 'contractor',
  MANAGER = 'manager',
}

export async function createCustomer({ userId, email }: { userId: string; email: string }): Promise<string> {
  if (!stripe) throw new Error('Stripe is not configured');
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });
  return customer.id;
}

export async function createCheckoutSession({
  userId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) throw new Error('Stripe is not configured');
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });
}

// Re-export Stripe types for later use
export type Customer = Stripe.Customer;
export type CheckoutSession = Stripe.Checkout.Session;
export type Event = Stripe.Event;
export type WebhookEndpoint = Stripe.WebhookEndpoint;

export const PRICE_IDS = {
  CONTRACTOR_MONTHLY: process.env.STRIPE_CONTRACTOR_MONTHLY_PRICE_ID || '',
  MANAGER_PLATFORM: process.env.STRIPE_MANAGER_PLATFORM_PRICE_ID || '',
  COMPLETE_SYSTEM: process.env.STRIPE_COMPLETE_SYSTEM_PRICE_ID || '',
} as const;

// Pricing configuration for the three tiers
export const PRICING_PLANS = [
  {
    id: 'contractor_monthly' as const,
    name: 'Contractor Monthly',
    originalPrice: 299,
    discountedPrice: 29,
    priceId: PRICE_IDS.CONTRACTOR_MONTHLY,
    features: [
      'Unlimited invoices',
      'GPS mileage tracking',
      'CRA-compliant receipts',
      'Payment tracking',
      'Mobile app access'
    ],
    spotsLeft: 23,
    urgencyText: 'LIMITED TIME'
  },
  {
    id: 'manager_platform' as const,
    name: 'Manager Platform',
    originalPrice: 599,
    discountedPrice: 59,
    priceId: PRICE_IDS.MANAGER_PLATFORM,
    features: [
      'Everything in Contractor',
      'Team management dashboard',
      'Bulk invoice approval',
      'Advanced reporting',
      'Priority support'
    ],
    spotsLeft: 15,
    urgencyText: 'EXPIRES SOON'
  },
  {
    id: 'complete_system' as const,
    name: 'Complete System',
    originalPrice: 1999,
    discountedPrice: 199,
    priceId: PRICE_IDS.COMPLETE_SYSTEM,
    features: [
      'Everything in Manager',
      'Custom integrations',
      'White-label solution',
      'Dedicated account manager',
      'Lifetime updates'
    ],
    popular: true,
    spotsLeft: 8,
    urgencyText: 'FINAL HOURS'
  }
];

// Helper function to get plan by ID
export function getPlanById(planId: string) {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

// Helper function to get plan by price ID
export function getPlanByPriceId(priceId: string) {
  return PRICING_PLANS.find(plan => plan.priceId === priceId);
}
