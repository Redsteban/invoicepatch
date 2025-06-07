-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own trials" ON trial_invoices;
DROP POLICY IF EXISTS "Users can insert own trials" ON trial_invoices;
DROP POLICY IF EXISTS "Users can update own trials" ON trial_invoices;
DROP POLICY IF EXISTS "Users can view own entries" ON daily_entries;
DROP POLICY IF EXISTS "Users can insert own entries" ON daily_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON daily_entries;

-- Ensure RLS is enabled
ALTER TABLE trial_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- Add user_id column if it doesn't exist (as UUID)
DO $$ 
BEGIN
    -- Add user_id to trial_invoices if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'trial_invoices' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE trial_invoices ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add user_id to daily_entries if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'daily_entries' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE daily_entries ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- CORRECTED RLS Policies for trial_invoices
-- Policy 1: Users can view their own trials (by user_id or email)
CREATE POLICY "Users can view own trials" ON trial_invoices
    FOR SELECT USING (
        (user_id IS NOT NULL AND user_id = auth.uid()) OR 
        (contractor_email = COALESCE(auth.jwt() ->> 'email', ''))
    );

-- Policy 2: Users can insert trials (with proper user_id setting)
CREATE POLICY "Users can insert own trials" ON trial_invoices
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR 
        contractor_email = COALESCE(auth.jwt() ->> 'email', '') OR
        auth.role() = 'anon'  -- Allow anonymous trial creation
    );

-- Policy 3: Users can update their own trials
CREATE POLICY "Users can update own trials" ON trial_invoices
    FOR UPDATE USING (
        (user_id IS NOT NULL AND user_id = auth.uid()) OR 
        (contractor_email = COALESCE(auth.jwt() ->> 'email', ''))
    );

-- CORRECTED RLS Policies for daily_entries
-- Policy 1: Users can view entries for their trials
CREATE POLICY "Users can view own entries" ON daily_entries
    FOR SELECT USING (
        (user_id IS NOT NULL AND user_id = auth.uid()) OR
        trial_invoice_id IN (
            SELECT id FROM trial_invoices 
            WHERE (user_id IS NOT NULL AND user_id = auth.uid()) OR 
                  contractor_email = COALESCE(auth.jwt() ->> 'email', '')
        )
    );

-- Policy 2: Users can insert entries for their trials
CREATE POLICY "Users can insert own entries" ON daily_entries
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR
        trial_invoice_id IN (
            SELECT id FROM trial_invoices 
            WHERE (user_id IS NOT NULL AND user_id = auth.uid()) OR 
                  contractor_email = COALESCE(auth.jwt() ->> 'email', '') OR
                  auth.role() = 'anon'  -- Allow anonymous entry creation during trial
        )
    );

-- Policy 3: Users can update their own entries
CREATE POLICY "Users can update own entries" ON daily_entries
    FOR UPDATE USING (
        (user_id IS NOT NULL AND user_id = auth.uid()) OR
        trial_invoice_id IN (
            SELECT id FROM trial_invoices 
            WHERE (user_id IS NOT NULL AND user_id = auth.uid()) OR 
                  contractor_email = COALESCE(auth.jwt() ->> 'email', '')
        )
    );

-- Function to automatically set user_id when available
CREATE OR REPLACE FUNCTION set_user_id_if_authenticated()
RETURNS TRIGGER AS $$
BEGIN
    -- Only set user_id if user is authenticated (not anonymous)
    IF auth.uid() IS NOT NULL THEN
        NEW.user_id = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic user_id setting
DROP TRIGGER IF EXISTS set_user_id_trigger ON trial_invoices;
CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON trial_invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id_if_authenticated();

DROP TRIGGER IF EXISTS set_user_id_trigger ON daily_entries;
CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON daily_entries
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id_if_authenticated();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON trial_invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_entries TO authenticated;

-- Allow anonymous access for trial functionality
GRANT SELECT, INSERT, UPDATE ON trial_invoices TO anon;
GRANT SELECT, INSERT, UPDATE ON daily_entries TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trial_invoices_user_id ON trial_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_trial_invoices_email ON trial_invoices(contractor_email);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_trial_id ON daily_entries(trial_invoice_id);

-- Test the policies (you can run these to verify)
/*
-- Test queries to verify RLS is working:

-- As authenticated user:
SELECT * FROM trial_invoices WHERE user_id = auth.uid();

-- As anonymous user (by email):
SELECT * FROM trial_invoices WHERE contractor_email = 'test@example.com';

-- Join test:
SELECT t.*, d.* 
FROM trial_invoices t 
LEFT JOIN daily_entries d ON t.id = d.trial_invoice_id 
WHERE t.contractor_email = 'test@example.com';
*/ 