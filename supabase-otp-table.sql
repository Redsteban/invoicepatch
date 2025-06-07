-- Create OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL, -- Hashed version of the actual code
    purpose TEXT NOT NULL CHECK (purpose IN ('login', 'trial_access', 'password_reset', 'account_verification')),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    ip_address TEXT NOT NULL,
    verified_ip TEXT,
    user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_purpose ON otp_codes(purpose);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at ON otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_otp_codes_created_at ON otp_codes(created_at);
CREATE INDEX IF NOT EXISTS idx_otp_codes_verified ON otp_codes(verified);

-- RLS policies for OTP codes
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own OTP codes (by email)
CREATE POLICY "Users can access own OTP codes" ON otp_codes
    FOR ALL USING (
        email = auth.jwt() ->> 'email'::text
    );

-- Service role can manage all OTP codes (for cleanup, etc.)
CREATE POLICY "Service role full access" ON otp_codes
    FOR ALL USING (auth.role() = 'service_role');

-- Function to automatically clean up expired OTP codes
CREATE OR REPLACE FUNCTION cleanup_expired_otp_codes()
RETURNS void AS $$
BEGIN
    -- Delete expired OTP codes older than 24 hours
    DELETE FROM otp_codes 
    WHERE expires_at < NOW() - INTERVAL '24 hours';
    
    -- Delete old verified codes older than 7 days
    DELETE FROM otp_codes 
    WHERE verified = true 
    AND verified_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up OTP codes (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-otp-codes', '0 2 * * *', 'SELECT cleanup_expired_otp_codes();');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON otp_codes TO authenticated;
GRANT SELECT, INSERT ON otp_codes TO anon; -- For trial access without login

-- Trigger to prevent updating verified OTP codes
CREATE OR REPLACE FUNCTION prevent_otp_tampering()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent changing verified OTP codes
    IF OLD.verified = true AND NEW.verified = false THEN
        RAISE EXCEPTION 'Cannot unverify an OTP code';
    END IF;
    
    -- Prevent changing the code after creation
    IF OLD.code IS DISTINCT FROM NEW.code THEN
        RAISE EXCEPTION 'Cannot modify OTP code after creation';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_otp_tampering_trigger
    BEFORE UPDATE ON otp_codes
    FOR EACH ROW
    EXECUTE FUNCTION prevent_otp_tampering(); 