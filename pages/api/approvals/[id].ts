import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

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
    // Fetch single change with diff detail
    const { data, error } = await supabase
      .from('change_notifications')
      .select('*, diff_detail:diff')
      .eq('id', id)
      .single();
    if (error) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
} 