# Vercel Deployment Guide for InvoicePatch

## Required Environment Variables

To fix the deployment error, you need to set these environment variables in your Vercel dashboard:

### 1. Supabase Configuration (Required)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Application Configuration
```
NEXT_PUBLIC_APP_URL=https://your-vercel-app-url.vercel.app
NODE_ENV=production
```

### 3. Optional Variables (for full functionality)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

## Step-by-Step Deployment Fix

### 1. Set Environment Variables in Vercel
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `invoicepatch` project
3. Go to Settings → Environment Variables
4. Add each required variable:
   - Variable Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environment: Production (and Preview if needed)

### 2. Get Supabase Credentials
If you don't have Supabase set up yet:
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Quick Fix (Minimal Setup)
For immediate deployment, set these minimal variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key
SUPABASE_SERVICE_ROLE_KEY=placeholder_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Redeploy
After setting environment variables:
1. Go to Deployments tab in Vercel
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Troubleshooting

### If you get Stripe errors:
- Either set up Stripe keys or remove Stripe-related API routes temporarily

### If you get database errors:
- Make sure Supabase is set up with the schema from `supabase-schema.sql`
- Or temporarily comment out database calls in API routes

### Build still failing?
Try these minimal environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_key
SUPABASE_SERVICE_ROLE_KEY=demo_key
```

## Post-Deployment Setup
1. Set up proper Supabase database
2. Configure Stripe for payments
3. Set up email service (Resend)
4. Add Google Analytics
5. Update environment variables with real values

## Contact for Help
If you need help with specific credentials or setup, let me know which service you'd like to configure first. 