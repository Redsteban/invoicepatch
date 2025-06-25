import { serve } from 'std/server';
import Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // DB client
  const client = (globalThis as any).supabaseClient;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        await client.from('users').update({
          plan_type: 'trial',
          trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }).eq('id', userId);
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await client.from('billing_events').insert({
        invoice_id: invoice.id,
        user_id: invoice.customer,
        amount_paid: invoice.amount_paid,
        status: 'succeeded',
        created_at: new Date().toISOString(),
      });
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      // Notify user via notifications table
      await client.from('notifications').insert({
        user_id: invoice.customer,
        type: 'billing',
        message: 'Your payment failed. Please update your payment method.',
        created_at: new Date().toISOString(),
        read: false,
      });
      break;
    }
    default:
      // Return 200 for unhandled event types
      return new Response('Unhandled event', { status: 200 });
  }
  return new Response('ok', { status: 200 });
}); 