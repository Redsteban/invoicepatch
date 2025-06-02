-- InvoicePatch Integration Platform Database Schema
-- PostgreSQL 14+ optimized schema with indexes and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geolocation features

-- Core user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('contractor', 'client_admin', 'client_manager', 'super_admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client companies
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    business_number VARCHAR(20), -- Canadian BN
    industry VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(2), -- Canadian provinces/territories
    postal_code VARCHAR(7),
    country VARCHAR(2) DEFAULT 'CA',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    subscription_tier VARCHAR(20) DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'suspended', 'cancelled')),
    billing_contact_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client-User relationships
CREATE TABLE client_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'viewer')),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, user_id)
);

-- Contractor profiles
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    trade VARCHAR(100), -- electrical, plumbing, construction, etc.
    license_number VARCHAR(50),
    insurance_policy VARCHAR(100),
    insurance_expiry DATE,
    hourly_rate DECIMAL(8,2),
    overtime_rate DECIMAL(8,2),
    travel_rate DECIMAL(8,2),
    skills JSONB DEFAULT '[]', -- Array of skill tags
    certifications JSONB DEFAULT '[]', -- Array of certifications
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(2),
    postal_code VARCHAR(7),
    country VARCHAR(2) DEFAULT 'CA',
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    tax_id VARCHAR(20), -- SIN or business tax ID
    payment_method VARCHAR(20) DEFAULT 'direct_deposit',
    banking_info JSONB, -- Encrypted banking details
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    background_check_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client-Contractor relationships
CREATE TABLE client_contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    contract_start_date DATE,
    contract_end_date DATE,
    base_hourly_rate DECIMAL(8,2),
    overtime_multiplier DECIMAL(3,2) DEFAULT 1.5,
    travel_reimbursement BOOLEAN DEFAULT TRUE,
    equipment_provided BOOLEAN DEFAULT FALSE,
    payment_terms INTEGER DEFAULT 30, -- Net payment days
    contract_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, contractor_id)
);

-- Project/Job categories
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_code VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
    start_date DATE,
    estimated_end_date DATE,
    actual_end_date DATE,
    budget DECIMAL(12,2),
    location_address VARCHAR(500),
    location_coordinates POINT, -- PostGIS point for GPS coordinates
    project_manager_id UUID REFERENCES users(id),
    client_contact_id UUID REFERENCES users(id),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work orders/tickets
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    work_order_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'assigned', 'in_progress', 'completed', 'cancelled')),
    scheduled_date TIMESTAMP,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    location_address VARCHAR(500),
    location_coordinates POINT,
    special_instructions TEXT,
    required_skills JSONB DEFAULT '[]',
    equipment_needed JSONB DEFAULT '[]',
    safety_requirements TEXT,
    created_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES contractors(id),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time tracking entries
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER, -- Calculated field
    description TEXT,
    work_performed TEXT,
    entry_type VARCHAR(20) DEFAULT 'regular' CHECK (entry_type IN ('regular', 'overtime', 'travel', 'break')),
    hourly_rate DECIMAL(8,2) NOT NULL,
    billable BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'submitted', 'approved', 'rejected', 'billed')),
    start_location POINT,
    end_location POINT,
    location_verified BOOLEAN DEFAULT FALSE,
    photos JSONB DEFAULT '[]', -- Array of photo URLs
    break_time_minutes INTEGER DEFAULT 0,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
    external_id VARCHAR(100), -- For integration mapping
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense tracking
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    work_order_id UUID REFERENCES work_orders(id),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('materials', 'travel', 'equipment', 'meals', 'accommodation', 'fuel', 'parking', 'other')),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CAD',
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),
    receipt_processed BOOLEAN DEFAULT FALSE,
    merchant_name VARCHAR(255),
    payment_method VARCHAR(20),
    billable BOOLEAN DEFAULT TRUE,
    reimbursable BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'reimbursed')),
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    reimbursed_at TIMESTAMP,
    sync_status VARCHAR(20) DEFAULT 'pending',
    external_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CAD',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'paid', 'overdue', 'cancelled')),
    payment_terms INTEGER DEFAULT 30,
    notes TEXT,
    terms_conditions TEXT,
    pdf_url VARCHAR(500),
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    paid_at TIMESTAMP,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    sync_status VARCHAR(20) DEFAULT 'pending',
    external_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice line items
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('time', 'expense', 'material', 'service')),
    description TEXT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    time_entry_id UUID REFERENCES time_entries(id),
    expense_id UUID REFERENCES expenses(id),
    external_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax configuration by province
