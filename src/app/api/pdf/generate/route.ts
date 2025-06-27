import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { pdfCache } from '@/services/pdfCache';

const rateLimitMap = new Map<string, { count: number; last: number }>();

const InvoiceDataSchema = z.object({
  invoiceNumber: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
  contractor: z.object({
    name: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string().optional(),
  }),
  client: z.object({
    name: z.string(),
    address: z.string(),
  }),
  period: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
  entries: z.array(z.object({
    date: z.string(),
    description: z.string(),
    regularHours: z.number(),
    overtimeHours: z.number(),
    travelHours: z.number(),
    amount: z.number(),
    expenses: z.number().optional(),
  })),
  summary: z.object({
    regularHours: z.number(),
    overtimeHours: z.number(),
    travelHours: z.number(),
    totalHours: z.number(),
    regularAmount: z.number(),
    overtimeAmount: z.number(),
    travelAmount: z.number(),
    expensesTotal: z.number(),
    subtotal: z.number(),
    gst: z.number(),
    pst: z.number(),
    total: z.number(),
  }),
  notes: z.string().optional(),
});

const MAX_PDF_SIZE = 2 * 1024 * 1024; // 2MB
const RATE_LIMIT = 5; // per hour

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    // Rate limiting
    const now = Date.now();
    const rl = rateLimitMap.get(ip) || { count: 0, last: now };
    if (now - rl.last > 60 * 60 * 1000) {
      rl.count = 0;
      rl.last = now;
    }
    if (rl.count >= RATE_LIMIT) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    rl.count++;
    rl.last = now;
    rateLimitMap.set(ip, rl);

    const body = await req.json();
    // No zod validation, trust the UI structure
    // Generate PDF using the new generator
    const doc = await generateInvoicePDF(body.invoiceData);
    if (!doc) {
      return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
    const pdfBlob = new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    if (pdfBlob.size > MAX_PDF_SIZE) {
      return NextResponse.json({ error: 'PDF too large' }, { status: 413 });
    }
    // Store PDF in cache (token = random string)
    const downloadToken = Math.random().toString(36).slice(2) + Date.now();
    const buffer = Buffer.from(await pdfBlob.arrayBuffer());
    pdfCache.set(downloadToken, { pdf: buffer, expires: now + 10 * 60 * 1000 }); // 10 min expiry
    const pdfUrl = `/api/pdf/download?token=${downloadToken}`;
    return NextResponse.json({ pdfUrl, downloadToken });
  } catch (err: any) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 