import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Import the cache from the generate route
// @ts-ignore
import { pdfCache } from '@/services/pdfCache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const download = searchParams.get('download');

  if (!token) {
    return new NextResponse('Missing token', { status: 400 });
  }

  // Get PDF from cache
  const cached = pdfCache.get(token);
  if (!cached || Date.now() > cached.expires) {
    return new NextResponse('PDF not found or expired', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', 'application/pdf');
  headers.set(
    'Content-Disposition',
    download === '1'
      ? 'attachment; filename="invoice.pdf"'
      : 'inline; filename="invoice.pdf"'
  );
  // Optionally, set cache control to prevent browser caching
  headers.set('Cache-Control', 'no-store');

  return new NextResponse(cached.pdf, {
    status: 200,
    headers,
  });
} 