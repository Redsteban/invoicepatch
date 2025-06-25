import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing or invalid id' });
  }

  if (req.method === 'GET') {
    // Fetch one, include summary (e.g., total hours, entries count)
    const { data, error } = await supabase
      .from('pay_periods')
      .select('*, daily_entries(count, total_hours:hours)')
      .eq('id', id)
      .single();
    if (error) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'PATCH') {
    // Mark status = 'completed'
    const { data, error } = await supabase
      .from('pay_periods')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'DELETE') {
    // Soft-delete (set deleted flag)
    const { data, error } = await supabase
      .from('pay_periods')
      .update({ deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
} 