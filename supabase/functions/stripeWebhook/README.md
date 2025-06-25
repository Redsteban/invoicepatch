# stripeWebhook Edge Function

This function handles Stripe webhook events for your Supabase project.

## Supported Events
- `checkout.session.completed`: Sets users.plan_type and trial_end_date
- `invoice.payment_succeeded`: Inserts a row in public.billing_events
- `invoice.payment_failed`: Notifies user via notifications table

## Setup

1. **Environment Variables**
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret

2. **Deploy the Function**
   ```sh
   supabase functions deploy stripeWebhook
   ```

3. **Set Up Stripe Webhook**
   - Go to your [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
   - Click "Add endpoint"
   - Set the endpoint URL to:
     ```
     https://<your-project-id>.supabase.co/functions/v1/stripeWebhook
     ```
   - Select events:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy the webhook signing secret and set it as `STRIPE_WEBHOOK_SECRET` in your environment.

4. **Test**
   - Use Stripe CLI or Dashboard to send test events and verify handling.

## Example

Stripe will POST events to your function. Unhandled event types return 200 with 'Unhandled event'. 