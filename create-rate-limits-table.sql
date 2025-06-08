-- Create rate_limits table for OTP and API rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    ip_address TEXT,
    action_type TEXT NOT NULL CHECK (action_type IN ('otp_request', 'login_attempt', 'api_call', 'password_reset')),
    window_start TIMESTAMPTZ NOT NULL,
    request_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_email ON rate_limits(email);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_action_type ON rate_limits(action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON rate_limits(created_at);

-- Composite index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(email, ip_address, action_type, window_start);

-- RLS policies for rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role can manage all rate limit records
CREATE POLICY "Service role full access" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

-- Function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    -- Delete rate limit records older than 24 hours
    DELETE FROM rate_limits 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON rate_limits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON rate_limits TO anon; 