CREATE TABLE tax_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    province VARCHAR(2) NOT NULL,
    tax_type VARCHAR(10) NOT NULL CHECK (tax_type IN ('GST', 'HST', 'PST', 'QST')),
    rate DECIMAL(5,4) NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration configurations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL CHECK (integration_type IN ('quickbooks_online', 'quickbooks_desktop', 'sage50', 'xero', 'dynamics', 'custom_erp', 'excel')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
    configuration JSONB NOT NULL DEFAULT '{}',
    credentials JSONB, -- Encrypted credentials
    company_id VARCHAR(100), -- External company ID
    company_name VARCHAR(255),
    last_sync_at TIMESTAMP,
    sync_frequency VARCHAR(20) DEFAULT 'hourly' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
    error_message TEXT,
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, integration_type)
);

-- Integration sync logs
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'manual'
    entity_type VARCHAR(50) NOT NULL, -- 'customers', 'invoices', 'time_entries', etc.
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'partial')),
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    created_by UUID REFERENCES users(id)
);

-- Field mapping for custom integrations
CREATE TABLE integration_field_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    source_field VARCHAR(100) NOT NULL,
    target_field VARCHAR(100) NOT NULL,
    field_type VARCHAR(20) NOT NULL CHECK (field_type IN ('string', 'number', 'date', 'boolean', 'object')),
    transformation_rule JSONB,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-time location tracking
