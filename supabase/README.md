# InvoicePatch Supabase Database Setup

This directory contains database migrations and setup instructions for the InvoicePatch application.

## 📋 Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Project credentials added to `.env.local`

## 🚀 Quick Setup

### Option 1: Run Migration via Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - Navigate to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your InvoicePatch project

2. **Open SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Create a new query

3. **Run the Migration**
   - Copy the entire contents of `migrations/20241201000000_initial_schema.sql`
   - Paste into the SQL Editor
   - Click **Run** to execute

### Option 2: Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## 📊 Database Schema Overview

### Tables Created

#### `preorders`
- **Purpose**: Store customer pre-order data from Stripe
- **Key Fields**: `email`, `stripe_session_id`, `amount_paid`, `plan_type`
- **Features**: Automatic timestamps, status tracking, discount percentage

#### `email_subscribers` 
- **Purpose**: Manage email subscriptions and ConvertKit integration
- **Key Fields**: `email`, `source`, `tags`, `convertkit_subscriber_id`
- **Features**: Source tracking, tag management

#### `analytics_events`
- **Purpose**: Track user behavior and conversion events
- **Key Fields**: `event_name`, `user_id`, `email`, `properties`
- **Features**: JSONB properties for flexible event data

### Views for Analytics

#### `daily_preorders`
```sql
SELECT * FROM daily_preorders;
```
Shows daily order statistics, revenue, and plan type breakdown.

#### `subscription_sources`
```sql
SELECT * FROM subscription_sources;
```
Tracks where email subscribers are coming from.

#### `popular_events`
```sql
SELECT * FROM popular_events;
```
Shows most popular analytics events and unique user counts.

## 🔒 Security Features

### Row Level Security (RLS)
- **Enabled** on all tables
- **Service role** has full access for API operations
- **Anonymous users** can insert preorders and analytics events
- **Authenticated users** can read their own data

### Security Policies
- Separate policies for different user roles
- Anonymous access for checkout and analytics
- User-specific data access for authenticated users

## 📈 Performance Optimizations

### Indexes Created
- **Email lookups**: Fast customer queries
- **Stripe session IDs**: Quick payment verification
- **Date-based queries**: Efficient analytics and reporting
- **JSONB properties**: Fast analytics event filtering

### Query Performance Tips
```sql
-- Use indexes for fast lookups
SELECT * FROM preorders WHERE email = 'user@example.com';

-- Efficient date filtering
SELECT * FROM analytics_events 
WHERE created_at >= '2024-01-01' 
AND event_name = 'purchase';

-- JSONB property queries
SELECT * FROM analytics_events 
WHERE properties->>'page' = 'pricing';
```

## 🔧 API Integration

### Example Queries for Your API Routes

#### Create Preorder (Stripe Webhook)
```sql
INSERT INTO preorders (
  email, stripe_session_id, company_name, 
  amount_paid, plan_type
) VALUES ($1, $2, $3, $4, $5);
```

#### Track Analytics Event
```sql
INSERT INTO analytics_events (
  event_name, user_id, email, properties, page_url
) VALUES ($1, $2, $3, $4, $5);
```

#### Subscribe Email
```sql
INSERT INTO email_subscribers (email, source, tags)
VALUES ($1, $2, $3)
ON CONFLICT (email) DO UPDATE SET
  source = EXCLUDED.source,
  tags = email_subscribers.tags || EXCLUDED.tags;
```

## 🎯 Testing the Setup

After running the migration, test with:

```bash
# Test health check endpoint
curl http://localhost:3000/api/health

# Should show:
# ✅ Database: Connected
# ✅ Tables: Created successfully
```

## 🗂️ Sample Data

The migration includes sample data for testing:
- Sample preorder from `founder@invoicepatch.com`
- Sample email subscriber
- Sample analytics event

**Remove sample data in production** by running:
```sql
DELETE FROM preorders WHERE email = 'founder@invoicepatch.com';
DELETE FROM email_subscribers WHERE email = 'founder@invoicepatch.com';
DELETE FROM analytics_events WHERE email = 'founder@invoicepatch.com';
```

## 🔄 Migration History

| Migration | Date | Description |
|-----------|------|-------------|
| `20241201000000_initial_schema.sql` | 2024-12-01 | Initial database schema with preorders, email_subscribers, and analytics_events |

## 🐛 Troubleshooting

### Common Issues

#### "Permission denied for schema public"
- Check that your service role key is correct
- Verify RLS policies are properly configured

#### "Relation does not exist"
- Ensure migration ran successfully
- Check for syntax errors in SQL

#### "Column does not exist"
- Verify migration completed fully
- Check for partial migration execution

### Debug Commands
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables WHERE schemaname = 'public';

-- View policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## 📞 Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **SQL Reference**: [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Project Issues**: Check your InvoicePatch project repository

---

## ✅ Migration Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Migration SQL executed successfully
- [ ] Health check endpoint passes
- [ ] Sample data visible in dashboard
- [ ] API routes can connect to database
- [ ] RLS policies working correctly

Your InvoicePatch database is ready! 🚀 