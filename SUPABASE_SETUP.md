# InvoicePatch Supabase Integration

Complete setup guide for Supabase database integration with InvoicePatch.

## 🎯 Overview

This integration provides:
- **Customer Management**: Pre-order customer data with Stripe integration
- **Email Marketing**: Subscriber management with ConvertKit sync
- **Analytics Tracking**: User behavior and conversion tracking
- **Referral System**: Complete referral program management
- **Waiting List**: Priority queue for product launch

## 📋 Prerequisites

- Supabase account (free tier available)
- Node.js 18+ 
- TypeScript project setup
- Stripe account (for payment integration)

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready (2-3 minutes)
4. Go to **Settings > API** and copy your credentials

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: ConvertKit Integration
CONVERTKIT_API_KEY=your-convertkit-api-key
CONVERTKIT_API_SECRET=your-convertkit-api-secret
CONVERTKIT_NEWSLETTER_FORM_ID=your-form-id
CONVERTKIT_FOUNDER_UPDATES_FORM_ID=your-form-id
```

### 3. Database Schema Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the contents of `supabase-schema.sql` (found in the project root)

This will create:
- All necessary tables with proper indexes
- Row Level Security (RLS) policies
- Helpful views for analytics
- Sample data for testing

### 4. Verify Installation

Run this test to verify everything is working:

```bash
npm run dev
```

Then check the console for any Supabase connection errors.

## 📚 Database Schema

### Core Tables

#### `pre_order_customers`
Stores all customer data from Stripe checkout sessions:
- Customer information (email, company, contractor count)
- Payment details (amount paid, plan type, Stripe IDs)
- Referral tracking (codes, referrer information)
- Founder program status

#### `email_subscribers`
Manages email subscriptions:
- Contact information (email, first/last name)
- Subscription source tracking
- ConvertKit integration IDs
- Tag management

#### `referrals`
Tracks referral program:
- Referrer and referred email addresses
- Commission tracking and payment status
- Stripe payment intent integration

#### `analytics_events`
User behavior tracking:
- Event names and custom data
- Session and user identification
- Request metadata (user agent, IP, referrer)

#### `waiting_list`
Pre-launch waiting list management:
- Priority scoring system
- Conversion tracking
- Pain point analysis

### Views for Analytics

#### `customer_summary`
- Customer data with referral information
- Customer tier classification (Founder, Paid, Free)

#### `daily_signups`
- Daily signup statistics
- Revenue tracking
- Founder member counts

#### `referral_stats`
- Per-referrer performance metrics
- Commission tracking

## 🔧 API Integration

### Customer Operations

```typescript
import { customerOperations } from '@/lib/supabase';

// Get customer by email
const customer = await customerOperations.getByEmail('user@example.com');

// Get customer by Stripe session
const customer = await customerOperations.getByStripeSession('cs_test_123');

// Generate unique referral code
const code = await customerOperations.generateReferralCode('user@example.com');

// Get signup statistics
const stats = await customerOperations.getStats();
```

### Email Subscriber Operations

```typescript
import { subscriberOperations } from '@/lib/supabase';

// Get subscriber by email
const subscriber = await subscriberOperations.getByEmail('user@example.com');

// Get subscriber statistics by source
const stats = await subscriberOperations.getStatsBySource();
```

### Analytics Tracking

```typescript
import { analyticsOperations } from '@/lib/supabase';

// Track an event
await analyticsOperations.trackEvent({
  event_name: 'page_view',
  event_data: { page: '/pricing' },
  user_id: 'user-123',
  session_id: 'session-456',
  page_url: window.location.href,
  user_agent: navigator.userAgent
});

// Get event counts
const counts = await analyticsOperations.getEventCounts(
  '2024-01-01', // start date
  '2024-01-31'  // end date
);
```

## 🔒 Security & RLS Policies

Row Level Security is enabled with the following policies:

### Service Role Access
- Full access for API routes using service role key
- Used for server-side operations

### Anonymous Access
- Read access to customer data (for customer lookups)
- Insert access for analytics events
- Insert access for waiting list signups
- Insert access for email subscriptions

### Production Considerations
- Tighten RLS policies before production
- Implement user authentication for sensitive data
- Add rate limiting for public endpoints
- Monitor database usage and optimize queries

## 📊 Analytics & Monitoring

### Built-in Analytics
- Customer signup tracking
- Email subscription metrics
- Referral program performance
- Revenue tracking

### Custom Event Tracking
Track any custom events:
```typescript
// Track button clicks
analyticsOperations.trackEvent({
  event_name: 'button_click',
  event_data: { 
    button_id: 'pricing-cta',
    page: '/pricing'
  }
});

// Track form submissions
analyticsOperations.trackEvent({
  event_name: 'form_submit',
  event_data: { 
    form_type: 'contact',
    success: true
  }
});
```

### Health Monitoring
```typescript
import { healthCheck } from '@/lib/supabase';

const health = await healthCheck();
console.log('Database status:', health);
```

## 🔄 Data Migration

### From Development to Production
1. Export schema using Supabase CLI
2. Remove sample data from schema
3. Apply schema to production database
4. Update environment variables

### Backup Strategy
- Enable automated backups in Supabase dashboard
- Export critical data regularly
- Test restoration procedures

## 🐛 Troubleshooting

### Common Issues

#### "Missing env.NEXT_PUBLIC_SUPABASE_URL"
- Ensure environment variables are set in `.env.local`
- Restart development server after adding variables

#### "Database connection failed"
- Check Supabase project status in dashboard
- Verify URLs and keys are correct
- Ensure IP is allowlisted (if using IP restrictions)

#### "Row Level Security violation"
- Check RLS policies in Supabase dashboard
- Ensure service role key has proper permissions
- Verify table permissions

### Debug Mode
Enable debug logging:
```typescript
// In development
process.env.NODE_ENV === 'development' && console.log('Supabase Debug:', data);
```

## 📈 Performance Optimization

### Indexing
The schema includes optimized indexes for:
- Email lookups (customers and subscribers)
- Stripe session/customer ID lookups
- Date-based queries (analytics, signups)
- Referral code lookups

### Query Optimization
- Use specific column selection instead of `SELECT *`
- Implement pagination for large result sets
- Use database views for complex aggregations

### Caching
Consider implementing caching for:
- Frequently accessed customer data
- Analytics aggregations
- Referral statistics

## 🚀 Production Deployment

### Environment Setup
1. Create production Supabase project
2. Apply schema without sample data
3. Configure production environment variables
4. Set up monitoring and alerts

### Security Checklist
- [ ] Remove sample data from production
- [ ] Tighten RLS policies
- [ ] Enable audit logging
- [ ] Set up IP restrictions (if needed)
- [ ] Configure backup schedules
- [ ] Set up monitoring alerts

## 📞 Support

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [TypeScript Support](https://supabase.com/docs/guides/api/generating-types)

### Project-Specific Help
- Check the `src/lib/supabase.ts` file for utility functions
- Review API routes in `src/app/api/` for implementation examples
- Test with sample data before modifying schema

---

## ✅ Integration Complete!

Your Supabase integration is now ready for:
- ✅ Customer data management
- ✅ Email subscription tracking  
- ✅ Analytics and event tracking
- ✅ Referral program management
- ✅ Stripe payment integration
- ✅ ConvertKit email automation

The integration provides a robust foundation for your invoicing platform's data needs.
