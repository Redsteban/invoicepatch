-- InvoicePatch Initial Database Schema Migration
-- This migration creates the core tables for the invoicing platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Pre-orders table
-- Stores customer pre-order data from Stripe checkout sessions
CREATE TABLE preorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE,
  email TEXT NOT NULL,
  company_name TEXT,
  contractor_count INTEGER,
  current_system TEXT,
  biggest_pain_point TEXT,
  amount_paid DECIMAL(10,2) NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'annual', 'lifetime')),
  discount_percentage INTEGER DEFAULT 90,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email subscribers table
-- Manages email subscriptions and ConvertKit integration
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing_page',
  tags TEXT[],
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  convertkit_subscriber_id TEXT
);

-- Analytics events table
-- Tracks user behavior and conversion events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  user_id TEXT,
  email TEXT,
  properties JSONB,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Preorders indexes
CREATE INDEX idx_preorders_email ON preorders(email);
CREATE INDEX idx_preorders_stripe_session ON preorders(stripe_session_id);
CREATE INDEX idx_preorders_plan_type ON preorders(plan_type);
CREATE INDEX idx_preorders_status ON preorders(status);
CREATE INDEX idx_preorders_created_at ON preorders(created_at);

-- Email subscribers indexes
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_source ON email_subscribers(source);
CREATE INDEX idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at);
CREATE INDEX idx_email_subscribers_convertkit_id ON email_subscribers(convertkit_subscriber_id);

-- Analytics events indexes
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_email ON analytics_events(email);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- JSONB indexes for analytics properties
CREATE INDEX idx_analytics_events_properties ON analytics_events USING GIN (properties);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to preorders table
CREATE TRIGGER update_preorders_updated_at 
    BEFORE UPDATE ON preorders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Preorders policies
-- Allow service role full access (for API routes)
CREATE POLICY "Service role can manage preorders" ON preorders
    FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read their own preorders
CREATE POLICY "Users can read own preorders" ON preorders
    FOR SELECT USING (auth.email() = email);

-- Allow anonymous users to insert preorders (for checkout)
CREATE POLICY "Allow anonymous preorder creation" ON preorders
    FOR INSERT WITH CHECK (true);

-- Email subscribers policies
-- Allow service role full access
CREATE POLICY "Service role can manage subscribers" ON email_subscribers
    FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous users to subscribe
CREATE POLICY "Allow anonymous email subscription" ON email_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own subscription
CREATE POLICY "Users can read own subscription" ON email_subscribers
    FOR SELECT USING (auth.email() = email);

-- Analytics events policies
-- Allow service role full access
CREATE POLICY "Service role can manage analytics" ON analytics_events
    FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous users to insert analytics events
CREATE POLICY "Allow anonymous analytics tracking" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Allow users to read their own analytics
CREATE POLICY "Users can read own analytics" ON analytics_events
    FOR SELECT USING (auth.email() = email);

-- ============================================================================
-- UTILITY VIEWS
-- ============================================================================

-- Daily preorders summary view
CREATE VIEW daily_preorders AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(amount_paid) as total_revenue,
    COUNT(*) FILTER (WHERE plan_type = 'monthly') as monthly_plans,
    COUNT(*) FILTER (WHERE plan_type = 'annual') as annual_plans,
    COUNT(*) FILTER (WHERE plan_type = 'lifetime') as lifetime_plans
FROM preorders
WHERE status = 'paid'
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Email subscription sources summary
CREATE VIEW subscription_sources AS
SELECT 
    source,
    COUNT(*) as subscriber_count,
    DATE(subscribed_at) as signup_date
FROM email_subscribers
GROUP BY source, DATE(subscribed_at)
ORDER BY signup_date DESC, subscriber_count DESC;

-- Popular analytics events
CREATE VIEW popular_events AS
SELECT 
    event_name,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    DATE(created_at) as event_date
FROM analytics_events
GROUP BY event_name, DATE(created_at)
ORDER BY event_date DESC, event_count DESC;

-- ============================================================================
-- SAMPLE DATA (for development/testing)
-- ============================================================================

-- Insert sample preorder (remove in production)
INSERT INTO preorders (
    email, 
    company_name, 
    contractor_count, 
    current_system, 
    biggest_pain_point, 
    amount_paid, 
    plan_type,
    stripe_session_id
) VALUES (
    'founder@invoicepatch.com',
    'InvoicePatch Demo',
    5,
    'manual',
    'late_payments',
    29.99,
    'monthly',
    'cs_test_demo_session_123'
);

-- Insert sample email subscriber
INSERT INTO email_subscribers (
    email,
    source,
    tags
) VALUES (
    'founder@invoicepatch.com',
    'landing_page',
    ARRAY['founder', 'early_adopter']
);

-- Insert sample analytics event
INSERT INTO analytics_events (
    event_name,
    email,
    properties,
    page_url
) VALUES (
    'page_view',
    'founder@invoicepatch.com',
    '{"page": "pricing", "source": "organic"}',
    'https://invoicepatch.com/pricing'
);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log successful migration
DO $$
BEGIN
    RAISE NOTICE 'InvoicePatch initial schema migration completed successfully!';
    RAISE NOTICE 'Created tables: preorders, email_subscribers, analytics_events';
    RAISE NOTICE 'Enabled RLS and created security policies';
    RAISE NOTICE 'Added performance indexes';
    RAISE NOTICE 'Created utility views for analytics';
END $$; 