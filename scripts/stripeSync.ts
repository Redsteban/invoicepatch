import 'dotenv/config';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function syncPlans() {
  const prices = await stripe.prices.list({ limit: 100 });
  for (const price of prices.data) {
    if (!price.id || typeof price.unit_amount !== 'number' || !price.recurring) continue;
    const plan_type = price.nickname || price.product || 'custom';
    const interval = price.recurring.interval;
    const amount = price.unit_amount;
    await supabase.from('plans').upsert({
      id: price.id,
      stripe_price_id: price.id,
      plan_type,
      amount,
      interval,
    });
    console.log(`Upserted plan: ${plan_type} (${price.id})`);
  }
}

async function syncCustomers() {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, stripe_customer_id')
    .is('stripe_customer_id', null);
  if (error) throw error;
  for (const user of users || []) {
    if (!user.email) continue;
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    await supabase.from('users').update({ stripe_customer_id: customer.id }).eq('id', user.id);
    console.log(`Created Stripe customer for user ${user.id}: ${customer.id}`);
  }
}

async function main() {
  console.log('Syncing Stripe plans...');
  await syncPlans();
  console.log('Syncing Stripe customers...');
  await syncCustomers();
  console.log('Stripe sync complete.');
}

main().catch((err) => {
  console.error('Error during Stripe sync:', err);
  process.exit(1);
}); 