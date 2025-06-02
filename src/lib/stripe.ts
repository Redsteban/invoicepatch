import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Client-side Stripe - only initialize if we have a real publishable key
export const stripePromise = 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

// Server-side Stripe - only initialize if we have a real secret key
export const stripe = 
  process.env.STRIPE_SECRET_KEY && 
  process.env.STRIPE_SECRET_KEY.startsWith('sk_')
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-05-28.basil',
      })
    : null;

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
