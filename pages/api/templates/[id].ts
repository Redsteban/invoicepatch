import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TemplateSchema } from '../../../src/types/supabase';

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
    // Fetch one
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      return res.status(404).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'PUT') {
    // Update (validate via Zod)
    const parse = TemplateSchema.omit({ id: true, created_at: true, updated_at: true }).safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: parse.error.errors });
    }
    const payload = {
      ...parse.data,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('templates')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  if (req.method === 'DELETE') {
    // Soft-delete (is_active = false)
    const { data, error } = await supabase
      .from('templates')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
} 