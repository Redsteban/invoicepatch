-- Create security_sessions table for session management
-- This table stores user authentication sessions with security features

CREATE TABLE IF NOT EXISTS security_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45), -- Supports both IPv4 and IPv6
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_sessions_user_id ON security_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_security_sessions_session_token ON security_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_security_sessions_expires_at ON security_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_sessions_active_lookup ON security_sessions(session_token, is_active, expires_at);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_security_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_security_sessions_updated_at
  BEFORE UPDATE ON security_sessions
  FOR EACH ROW EXECUTE FUNCTION update_security_sessions_updated_at();

-- Enable Row Level Security
ALTER TABLE security_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for security_sessions table
-- Allow service role to manage all sessions
CREATE POLICY "Service role can manage sessions" ON security_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read their own sessions only
CREATE POLICY "Users can read own sessions" ON security_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to update their own sessions (for last_accessed)
CREATE POLICY "Users can update own sessions" ON security_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to deactivate their own sessions
CREATE POLICY "Users can deactivate own sessions" ON security_sessions
  FOR UPDATE USING (auth.uid() = user_id AND is_active = false);

-- Grant necessary permissions
GRANT ALL ON security_sessions TO service_role;
GRANT SELECT, UPDATE ON security_sessions TO authenticated;
GRANT USAGE ON SEQUENCE security_sessions_id_seq TO service_role;

-- Function to cleanup expired sessions (call this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE security_sessions 
  SET is_active = false, updated_at = NOW()
  WHERE expires_at < NOW() AND is_active = true;
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log the cleanup (if audit_logs table exists)
  BEGIN
    INSERT INTO audit_logs (action, details, success, created_at)
    VALUES ('session_cleanup', jsonb_build_object('expired_sessions', expired_count), true, NOW());
  EXCEPTION
    WHEN undefined_table THEN
      -- Ignore if audit_logs table doesn't exist
      NULL;
  END;
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on cleanup function
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO service_role;

-- Function to get active session count for a user
CREATE OR REPLACE FUNCTION get_user_active_sessions(target_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM security_sessions
    WHERE user_id = target_user_id 
    AND is_active = true 
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_active_sessions(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_user_active_sessions(UUID) TO authenticated;

-- Comment on table
COMMENT ON TABLE security_sessions IS 'Stores user authentication sessions with security tracking';
COMMENT ON COLUMN security_sessions.session_token IS 'Unique session identifier token';
COMMENT ON COLUMN security_sessions.expires_at IS 'When the session expires';
COMMENT ON COLUMN security_sessions.ip_address IS 'IP address when session was created';
COMMENT ON COLUMN security_sessions.user_agent IS 'Browser/client user agent string';
COMMENT ON COLUMN security_sessions.is_active IS 'Whether session is currently active';
COMMENT ON COLUMN security_sessions.last_accessed IS 'Last time session was used'; 