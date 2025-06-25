import { serve } from 'std/server';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL');

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), { status: 405 });
  }
  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400 });
  }
  // Supabase function triggers send the new row as 'record'
  const record = payload.record;
  if (!record || !['applied', 'rejected'].includes(record.status)) {
    return new Response(JSON.stringify({ ok: false, error: 'Not an approval event' }), { status: 200 });
  }
  // Fetch contractor and manager emails (assume columns or join as needed)
  const contractorEmail = record.contractor_email;
  const managerEmail = record.manager_email;
  const decision = record.status === 'applied' ? 'APPROVED' : 'REJECTED';
  const notes = record.notes || '';
  const subject = `Change ${decision}`;
  const html = `<p>Your change request was <b>${decision}</b>.</p><p>Notes: ${notes}</p>`;
  try {
    if (contractorEmail) await sendEmail(contractorEmail, subject, html);
    if (managerEmail) await sendEmail(managerEmail, subject, html);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 });
  }
}); 