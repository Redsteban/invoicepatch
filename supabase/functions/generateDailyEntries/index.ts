import { serve } from 'std/server';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), { status: 405 });
  }

  const auth = req.headers.get('authorization') || '';
  const jwt = auth.replace('Bearer ', '');
  // Check for service-role JWT (very basic check, improve as needed)
  if (!jwt || jwt.length < 32) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid service-role JWT' }), { status: 401 });
  }

  let pay_period_id: string | undefined;
  try {
    const body = await req.json();
    pay_period_id = body.pay_period_id;
    if (!pay_period_id) throw new Error('Missing pay_period_id');
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON or missing pay_period_id' }), { status: 400 });
  }

  // Run SQL functions
  try {
    const client = (globalThis as any).supabaseClient;
    if (!client) throw new Error('No supabase client');
    // 1. generate_daily_entries
    const { error: genErr } = await client.rpc('generate_daily_entries', { arg_pay_period_id: pay_period_id });
    if (genErr) throw genErr;
    // 2. refresh_period_summary
    const { error: sumErr } = await client.rpc('refresh_period_summary', { arg_pay_period_id: pay_period_id });
    if (sumErr) throw sumErr;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400 });
  }
}); 