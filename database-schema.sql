-- Full InvoicePatch Database Schema

-- Invoices table for the main invoice management system
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

-- Work days table for detailed daily entries within invoices
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

-- Trial invoices table for the contractor trial system
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

-- Daily entries table for the contractor trial system
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_work_days_invoice_id ON work_days(invoice_id);
CREATE INDEX IF NOT EXISTS idx_work_days_work_date ON work_days(work_date);
CREATE INDEX IF NOT EXISTS idx_trial_invoices_email ON trial_invoices(contractor_email);
CREATE INDEX IF NOT EXISTS idx_daily_entries_trial_id ON daily_entries(trial_invoice_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(entry_date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_days_updated_at ON work_days;
CREATE TRIGGER update_work_days_updated_at BEFORE UPDATE ON work_days FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trial_invoices_updated_at ON trial_invoices;
CREATE TRIGGER update_trial_invoices_updated_at BEFORE UPDATE ON trial_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_entries_updated_at ON daily_entries;
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON daily_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 