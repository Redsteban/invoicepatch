import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addSubscriber } from '@/services/subscriberService';

const ConsentSchema = z.object({
  consentMarketing: z.boolean().optional(),
  consentUpdates: z.boolean().optional(),
});
const AddSubscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  consent: ConsentSchema,
  source: z.string().max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = AddSubscriberSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid input', details: parse.error.errors }, { status: 400 });
    }
    const { email, firstName, consent, source } = parse.data;
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || undefined;
    const subscriber = await addSubscriber({
      email,
      firstName,
      consentMarketing: consent.consentMarketing,
      consentUpdates: consent.consentUpdates,
      source,
      ipAddress: ip,
      userAgent,
    });
    return NextResponse.json({ success: true, subscriber });
  } catch (err: any) {
    console.error('Add subscriber error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 