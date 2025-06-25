import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const PayPeriodInput = z.object({
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  template_id: z.string().uuid(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List pay periods for auth user
    const userId = req.query.user_id as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id' });
    }
    const { data, error } = await supabase
      .from('pay_periods')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    // Create pay period
    const parse = PayPeriodInput.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: parse.error.errors });
    }
    // Assume user_id is attached to session or request (replace as needed)
    const userId = req.body.user_id || req.query.user_id;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id' });
    }
    const payload = {
      ...parse.data,
      user_id: userId,
      is_closed: false,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('pay_periods')
      .insert([payload])
      .select()
      .single();
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    // Trigger Supabase Edge Function
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generateDailyEntries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ pay_period_id: data.id }),
      });
    } catch (err: any) {
      // Log but do not fail the request
      console.error('Edge function error:', err.message);
    }
    return res.status(201).json({ success: true, data });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
} 