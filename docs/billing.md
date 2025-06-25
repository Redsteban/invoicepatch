# InvoicePatch Billing Guide

## Plan Tiers

- **Trial**: Free, limited to 5 invoices. Access to core features for evaluation.
- **Contractor**: $50/mo. Unlimited invoices, GPS mileage, CRA receipts, payment tracking, mobile app.
- **Manager**: $299/mo. All Contractor features plus team dashboard, bulk approval, advanced reporting, priority support.
- **Complete System**: $1999/mo. All Manager features plus custom integrations, white-label, dedicated manager, lifetime updates.

## Upgrade Flow
1. User hits trial cap or chooses to upgrade.
2. Paywall modal appears with plan options.
3. User selects plan and completes Stripe Checkout.
4. On success, plan_type is updated in Supabase and access is unlocked.

## Downgrade (Rollback) Flow
1. User visits billing page and selects downgrade/cancel.
2. Subscription is updated/cancelled in Stripe.
3. plan_type is updated in Supabase (immediately or at period end).
4. User retains access until end of paid period, then reverts to lower plan or trial.

## Refund Policy
- **Monthly plans**: Refunds are not provided for partial months. Cancel anytime to avoid future charges.
- **Annual/Enterprise**: Contact support for pro-rated refunds or special cases.
- **Failed payments**: Access may be restricted until payment is resolved.

For more details, see /billing or contact support. 