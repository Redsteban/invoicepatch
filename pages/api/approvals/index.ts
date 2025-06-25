import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const ApprovalAction = z.object({
  change_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // List pending flags for manager (join change_notifications, daily_entries, users)
    const managerId = req.query.manager_id as string;
    if (!managerId) {
      return res.status(400).json({ success: false, error: 'Missing manager_id' });
    }
    const { data: contractors, error: contractorsError } = await supabase
      .from('manager_contractors')
      .select('contractor_id')
      .eq('manager_id', managerId);
    if (contractorsError) {
      return res.status(500).json({ success: false, error: contractorsError.message });
    }
    const contractorIds = (contractors || []).map((c: any) => c.contractor_id);
    const { data, error } = await supabase
      .from('change_notifications')
      .select(`*, daily_entries(*), users(*)`)
      .eq('status', 'pending')
      .in('contractor_id', contractorIds);
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'POST') {
    // Approve or reject a change
    const parse = ApprovalAction.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: parse.error.errors });
    }
    const { change_id, action, notes } = parse.data;
    let updateRes;
    if (action === 'approve') {
      // Call edge function applyChange
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/applyChange`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ change_id }),
        });
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err.message });
      }
      updateRes = await supabase
        .from('change_notifications')
        .update({ status: 'approved', notes })
        .eq('id', change_id)
        .select()
        .single();
    } else {
      updateRes = await supabase
        .from('change_notifications')
        .update({ status: 'rejected', notes })
        .eq('id', change_id)
        .select()
        .single();
    }
    if (updateRes.error) {
      return res.status(500).json({ success: false, error: updateRes.error.message });
    }
    return res.status(200).json({ success: true, data: updateRes.data });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
} 