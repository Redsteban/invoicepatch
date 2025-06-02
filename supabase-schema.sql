-- InvoicePatch Database Schema
-- Complete Supabase database setup for the invoicing platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enums
CREATE TYPE customer_status AS ENUM ('pending', 'active', 'inactive', 'refunded');
CREATE TYPE plan_type AS ENUM ('contractor_monthly', 'manager_platform', 'complete_system');
CREATE TYPE invoicing_method AS ENUM ('manual', 'excel', 'quickbooks', 'other_software', 'none');
CREATE TYPE pain_point AS ENUM ('late_payments', 'follow_up_hassle', 'tax_compliance', 'time_consuming', 'poor_organization', 'client_disputes');
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE waiting_list_status AS ENUM ('active', 'notified', 'converted', 'removed');
CREATE TYPE subscription_source AS ENUM ('landing_page', 'pricing_page', 'blog', 'referral', 'social_media', 'direct');

-- Table: pre_order_customers
-- Stores all pre-order customer data from Stripe checkout sessions
CREATE TABLE pre_order_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Customer information
    email VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contractor_count INTEGER NOT NULL DEFAULT 1,
    current_invoicing_method invoicing_method NOT NULL DEFAULT 'manual',
    biggest_pain_point pain_point NOT NULL DEFAULT 'late_payments',
    
    -- Payment information
    amount_paid BIGINT NOT NULL DEFAULT 0, -- Store in cents
    plan_type plan_type NOT NULL DEFAULT 'contractor_monthly',
    stripe_customer_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    
    -- Referral system
    referral_code VARCHAR(50),
    referred_by VARCHAR(255), -- Email of referrer
    
    -- Email marketing
    email_sequences_subscribed TEXT[] DEFAULT '{}',
    
    -- Founder program
    founder_number INTEGER,
    is_founder BOOLEAN DEFAULT true,
    
    -- Status tracking
    status customer_status DEFAULT 'pending'
);

-- Table: email_subscribers
-- Manages email subscriptions separately from customers
CREATE TABLE email_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    subscription_source subscription_source NOT NULL DEFAULT 'landing_page',
    is_active BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    
    -- ConvertKit integration
    convertkit_subscriber_id VARCHAR(255),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Table: referrals
-- Tracks referral program data
CREATE TABLE referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    referrer_email VARCHAR(255) NOT NULL,
    referred_email VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50) NOT NULL,
    status referral_status DEFAULT 'pending',
    
    -- Commission tracking
    commission_amount BIGINT, -- In cents
    commission_paid BOOLEAN DEFAULT false,
    commission_paid_at TIMESTAMP WITH TIME ZONE,
    stripe_payment_intent_id VARCHAR(255),
    
    UNIQUE(referrer_email, referred_email)
);

-- Table: analytics_events
-- Tracks user behavior and conversion events
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    
    -- User identification
    user_id UUID,
    session_id VARCHAR(255),
    
    -- Request metadata
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    referrer TEXT
);

-- Table: waiting_list
-- Manages waiting list for product launch
CREATE TABLE waiting_list (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    email VARCHAR(255) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    contractor_count INTEGER,
    current_pain_points pain_point[] DEFAULT '{}',
    expected_monthly_invoice_volume INTEGER,
    
    -- Prioritization
    priority_score INTEGER DEFAULT 0,
    status waiting_list_status DEFAULT 'active',
    
    -- Conversion tracking
    notified_at TIMESTAMP WITH TIME ZONE,
    converted_to_customer BOOLEAN DEFAULT false,
    converted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX idx_pre_order_customers_email ON pre_order_customers(email);
CREATE INDEX idx_pre_order_customers_stripe_session ON pre_order_customers(stripe_session_id);
CREATE INDEX idx_pre_order_customers_stripe_customer ON pre_order_customers(stripe_customer_id);
CREATE INDEX idx_pre_order_customers_referral_code ON pre_order_customers(referral_code);
CREATE INDEX idx_pre_order_customers_created_at ON pre_order_customers(created_at);
CREATE INDEX idx_pre_order_customers_plan_type ON pre_order_customers(plan_type);
CREATE INDEX idx_pre_order_customers_status ON pre_order_customers(status);

CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_is_active ON email_subscribers(is_active);
CREATE INDEX idx_email_subscribers_source ON email_subscribers(subscription_source);
CREATE INDEX idx_email_subscribers_created_at ON email_subscribers(created_at);

CREATE INDEX idx_referrals_referrer_email ON referrals(referrer_email);
CREATE INDEX idx_referrals_referred_email ON referrals(referred_email);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);

CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);

CREATE INDEX idx_waiting_list_email ON waiting_list(email);
CREATE INDEX idx_waiting_list_status ON waiting_list(status);
CREATE INDEX idx_waiting_list_priority_score ON waiting_list(priority_score DESC);
CREATE INDEX idx_waiting_list_created_at ON waiting_list(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to tables that need them
CREATE TRIGGER update_pre_order_customers_updated_at 
    BEFORE UPDATE ON pre_order_customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_subscribers_updated_at 
    BEFORE UPDATE ON email_subscribers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at 
    BEFORE UPDATE ON referrals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_waiting_list_updated_at 
    BEFORE UPDATE ON waiting_list 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Note: These are very permissive for a pre-launch product
-- Tighten these policies before going to production

ALTER TABLE pre_order_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for API routes)
CREATE POLICY "Service role can do everything" ON pre_order_customers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON email_subscribers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON referrals
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON analytics_events
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON waiting_list
    FOR ALL USING (auth.role() = 'service_role');

-- Policy: Allow anonymous users to read public data (for customer lookups)
CREATE POLICY "Allow anonymous read access for customer lookups" ON pre_order_customers
    FOR SELECT USING (true);

-- Policy: Allow anonymous users to insert analytics events
CREATE POLICY "Allow anonymous analytics tracking" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Policy: Allow anonymous users to join waiting list
CREATE POLICY "Allow anonymous waiting list signup" ON waiting_list
    FOR INSERT WITH CHECK (true);

-- Policy: Allow anonymous users to subscribe to emails
CREATE POLICY "Allow anonymous email subscription" ON email_subscribers
    FOR INSERT WITH CHECK (true);

-- Create useful views for analytics and reporting

-- View: Customer summary with referral stats
CREATE VIEW customer_summary AS
SELECT 
    pc.*,
    r.referrer_email,
    r.commission_amount,
    r.commission_paid,
    CASE 
        WHEN pc.founder_number IS NOT NULL THEN 'Founder'
        WHEN pc.amount_paid > 0 THEN 'Paid Customer'
        ELSE 'Free User'
    END as customer_tier
FROM pre_order_customers pc
LEFT JOIN referrals r ON pc.email = r.referred_email;

-- View: Daily sign-up stats
CREATE VIEW daily_signups AS
SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE amount_paid > 0) as paid_signups,
    COUNT(*) FILTER (WHERE is_founder = true) as founder_signups,
    SUM(amount_paid) as total_revenue
FROM pre_order_customers
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;

-- View: Referral program stats
CREATE VIEW referral_stats AS
SELECT 
    referrer_email,
    COUNT(*) as total_referrals,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_referrals,
    SUM(commission_amount) FILTER (WHERE commission_paid = true) as total_commissions_paid,
    SUM(commission_amount) FILTER (WHERE commission_paid = false) as pending_commissions
FROM referrals
GROUP BY referrer_email
ORDER BY total_referrals DESC;

-- Insert some sample data for testing (remove in production)
INSERT INTO pre_order_customers (
    email, 
    company_name, 
    contractor_count, 
    current_invoicing_method, 
    biggest_pain_point, 
    amount_paid, 
    plan_type,
    founder_number,
    is_founder
) VALUES 
    ('founder@example.com', 'Test Construction Co', 5, 'manual', 'late_payments', 9900, 'contractor_monthly', 1, true),
    ('customer@example.com', 'Sample Contractors', 3, 'excel', 'follow_up_hassle', 19900, 'manager_platform', 2, true);

-- Success message
SELECT 'InvoicePatch Supabase schema has been successfully created!' as message;
