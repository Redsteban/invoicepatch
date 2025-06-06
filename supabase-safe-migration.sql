-- InvoicePatch Safe Database Migration for Supabase
-- Safe version without DROP TABLE statements - for first-time setup

-- Create trial_invoices table for contractor trial system
CREATE TABLE IF NOT EXISTS trial_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_name TEXT NOT NULL,
  contractor_email TEXT NOT NULL,
  contractor_phone TEXT,
  sequence_number TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  trial_day INTEGER DEFAULT 1,
  
  -- Invoice details from contractor input
  day_rate DECIMAL(10,2) NOT NULL,
  truck_rate DECIMAL(10,2) NOT NULL,
  travel_kms INTEGER NOT NULL,
  rate_per_km DECIMAL(10,2) NOT NULL,
  subsistence DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  company TEXT NOT NULL,
  
  -- Calculated totals
  total_earned DECIMAL(10,2) DEFAULT 0,
  days_worked INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_entries table for contractor trial check-ins
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

-- Create invoices table for full invoice management system
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

-- Create work_days table for detailed invoice work day tracking
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

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_trial_invoices_email ON trial_invoices(contractor_email);
CREATE INDEX IF NOT EXISTS idx_daily_entries_trial_id ON daily_entries(trial_invoice_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_work_days_invoice_id ON work_days(invoice_id);
CREATE INDEX IF NOT EXISTS idx_work_days_work_date ON work_days(work_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables (safe to re-run)
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

-- Insert sample data for testing (only if no data exists)
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
WHERE NOT EXISTS (SELECT 1 FROM trial_invoices WHERE sequence_number = 'INV-TRIAL-001');

-- Insert sample daily entries (only if trial invoice exists and no entries exist)
INSERT INTO daily_entries (
  trial_invoice_id,
  entry_date,
  worked,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms_actual,
  subsistence_actual
) 
SELECT 
  ti.id,
  CURRENT_DATE - INTERVAL '2 days',
  true,
  450.00,
  true,
  150.00,
  45,
  75.00
FROM trial_invoices ti 
WHERE ti.sequence_number = 'INV-TRIAL-001'
  AND NOT EXISTS (
    SELECT 1 FROM daily_entries de 
    WHERE de.trial_invoice_id = ti.id 
    AND de.entry_date = CURRENT_DATE - INTERVAL '2 days'
  );

INSERT INTO daily_entries (
  trial_invoice_id,
  entry_date,
  worked,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms_actual,
  subsistence_actual
) 
SELECT 
  ti.id,
  CURRENT_DATE - INTERVAL '1 day',
  true,
  450.00,
  true,
  150.00,
  45,
  75.00
FROM trial_invoices ti 
WHERE ti.sequence_number = 'INV-TRIAL-001'
  AND NOT EXISTS (
    SELECT 1 FROM daily_entries de 
    WHERE de.trial_invoice_id = ti.id 
    AND de.entry_date = CURRENT_DATE - INTERVAL '1 day'
  );

-- Insert sample invoice for testing full system (only if it doesn't exist)
INSERT INTO invoices (
  user_id,
  invoice_number,
  period_start,
  period_end,
  submission_deadline,
  ticket_number,
  location,
  company,
  day_rate,
  truck_rate,
  travel_rate_per_km,
  subsistence_rate
) 
SELECT 
  'temp-user',
  'INV-2024-001',
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE - INTERVAL '1 day',
  CURRENT_DATE + INTERVAL '7 days',
  'TKT-12345',
  'Edmonton, AB',
  'XYZ Construction',
  450.00,
  150.00,
  0.68,
  75.00
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-001');

-- Add sample work days (only if invoice exists and no work days exist)
INSERT INTO work_days (
  invoice_id,
  work_date,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms,
  subsistence_used,
  notes
) 
SELECT 
  inv.id,
  CURRENT_DATE - INTERVAL '14 days',
  450.00,
  true,
  150.00,
  45,
  75.00,
  'Regular work day'
FROM invoices inv 
WHERE inv.invoice_number = 'INV-2024-001'
  AND NOT EXISTS (
    SELECT 1 FROM work_days wd 
    WHERE wd.invoice_id = inv.id 
    AND wd.work_date = CURRENT_DATE - INTERVAL '14 days'
  );

INSERT INTO work_days (
  invoice_id,
  work_date,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms,
  subsistence_used,
  notes
) 
SELECT 
  inv.id,
  CURRENT_DATE - INTERVAL '13 days',
  450.00,
  true,
  150.00,
  50,
  75.00,
  'Extra travel required'
FROM invoices inv 
WHERE inv.invoice_number = 'INV-2024-001'
  AND NOT EXISTS (
    SELECT 1 FROM work_days wd 
    WHERE wd.invoice_id = inv.id 
    AND wd.work_date = CURRENT_DATE - INTERVAL '13 days'
  );

INSERT INTO work_days (
  invoice_id,
  work_date,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms,
  subsistence_used,
  notes
) 
SELECT 
  inv.id,
  CURRENT_DATE - INTERVAL '12 days',
  450.00,
  false,
  0.00,
  30,
  75.00,
  'No truck needed'
FROM invoices inv 
WHERE inv.invoice_number = 'INV-2024-001'
  AND NOT EXISTS (
    SELECT 1 FROM work_days wd 
    WHERE wd.invoice_id = inv.id 
    AND wd.work_date = CURRENT_DATE - INTERVAL '12 days'
  );

-- Verify the setup
SELECT 'Setup Complete! Table counts:' as message
UNION ALL
SELECT 'Trial Invoices: ' || count(*)::text FROM trial_invoices
UNION ALL
SELECT 'Daily Entries: ' || count(*)::text FROM daily_entries
UNION ALL
SELECT 'Invoices: ' || count(*)::text FROM invoices
UNION ALL
SELECT 'Work Days: ' || count(*)::text FROM work_days; 