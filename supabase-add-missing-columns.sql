-- Add missing columns for 15-day trial and custom start date functionality
-- InvoicePatch Schema Update

-- Add missing columns to trial_invoices table
DO $$ 
BEGIN
    -- Add custom_start_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'custom_start_date') THEN
        ALTER TABLE trial_invoices ADD COLUMN custom_start_date BOOLEAN DEFAULT false;
    END IF;
    
    -- Add pay_periods column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'pay_periods') THEN
        ALTER TABLE trial_invoices ADD COLUMN pay_periods JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add total_trial_days column for dynamic trial calculation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'trial_invoices' AND column_name = 'total_trial_days') THEN
        ALTER TABLE trial_invoices ADD COLUMN total_trial_days INTEGER DEFAULT 15;
    END IF;
    
    -- Update existing records to have 15-day trial period
    UPDATE trial_invoices 
    SET total_trial_days = 15 
    WHERE total_trial_days IS NULL OR total_trial_days = 5;
    
END $$;

-- Create an index on the new columns for better performance
CREATE INDEX IF NOT EXISTS idx_trial_invoices_custom_start ON trial_invoices(custom_start_date);
CREATE INDEX IF NOT EXISTS idx_trial_invoices_pay_periods ON trial_invoices USING GIN(pay_periods);

-- Add a comment to document the new columns
COMMENT ON COLUMN trial_invoices.custom_start_date IS 'Whether the trial uses a custom start date instead of today';
COMMENT ON COLUMN trial_invoices.pay_periods IS 'JSON array of pay periods with cutoff and submission dates';
COMMENT ON COLUMN trial_invoices.total_trial_days IS 'Total number of days in the trial period (default 15)';

-- Add missing columns that might be referenced in the codebase
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS rate_type TEXT DEFAULT 'daily';
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);

-- Add manual schedule columns for custom cutoff and submission dates
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS manual_schedule BOOLEAN DEFAULT FALSE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS schedule_type TEXT DEFAULT 'biweekly';
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS cutoff_day TEXT DEFAULT 'friday';
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS submission_day TEXT DEFAULT 'monday';
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS custom_cutoff_date DATE;
ALTER TABLE trial_invoices ADD COLUMN IF NOT EXISTS custom_submission_date DATE;

-- Update existing records to have default values
UPDATE trial_invoices 
SET custom_start_date = FALSE 
WHERE custom_start_date IS NULL;

UPDATE trial_invoices 
SET rate_type = 'daily' 
WHERE rate_type IS NULL;

UPDATE trial_invoices 
SET manual_schedule = FALSE 
WHERE manual_schedule IS NULL;

UPDATE trial_invoices 
SET schedule_type = 'biweekly' 
WHERE schedule_type IS NULL;

UPDATE trial_invoices 
SET cutoff_day = 'friday' 
WHERE cutoff_day IS NULL;

UPDATE trial_invoices 
SET submission_day = 'monday' 
WHERE submission_day IS NULL;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_trial_invoices_rate_type ON trial_invoices(rate_type);
CREATE INDEX IF NOT EXISTS idx_trial_invoices_custom_start ON trial_invoices(custom_start_date);
CREATE INDEX IF NOT EXISTS idx_trial_invoices_manual_schedule ON trial_invoices(manual_schedule);
CREATE INDEX IF NOT EXISTS idx_trial_invoices_schedule_type ON trial_invoices(schedule_type);

-- Add comments for the new schedule columns
COMMENT ON COLUMN trial_invoices.manual_schedule IS 'Whether the trial uses manual cutoff/submission scheduling';
COMMENT ON COLUMN trial_invoices.schedule_type IS 'Type of schedule: weekly, biweekly, or custom';
COMMENT ON COLUMN trial_invoices.cutoff_day IS 'Day of week for cutoff (for weekly/biweekly schedules)';
COMMENT ON COLUMN trial_invoices.submission_day IS 'Day of week for submission (for weekly/biweekly schedules)';
COMMENT ON COLUMN trial_invoices.custom_cutoff_date IS 'Specific cutoff date (for custom schedules)';
COMMENT ON COLUMN trial_invoices.custom_submission_date IS 'Specific submission date (for custom schedules)'; 