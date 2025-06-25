import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '../../../src/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, priceId } = req.body
    if (!userId || !priceId) {
      return res.status(400).json({ error: 'Missing userId or priceId' })
    }

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()
    if (error || !user?.stripe_customer_id) {
      return res.status(404).json({ error: 'User or Stripe customer not found' })
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripe_customer_id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: process.env.CHECKOUT_SUCCESS_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      cancel_url: process.env.CHECKOUT_CANCEL_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      customer_email: user.email,
    })

    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
} 