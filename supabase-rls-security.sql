-- Enable RLS on all tables
ALTER TABLE trial_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- Create user_id column if it doesn't exist (as UUID)
ALTER TABLE trial_invoices 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE daily_entries 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- RLS Policies for trial_invoices
-- Policy 1: Users can only see their own trials
CREATE POLICY "Users can view own trials" ON trial_invoices
    FOR SELECT USING (
        user_id = auth.uid() OR 
        contractor_email = auth.jwt() ->> 'email'::text
    );

-- Policy 2: Users can insert their own trials
CREATE POLICY "Users can insert own trials" ON trial_invoices
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR 
        contractor_email = auth.jwt() ->> 'email'::text
    );

-- Policy 3: Users can update their own trials
CREATE POLICY "Users can update own trials" ON trial_invoices
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        contractor_email = auth.jwt() ->> 'email'::text
    );

-- RLS Policies for daily_entries
-- Policy 1: Users can only see entries for their trials
CREATE POLICY "Users can view own entries" ON daily_entries
    FOR SELECT USING (
        user_id = auth.uid() OR
        trial_invoice_id IN (
            SELECT id FROM trial_invoices 
            WHERE user_id = auth.uid() OR 
                  contractor_email = auth.jwt() ->> 'email'::text
        )
    );

-- Policy 2: Users can insert entries for their trials
CREATE POLICY "Users can insert own entries" ON daily_entries
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR
        trial_invoice_id IN (
            SELECT id FROM trial_invoices 
            WHERE user_id = auth.uid() OR 
                  contractor_email = auth.jwt() ->> 'email'::text
        )
    );

-- Policy 3: Users can update their own entries
CREATE POLICY "Users can update own entries" ON daily_entries
    FOR UPDATE USING (
        user_id = auth.uid() OR
        trial_invoice_id IN (
            SELECT id FROM trial_invoices 
            WHERE user_id = auth.uid() OR 
                  contractor_email = auth.jwt() ->> 'email'::text
        )
    );

-- Function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Set user_id to current authenticated user
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to automatically set user_id
DROP TRIGGER IF EXISTS set_user_id_trigger ON trial_invoices;
CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON trial_invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

DROP TRIGGER IF EXISTS set_user_id_trigger ON daily_entries;
CREATE TRIGGER set_user_id_trigger
    BEFORE INSERT ON daily_entries
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON trial_invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_entries TO authenticated;

-- Allow anonymous access for trial creation (before auth)
GRANT SELECT, INSERT ON trial_invoices TO anon;
GRANT SELECT, INSERT ON daily_entries TO anon; 