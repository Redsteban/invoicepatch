-- supabase/migrations/YYYYMMDDHHMMSS_create_daily_tickets.sql

-- 1. Create the daily_tickets table
CREATE TABLE public.daily_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
    ticket_date DATE NOT NULL,
    well_site TEXT,
    operator TEXT,
    day_rate DECIMAL(10, 2) DEFAULT 0.00,
    truck_rate DECIMAL(10, 2) DEFAULT 0.00,
    kms_rate DECIMAL(10, 2) DEFAULT 0.00,
    kms_driven INTEGER DEFAULT 0,
    subsistence DECIMAL(10, 2) DEFAULT 0.00,
    other_expenses JSONB, -- To store array of {description, amount}
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    CONSTRAINT daily_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- 2. Add comments to the table and columns for clarity
COMMENT ON TABLE public.daily_tickets IS 'Stores daily financial ticket information for oil and gas contractors.';
COMMENT ON COLUMN public.daily_tickets.other_expenses IS 'JSONB array of other expenses, e.g., [{"description": "Safety gear", "amount": 75.50}]';
COMMENT ON COLUMN public.daily_tickets.total_amount IS 'Calculated total of all rates and expenses for the day.';

-- 3. Create indexes for performance
CREATE INDEX idx_daily_tickets_user_id ON public.daily_tickets(user_id);
CREATE INDEX idx_daily_tickets_ticket_date ON public.daily_tickets(ticket_date);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.daily_tickets ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Contractors can create their own tickets"
ON public.daily_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Contractors can view their own tickets"
ON public.daily_tickets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Contractors can update their own draft tickets"
ON public.daily_tickets FOR UPDATE
USING (auth.uid() = user_id AND status = 'draft')
WITH CHECK (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Contractors can delete their own draft tickets"
ON public.daily_tickets FOR DELETE
USING (auth.uid() = user_id AND status = 'draft');

-- 6. Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_daily_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create a trigger to use the function
CREATE TRIGGER on_daily_tickets_update
BEFORE UPDATE ON public.daily_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_daily_tickets_updated_at(); 