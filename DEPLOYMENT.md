# InvoicePatch Deployment Guide

## Vercel Deployment Setup

### Required Environment Variables

Add these environment variables in your Vercel project dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Optional Environment Variables

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your `invoicepatch` project
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate values
5. Redeploy your application

## Supabase Setup Requirements:

The application expects these database tables:
- `trial_invoices` - For storing trial setup data
- `daily_checkins` - For storing daily work logs

### Sample Database Schema:

```sql
-- Trial invoices table
CREATE TABLE trial_invoices (
  trial_id TEXT PRIMARY KEY,
  company TEXT,
  location TEXT,
  ticket_number TEXT,
  day_rate DECIMAL,
  truck_rate DECIMAL,
  work_days JSONB,
  contractor_name TEXT,
  contractor_address TEXT,
  gst_number TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily check-ins table  
CREATE TABLE daily_checkins (
  id SERIAL PRIMARY KEY,
  trial_id TEXT REFERENCES trial_invoices(trial_id),
  check_in_date DATE,
  worked_today BOOLEAN,
  day_rate_used BOOLEAN,
  truck_used BOOLEAN,
  travel_kms DECIMAL,
  subsistence DECIMAL,
  additional_charges DECIMAL,
  work_start_time TIME,
  work_end_time TIME,
  daily_total DECIMAL,
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment Checklist:

- [x] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Environment variables added to Vercel
- [ ] Vercel deployment triggered
- [ ] Application tested in production

## Current Status:

✅ All code is committed and pushed to GitHub (commit: 44961e0)
❌ Vercel deployment failing due to missing environment variables 