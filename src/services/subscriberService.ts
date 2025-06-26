// NOTE: You must provide a db client compatible with async/await and parameterized queries.
// Example: import db from '../lib/db';
// For Supabase, use the supabase client; for pg, use node-postgres.

import { z } from 'zod';

export interface EmailSubscriber {
  id: string;
  email: string;
  firstName?: string;
  consentMarketing: boolean;
  consentUpdates: boolean;
  source: string;
  ipAddress?: string;
  userAgent?: string;
  subscribedAt: Date;
  lastEmailSent?: Date;
  emailVerified: boolean;
  verificationToken?: string;
  unsubscribedAt?: Date;
}

export interface ConsentPreferences {
  consentMarketing?: boolean;
  consentUpdates?: boolean;
}

export interface SubscriberFilters {
  consentMarketing?: boolean;
  consentUpdates?: boolean;
  emailVerified?: boolean;
  source?: string;
  unsubscribed?: boolean;
}

// --- Zod Validation Schemas ---
const EmailSubscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  consentMarketing: z.boolean().optional(),
  consentUpdates: z.boolean().optional(),
  source: z.string().max(50).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// --- Service Functions ---
export async function addSubscriber(data: Partial<EmailSubscriber>): Promise<EmailSubscriber> {
  // Validate
  const parsed = EmailSubscriberSchema.safeParse(data);
  if (!parsed.success) throw new Error('Invalid subscriber data');
  const { email, firstName, consentMarketing = false, consentUpdates = true, source = 'pdf_download', ipAddress, userAgent } = parsed.data;
  // Duplicate handling
  try {
    // @ts-ignore: Replace with your db client
    const existing = await db.query('SELECT * FROM email_subscribers WHERE email = $1', [email]);
    if (existing.rows && existing.rows.length > 0) {
      // Already exists, return existing
      return mapRowToSubscriber(existing.rows[0]);
    }
    // Insert new
    // @ts-ignore: Replace with your db client
    const result = await db.query(
      `INSERT INTO email_subscribers (email, first_name, consent_marketing, consent_updates, source, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [email, firstName || null, consentMarketing, consentUpdates, source, ipAddress || null, userAgent || null]
    );
    auditLog('addSubscriber', email, { consentMarketing, consentUpdates, source });
    return mapRowToSubscriber(result.rows[0]);
  } catch (err) {
    console.error('addSubscriber error:', err);
    throw err;
  }
}

export async function updateConsent(email: string, consent: ConsentPreferences): Promise<void> {
  if (!z.string().email().safeParse(email).success) throw new Error('Invalid email');
  try {
    // @ts-ignore
    await db.query(
      `UPDATE email_subscribers SET consent_marketing = COALESCE($2, consent_marketing), consent_updates = COALESCE($3, consent_updates), updated_at = NOW() WHERE email = $1`,
      [email, consent.consentMarketing, consent.consentUpdates]
    );
    auditLog('updateConsent', email, consent);
  } catch (err) {
    console.error('updateConsent error:', err);
    throw err;
  }
}

export async function unsubscribe(email: string): Promise<void> {
  if (!z.string().email().safeParse(email).success) throw new Error('Invalid email');
  try {
    // @ts-ignore
    await db.query(
      `UPDATE email_subscribers SET unsubscribed_at = NOW(), updated_at = NOW() WHERE email = $1`,
      [email]
    );
    auditLog('unsubscribe', email);
  } catch (err) {
    console.error('unsubscribe error:', err);
    throw err;
  }
}

export async function getSubscribers(filters: SubscriberFilters = {}): Promise<EmailSubscriber[]> {
  let query = 'SELECT * FROM email_subscribers WHERE 1=1';
  const params: any[] = [];
  let idx = 1;
  if (filters.consentMarketing !== undefined) {
    query += ` AND consent_marketing = $${idx++}`;
    params.push(filters.consentMarketing);
  }
  if (filters.consentUpdates !== undefined) {
    query += ` AND consent_updates = $${idx++}`;
    params.push(filters.consentUpdates);
  }
  if (filters.emailVerified !== undefined) {
    query += ` AND email_verified = $${idx++}`;
    params.push(filters.emailVerified);
  }
  if (filters.source) {
    query += ` AND source = $${idx++}`;
    params.push(filters.source);
  }
  if (filters.unsubscribed !== undefined) {
    if (filters.unsubscribed) {
      query += ` AND unsubscribed_at IS NOT NULL`;
    } else {
      query += ` AND unsubscribed_at IS NULL`;
    }
  }
  query += ' ORDER BY subscribed_at DESC';
  try {
    // @ts-ignore
    const result = await db.query(query, params);
    return result.rows.map(mapRowToSubscriber);
  } catch (err) {
    console.error('getSubscribers error:', err);
    throw err;
  }
}

export async function markEmailSent(email: string): Promise<void> {
  if (!z.string().email().safeParse(email).success) throw new Error('Invalid email');
  try {
    // @ts-ignore
    await db.query(
      `UPDATE email_subscribers SET last_email_sent = NOW(), updated_at = NOW() WHERE email = $1`,
      [email]
    );
    auditLog('markEmailSent', email);
  } catch (err) {
    console.error('markEmailSent error:', err);
    throw err;
  }
}

// --- GDPR Compliance Utilities ---
export async function anonymizeSubscriber(email: string): Promise<void> {
  if (!z.string().email().safeParse(email).success) throw new Error('Invalid email');
  try {
    // @ts-ignore
    await db.query(
      `UPDATE email_subscribers SET email = NULL, first_name = NULL, ip_address = NULL, user_agent = NULL, updated_at = NOW() WHERE email = $1`,
      [email]
    );
    auditLog('anonymizeSubscriber', email);
  } catch (err) {
    console.error('anonymizeSubscriber error:', err);
    throw err;
  }
}

export async function exportSubscriberData(email: string): Promise<EmailSubscriber | null> {
  if (!z.string().email().safeParse(email).success) throw new Error('Invalid email');
  try {
    // @ts-ignore
    const result = await db.query('SELECT * FROM email_subscribers WHERE email = $1', [email]);
    if (result.rows && result.rows.length > 0) {
      return mapRowToSubscriber(result.rows[0]);
    }
    return null;
  } catch (err) {
    console.error('exportSubscriberData error:', err);
    throw err;
  }
}

// --- Helper: Map DB row to EmailSubscriber ---
function mapRowToSubscriber(row: any): EmailSubscriber {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name || undefined,
    consentMarketing: row.consent_marketing,
    consentUpdates: row.consent_updates,
    source: row.source,
    ipAddress: row.ip_address || undefined,
    userAgent: row.user_agent || undefined,
    subscribedAt: new Date(row.subscribed_at),
    lastEmailSent: row.last_email_sent ? new Date(row.last_email_sent) : undefined,
    emailVerified: row.email_verified,
    verificationToken: row.verification_token || undefined,
    unsubscribedAt: row.unsubscribed_at ? new Date(row.unsubscribed_at) : undefined,
  };
}

// --- Audit Logging ---
function auditLog(action: string, email: string, details?: any) {
  // Replace with a real audit log system if needed
  console.log(`[AUDIT] ${action} for ${email}`, details || '');
} 