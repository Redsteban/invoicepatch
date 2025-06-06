-- InvoicePatch Database Migration for Supabase
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS daily_entries CASCADE;
DROP TABLE IF EXISTS work_days CASCADE;
DROP TABLE IF EXISTS trial_invoices CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;

-- Create trial_invoices table for contractor trial system
CREATE TABLE trial_invoices (
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
CREATE TABLE daily_entries (
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
CREATE TABLE invoices (
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
CREATE TABLE work_days (
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

-- Create indexes for better performance
CREATE INDEX idx_trial_invoices_email ON trial_invoices(contractor_email);
CREATE INDEX idx_daily_entries_trial_id ON daily_entries(trial_invoice_id);
CREATE INDEX idx_daily_entries_date ON daily_entries(entry_date);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_work_days_invoice_id ON work_days(invoice_id);
CREATE INDEX idx_work_days_work_date ON work_days(work_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_trial_invoices_updated_at
  BEFORE UPDATE ON trial_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_days_updated_at
  BEFORE UPDATE ON work_days
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
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
) VALUES (
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
);

-- Get the trial invoice ID for sample daily entries
INSERT INTO daily_entries (
  trial_invoice_id,
  entry_date,
  worked,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms_actual,
  subsistence_actual
) VALUES 
(
  (SELECT id FROM trial_invoices WHERE sequence_number = 'INV-TRIAL-001'),
  CURRENT_DATE - INTERVAL '2 days',
  true,
  450.00,
  true,
  150.00,
  45,
  75.00
),
(
  (SELECT id FROM trial_invoices WHERE sequence_number = 'INV-TRIAL-001'),
  CURRENT_DATE - INTERVAL '1 day',
  true,
  450.00,
  true,
  150.00,
  45,
  75.00
);

-- Insert sample invoice for testing full system
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
) VALUES (
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
);

-- Add sample work days
INSERT INTO work_days (
  invoice_id,
  work_date,
  day_rate_used,
  truck_used,
  truck_rate_used,
  travel_kms,
  subsistence_used,
  notes
) VALUES 
(
  (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'),
  CURRENT_DATE - INTERVAL '14 days',
  450.00,
  true,
  150.00,
  45,
  75.00,
  'Regular work day'
),
(
  (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'),
  CURRENT_DATE - INTERVAL '13 days',
  450.00,
  true,
  150.00,
  50,
  75.00,
  'Extra travel required'
),
(
  (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'),
  CURRENT_DATE - INTERVAL '12 days',
  450.00,
  false,
  0.00,
  30,
  75.00,
  'No truck needed'
);

-- Verify the setup
SELECT 'Trial Invoices' as table_name, count(*) as record_count FROM trial_invoices
UNION ALL
SELECT 'Daily Entries' as table_name, count(*) as record_count FROM daily_entries
UNION ALL
SELECT 'Invoices' as table_name, count(*) as record_count FROM invoices
UNION ALL
SELECT 'Work Days' as table_name, count(*) as record_count FROM work_days; 