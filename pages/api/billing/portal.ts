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
    // You may want to get the user from the session or request body
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()
    if (error || !user?.stripe_customer_id) {
      return res.status(404).json({ error: 'User or Stripe customer not found' })
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: process.env.BILLING_PORTAL_RETURN_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    })

    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
} 