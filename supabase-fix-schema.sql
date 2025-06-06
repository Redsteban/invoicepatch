-- InvoicePatch Schema Fix for Existing Tables
-- This script adds missing columns to existing tables

-- Check if columns exist and add them if missing

-- Add missing columns to trial_invoices if they don't exist
DO $$ 
BEGIN
    -- Add sequence_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'sequence_number') THEN
        ALTER TABLE trial_invoices ADD COLUMN sequence_number TEXT NOT NULL DEFAULT 'INV-TEMP-' || gen_random_uuid()::text;
    END IF;
    
    -- Add contractor_phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'contractor_phone') THEN
        ALTER TABLE trial_invoices ADD COLUMN contractor_phone TEXT;
    END IF;
    
    -- Add end_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'end_date') THEN
        ALTER TABLE trial_invoices ADD COLUMN end_date DATE;
    END IF;
    
    -- Add trial_day column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'trial_day') THEN
        ALTER TABLE trial_invoices ADD COLUMN trial_day INTEGER DEFAULT 1;
    END IF;
    
    -- Add day_rate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'day_rate') THEN
        ALTER TABLE trial_invoices ADD COLUMN day_rate DECIMAL(10,2) NOT NULL DEFAULT 450.00;
    END IF;
    
    -- Add truck_rate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'truck_rate') THEN
        ALTER TABLE trial_invoices ADD COLUMN truck_rate DECIMAL(10,2) NOT NULL DEFAULT 150.00;
    END IF;
    
    -- Add travel_kms column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'travel_kms') THEN
        ALTER TABLE trial_invoices ADD COLUMN travel_kms INTEGER NOT NULL DEFAULT 45;
    END IF;
    
    -- Add rate_per_km column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'rate_per_km') THEN
        ALTER TABLE trial_invoices ADD COLUMN rate_per_km DECIMAL(10,2) NOT NULL DEFAULT 0.68;
    END IF;
    
    -- Add subsistence column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'subsistence') THEN
        ALTER TABLE trial_invoices ADD COLUMN subsistence DECIMAL(10,2) NOT NULL DEFAULT 75.00;
    END IF;
    
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'location') THEN
        ALTER TABLE trial_invoices ADD COLUMN location TEXT NOT NULL DEFAULT 'Calgary, AB';
    END IF;
    
    -- Add company column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'company') THEN
        ALTER TABLE trial_invoices ADD COLUMN company TEXT NOT NULL DEFAULT 'ABC Construction';
    END IF;
    
    -- Add total_earned column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'total_earned') THEN
        ALTER TABLE trial_invoices ADD COLUMN total_earned DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add days_worked column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'days_worked') THEN
        ALTER TABLE trial_invoices ADD COLUMN days_worked INTEGER DEFAULT 0;
    END IF;
    
END $$;

-- Create daily_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trial_invoice_id UUID NOT NULL REFERENCES trial_invoices(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  worked BOOLEAN NOT NULL,
  day_rate_used DECIMAL(10,2),
  truck_used BOOLEAN DEFAULT false,
  truck_rate_used DECIMAL(10,2),
  travel_kms_actual INTEGER,
  subsistence_actual DECIMAL(10,2),
  notes TEXT,
  daily_total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trial_invoice_id, entry_date)
);

-- Create invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  submission_deadline DATE NOT NULL,
  ticket_number TEXT NOT NULL,
  location TEXT NOT NULL,
  company TEXT NOT NULL,
  day_rate DECIMAL(10,2) NOT NULL,
  truck_rate DECIMAL(10,2) NOT NULL,
  travel_rate_per_km DECIMAL(10,2) NOT NULL DEFAULT 0.68,
  subsistence_rate DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_days table if it doesn't exist
CREATE TABLE IF NOT EXISTS work_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  day_rate_used DECIMAL(10,2) NOT NULL,
  truck_used BOOLEAN DEFAULT false,
  truck_rate_used DECIMAL(10,2) DEFAULT 0,
  travel_kms INTEGER DEFAULT 0,
  subsistence_used DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(invoice_id, work_date)
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_trial_invoices_email ON trial_invoices(contractor_email);
CREATE INDEX IF NOT EXISTS idx_daily_entries_trial_id ON daily_entries(trial_invoice_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_work_days_invoice_id ON work_days(invoice_id);
CREATE INDEX IF NOT EXISTS idx_work_days_work_date ON work_days(work_date);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers (drop and recreate to be safe)
DROP TRIGGER IF EXISTS update_trial_invoices_updated_at ON trial_invoices;
CREATE TRIGGER update_trial_invoices_updated_at
  BEFORE UPDATE ON trial_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_entries_updated_at ON daily_entries;
CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_days_updated_at ON work_days;
CREATE TRIGGER update_work_days_updated_at
  BEFORE UPDATE ON work_days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (only if it doesn't exist)
INSERT INTO trial_invoices (
  contractor_name,
  contractor_email,
  contractor_phone,
  sequence_number,
  start_date,
  end_date,
  day_rate,
  truck_rate,
  travel_kms,
  rate_per_km,
  subsistence,
  location,
  company
) 
SELECT 
  'Test Contractor',
  'test@contractor.com',
  '555-1234',
  'INV-TRIAL-001',
  CURRENT_DATE - INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '3 days',
  450.00,
  150.00,
  45,
  0.68,
  75.00,
  'Calgary, AB',
  'ABC Construction'
WHERE NOT EXISTS (SELECT 1 FROM trial_invoices WHERE contractor_email = 'test@contractor.com');

-- Show current table structure
SELECT 'Schema fix completed successfully!' as status;

-- Show table counts
SELECT 'Table counts after migration:' as info
UNION ALL
SELECT 'Trial Invoices: ' || count(*)::text FROM trial_invoices
UNION ALL
SELECT 'Daily Entries: ' || count(*)::text FROM daily_entries
UNION ALL
SELECT 'Invoices: ' || count(*)::text FROM invoices
UNION ALL
SELECT 'Work Days: ' || count(*)::text FROM work_days; 