CREATE TABLE contractor_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID REFERENCES contractors(id) ON DELETE CASCADE,
    location POINT NOT NULL,
    accuracy DECIMAL(10,2), -- GPS accuracy in meters
    speed DECIMAL(5,2), -- Speed in km/h
    heading DECIMAL(5,2), -- Direction in degrees
    work_order_id UUID REFERENCES work_orders(id),
    activity_type VARCHAR(20) DEFAULT 'unknown' CHECK (activity_type IN ('traveling', 'working', 'break', 'unknown')),
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications and alerts
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_contractors_user_id ON contractors(user_id);
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_client_contractors_client_id ON client_contractors(client_id);
CREATE INDEX idx_client_contractors_contractor_id ON client_contractors(contractor_id);
CREATE INDEX idx_work_orders_client_id ON work_orders(client_id);
CREATE INDEX idx_work_orders_assigned_to ON work_orders(assigned_to);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_scheduled_date ON work_orders(scheduled_date);
CREATE INDEX idx_time_entries_contractor_id ON time_entries(contractor_id);
CREATE INDEX idx_time_entries_work_order_id ON time_entries(work_order_id);
CREATE INDEX idx_time_entries_start_time ON time_entries(start_time);
CREATE INDEX idx_time_entries_status ON time_entries(status);
CREATE INDEX idx_expenses_contractor_id ON expenses(contractor_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_invoices_contractor_id ON invoices(contractor_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_integrations_client_id ON integrations(client_id);
CREATE INDEX idx_sync_logs_integration_id ON sync_logs(integration_id);
CREATE INDEX idx_contractor_locations_contractor_id ON contractor_locations(contractor_id);
CREATE INDEX idx_contractor_locations_recorded_at ON contractor_locations(recorded_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Spatial indexes for location data
CREATE INDEX idx_work_orders_location ON work_orders USING GIST(location_coordinates);
CREATE INDEX idx_contractor_locations_location ON contractor_locations USING GIST(location);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_contractors_updated_at BEFORE UPDATE ON client_contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Canadian tax rates
INSERT INTO tax_rates (province, tax_type, rate, effective_date, description) VALUES
('AB', 'GST', 0.05, '2022-01-01', 'Alberta GST'),
('BC', 'GST', 0.05, '2022-01-01', 'British Columbia GST'),
('BC', 'PST', 0.07, '2022-01-01', 'British Columbia PST'),
('MB', 'GST', 0.05, '2022-01-01', 'Manitoba GST'),
('MB', 'PST', 0.07, '2022-01-01', 'Manitoba PST'),
('NB', 'HST', 0.15, '2022-01-01', 'New Brunswick HST'),
('NL', 'HST', 0.15, '2022-01-01', 'Newfoundland and Labrador HST'),
('NS', 'HST', 0.15, '2022-01-01', 'Nova Scotia HST'),
('ON', 'HST', 0.13, '2022-01-01', 'Ontario HST'),
('PE', 'HST', 0.15, '2022-01-01', 'Prince Edward Island HST'),
('QC', 'GST', 0.05, '2022-01-01', 'Quebec GST'),
('QC', 'QST', 0.09975, '2022-01-01', 'Quebec Sales Tax'),
('SK', 'GST', 0.05, '2022-01-01', 'Saskatchewan GST'),
('SK', 'PST', 0.06, '2022-01-01', 'Saskatchewan PST'),
('NT', 'GST', 0.05, '2022-01-01', 'Northwest Territories GST'),
('NU', 'GST', 0.05, '2022-01-01', 'Nunavut GST'),
('YT', 'GST', 0.05, '2022-01-01', 'Yukon GST');

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('invoice_number_format', '"INV-{YYYY}-{MM}-{NNNN}"', 'Format for auto-generated invoice numbers'),
('work_order_number_format', '"WO-{YYYY}-{NNNNNN}"', 'Format for auto-generated work order numbers'),
('default_payment_terms', '30', 'Default payment terms in days'),
('location_tracking_interval', '60', 'GPS location update interval in seconds'),
('auto_sync_enabled', 'true', 'Enable automatic synchronization with integrated systems'),
('notification_retention_days', '90', 'Days to keep notifications before archiving'),
('audit_log_retention_days', '365', 'Days to keep audit logs'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_file_types', '["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"]', 'Allowed file types for uploads'),
('smtp_enabled', 'false', 'Enable SMTP email delivery'),
('sms_enabled', 'false', 'Enable SMS notifications'),
('maintenance_mode', 'false', 'System maintenance mode flag');

-- Create views for common queries
CREATE VIEW contractor_dashboard AS
SELECT 
    c.id,
    u.first_name || ' ' || u.last_name AS name,
    c.business_name,
    c.trade,
    c.status,
    COUNT(DISTINCT wo.id) AS active_work_orders,
    COUNT(DISTINCT te.id) FILTER (WHERE te.status = 'active') AS active_time_entries,
    SUM(te.duration_minutes * te.hourly_rate / 60) FILTER (WHERE te.status = 'approved' AND te.created_at >= CURRENT_DATE - INTERVAL '30 days') AS monthly_earnings,
    MAX(cl.recorded_at) AS last_location_update
FROM contractors c
JOIN users u ON c.user_id = u.id
LEFT JOIN work_orders wo ON c.id = wo.assigned_to AND wo.status IN ('assigned', 'in_progress')
LEFT JOIN time_entries te ON c.id = te.contractor_id
LEFT JOIN contractor_locations cl ON c.id = cl.contractor_id
WHERE c.status = 'active'
GROUP BY c.id, u.first_name, u.last_name, c.business_name, c.trade, c.status;

CREATE VIEW client_dashboard AS
SELECT 
    cl.id,
    cl.company_name,
    cl.subscription_tier,
    COUNT(DISTINCT cc.contractor_id) AS total_contractors,
    COUNT(DISTINCT wo.id) FILTER (WHERE wo.status IN ('assigned', 'in_progress')) AS active_work_orders,
    COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'sent') AS pending_invoices,
    SUM(i.total_amount) FILTER (WHERE i.status = 'sent') AS pending_amount,
    COUNT(DISTINCT te.id) FILTER (WHERE te.status = 'submitted') AS pending_approvals
FROM clients cl
LEFT JOIN client_contractors cc ON cl.id = cc.client_id AND cc.status = 'active'
LEFT JOIN work_orders wo ON cl.id = wo.client_id
LEFT JOIN invoices i ON cl.id = i.client_id
LEFT JOIN time_entries te ON cl.id = te.client_id
GROUP BY cl.id, cl.company_name, cl.subscription_tier;

-- Create function for calculating distances
CREATE OR REPLACE FUNCTION calculate_distance(lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    distance DECIMAL;
BEGIN
    -- Haversine formula for calculating distance between two points
    distance := 6371 * ACOS(
        COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * COS(RADIANS(lon2) - RADIANS(lon1)) +
        SIN(RADIANS(lat1)) * SIN(RADIANS(lat2))
    );
    RETURN distance;
END;
$$ LANGUAGE plpgsql; 