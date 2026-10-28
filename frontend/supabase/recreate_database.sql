-- ==========================================
-- SUPABASE DATABASE RECREATION SCRIPT
-- ==========================================
-- This script recreates all tables, relationships, indexes, 
-- and default permissions for the CRM application from scratch.
-- It also populates the database with realistic dummy data.
-- Run this in the SQL Editor of your new Supabase project.

-- Clean up existing tables if they exist (in dependency-ordered sequence)
DROP TABLE IF EXISTS "admin_notes" CASCADE;
DROP TABLE IF EXISTS "ticket_history" CASCADE;
DROP TABLE IF EXISTS "ticket_chat" CASCADE;
DROP TABLE IF EXISTS "ticket_assignments" CASCADE;
DROP TABLE IF EXISTS "tickets" CASCADE;
DROP TABLE IF EXISTS "credentials" CASCADE;
DROP TABLE IF EXISTS "subscription_users" CASCADE;
DROP TABLE IF EXISTS "subscriptions" CASCADE;
DROP TABLE IF EXISTS "document_assignments" CASCADE;
DROP TABLE IF EXISTS "documents" CASCADE;
DROP TABLE IF EXISTS "tasks" CASCADE;
DROP TABLE IF EXISTS "Employee Documents" CASCADE;
DROP TABLE IF EXISTS "Attendance" CASCADE;
DROP TABLE IF EXISTS "Calls" CASCADE;
DROP TABLE IF EXISTS "Leads" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
DROP TABLE IF EXISTS "Employee Directory" CASCADE;
DROP TABLE IF EXISTS "Teams" CASCADE;
DROP TABLE IF EXISTS "Departments" CASCADE;

-- 1. Departments Table
CREATE TABLE "Departments" (
    whalesync_postgres_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_name TEXT NOT NULL UNIQUE
);

-- 2. Teams Table
CREATE TABLE "Teams" (
    id SERIAL PRIMARY KEY,
    whalesync_postgres_id UUID UNIQUE DEFAULT gen_random_uuid(),
    team_name TEXT NOT NULL UNIQUE
);

-- 3. Employee Directory Table
CREATE TABLE "Employee Directory" (
    whalesync_postgres_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT,
    full_name TEXT NOT NULL,
    official_email TEXT NOT NULL UNIQUE,
    official_contact_number TEXT,
    personal_email TEXT,
    dob DATE,
    linkedin_profile TEXT,
    date_of_joining DATE,
    job_title TEXT,
    employment_type TEXT,
    work_mode TEXT,
    status TEXT DEFAULT 'Active',
    profile_photo TEXT,
    monthly_payroll NUMERIC,
    "Notes" TEXT,
    "Announcement" TEXT,
    department UUID REFERENCES "Departments"(whalesync_postgres_id) ON DELETE SET NULL,
    reporting_manager UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE SET NULL,
    teams INTEGER REFERENCES "Teams"(id) ON DELETE SET NULL
);

-- 4. Users Table (Maps auth emails to employee profiles)
CREATE TABLE "Users" (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    employee UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE
);

-- 5. Leads Table
CREATE TABLE "Leads" (
    whalesync_postgres_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    stage TEXT DEFAULT 'New',
    deal_amount NUMERIC DEFAULT 0,
    date_and_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_to UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE SET NULL,
    email TEXT,
    mobile TEXT,
    city TEXT,
    source TEXT,
    client_budget NUMERIC DEFAULT 0,
    current_business_turnover TEXT,
    services TEXT,
    interested_in_products TEXT[],
    follow_up_date DATE,
    call_remark TEXT,
    call_notes TEXT,
    employee_name TEXT,
    lead_tag TEXT,
    assignment_status TEXT,
    today_s_lead TEXT,
    whatsapp_link TEXT,
    profile_photo TEXT,
    age INTEGER,
    any_other_interests TEXT,
    expected_closing DATE,
    follow_up_day TEXT,
    last_callback_date DATE,
    official_email TEXT,
    official_number TEXT,
    stage1 TEXT,
    email_button TEXT,
    calls TEXT
);

-- 6. Calls Table
CREATE TABLE "Calls" (
    whalesync_postgres_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE,
    leads UUID REFERENCES "Leads"(whalesync_postgres_id) ON DELETE SET NULL,
    client_name TEXT,
    client_number TEXT,
    duration INTEGER,
    call_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sentiment TEXT,
    call_type TEXT,
    service TEXT,
    ai_call_summary TEXT
);

-- 7. Attendance Table
CREATE TABLE "Attendance" (
    whalesync_postgres_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT,
    time_in NUMERIC,
    time_out NUMERIC,
    working_hours NUMERIC DEFAULT 0,
    notes TEXT,
    punctuality_status TEXT,
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    employee_id TEXT,
    employee_name TEXT,
    department TEXT,
    employee_id_from_employee TEXT,
    full_name_from_employee TEXT,
    department_name_from_employee TEXT,
    date_status TEXT,
    day_name_of_date TEXT,
    UNIQUE (employee, date)
);

-- 8. Employee Documents Table (Documents assigned to employees)
CREATE TABLE "Employee Documents" (
    id SERIAL PRIMARY KEY,
    whalesync_postgres_id UUID DEFAULT gen_random_uuid(),
    employee UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_type TEXT,
    collection_status TEXT,
    issued_date DATE,
    attachment TEXT
);

-- 9. Tasks Table
CREATE TABLE "tasks" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    assignee UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_on TIMESTAMP WITH TIME ZONE,
    is_overdue BOOLEAN DEFAULT false,
    days_overdue INTEGER DEFAULT 0,
    update_count INTEGER DEFAULT 0
);

-- 10. Documents Table (Shared Document Store)
CREATE TABLE "documents" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    file_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE SET NULL
);

-- 11. Document Assignments Table
CREATE TABLE "document_assignments" (
    id SERIAL PRIMARY KEY,
    document_id UUID REFERENCES "documents"(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE,
    can_view BOOLEAN DEFAULT TRUE,
    can_download BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Subscriptions Table (Software tracking)
CREATE TABLE "subscriptions" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_name TEXT NOT NULL,
    vendor_id UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE SET NULL,
    plan_tier TEXT,
    cost_per_period NUMERIC,
    cost_per_user NUMERIC,
    billing_cycle TEXT,
    auto_renewal_status TEXT,
    owner_id UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE SET NULL,
    start_date DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'Active',
    notes TEXT,
    portal_url TEXT,
    category TEXT,
    number_of_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Subscription Users Table
CREATE TABLE "subscription_users" (
    id SERIAL PRIMARY KEY,
    subscription_id UUID REFERENCES "subscriptions"(id) ON DELETE CASCADE,
    user_id UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Credentials Table
CREATE TABLE "credentials" (
    id SERIAL PRIMARY KEY,
    subscription_id UUID REFERENCES "subscriptions"(id) ON DELETE CASCADE,
    email TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Tickets Table
CREATE TABLE "tickets" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number SERIAL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    company TEXT,
    issue TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    priority TEXT DEFAULT 'Medium',
    assigned_to TEXT, -- legacy employee name text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Ticket Assignments Table
CREATE TABLE "ticket_assignments" (
    id SERIAL PRIMARY KEY,
    ticket_id UUID REFERENCES "tickets"(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES "Employee Directory"(whalesync_postgres_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Ticket Chat Table
CREATE TABLE "ticket_chat" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES "tickets"(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    message TEXT NOT NULL,
    sender_type TEXT NOT NULL, -- 'sent' or 'received'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Ticket History Table
CREATE TABLE "ticket_history" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES "tickets"(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Admin Notes Table
CREATE TABLE "admin_notes" (
    id SERIAL PRIMARY KEY,
    page_key TEXT UNIQUE NOT NULL,
    title TEXT,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Supabase enforces RLS policies. The following statements enable RLS
-- and set up open access policies for authenticated users to ensure 
-- smooth operation in development/demo environments.

ALTER TABLE "Departments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Employee Directory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Calls" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Attendance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Employee Documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "document_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscription_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credentials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_chat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_notes" ENABLE ROW LEVEL SECURITY;

-- Creating permissive policies for authenticated and anon users
-- Use double quotes for tables with spaces.
CREATE POLICY "Permissive Policy" ON "Departments" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Teams" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Employee Directory" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Users" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Leads" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Calls" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Attendance" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "Employee Documents" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "tasks" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "documents" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "document_assignments" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "subscriptions" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "subscription_users" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "credentials" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "tickets" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "ticket_assignments" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "ticket_chat" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "ticket_history" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permissive Policy" ON "admin_notes" FOR ALL TO public USING (true) WITH CHECK (true);


-- ==========================================
-- DUMMY DATA SEEDING
-- ==========================================

-- Seed Departments
INSERT INTO "Departments" (whalesync_postgres_id, department_name) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Executive/Admin'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Tech/Development'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Human Resources'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Sales & Marketing'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Customer Support');

-- Seed Teams
INSERT INTO "Teams" (id, whalesync_postgres_id, team_name) VALUES
(1, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Executive Leadership'),
(2, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Dev & Tech Squad'),
(3, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'HR & People Operations'),
(4, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Growth & Marketing Team');

-- Seed Employee Directory
-- Includes reporting relationships and links to departments/teams
INSERT INTO "Employee Directory" (
    whalesync_postgres_id, employee_id, full_name, official_email, official_contact_number, 
    personal_email, dob, date_of_joining, job_title, employment_type, 
    work_mode, status, profile_photo, monthly_payroll, "Notes", "Announcement",
    department, reporting_manager, teams
) VALUES
-- CEO/Admin
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'EMP001', 'Lakshay Takkar', 'asus26120405@gmail.com', '+91 99999 88888', 'lakshay.personal@gmail.com', '1992-04-15', '2023-01-10', 'CEO & Founder', 'Full-time', 'Office', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshay', 150000, 'Company Founder', 'Welcome back, team! Let''s achieve our Q3 goals.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 1),
-- Admin
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'EMP002', 'Sanjay Kumar Sharma', 'sanjay@startupsquad.in', '+91 98888 77777', 'sanjay.personal@gmail.com', '1990-08-22', '2023-02-15', 'Operations Administrator', 'Full-time', 'Office', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay', 120000, 'Manages operations', 'System maintenance scheduled this Sunday.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1),
-- HR Manager
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'EMP003', 'HR Head', 'hr@startupsquad.in', '+91 97777 66666', 'hr.peopleops@gmail.com', '1993-11-05', '2023-05-01', 'HR Lead', 'Full-time', 'Hybrid', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=HRHead', 95000, 'HR Operations Head', 'New policies are updated in the Document section.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3),
-- Lead Developer / Sales Hybrid
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'EMP004', 'Love Kumar', 'lovekumar@startupsquad.in', '+91 96666 55555', 'love.kumar@gmail.com', '1995-12-10', '2023-07-20', 'Lead Technical Consultant', 'Full-time', 'Remote', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Love', 110000, 'Technical Sales Head', 'Tech reviews due tomorrow.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2),
-- Sales Manager / Lead
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'EMP005', 'Sahil', 'sahilsgt010@gmail.com', '+91 95555 44444', 'sahil.sales@gmail.com', '1994-06-18', '2023-09-01', 'Sales Manager', 'Full-time', 'Office', 'Active', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sahil', 80000, 'Senior Sales Executive', 'Highest target closer of last month!', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 4);

-- Seed Users table mapping
INSERT INTO "Users" (email, employee) VALUES
('asus26120405@gmail.com', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('sanjay@startupsquad.in', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
('hr@startupsquad.in', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('lovekumar@startupsquad.in', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
('sahilsgt010@gmail.com', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55');

-- Seed Leads
INSERT INTO "Leads" (
    whalesync_postgres_id, name, stage, deal_amount, date_and_time, 
    assigned_to, email, mobile, city, source, client_budget, 
    current_business_turnover, services, interested_in_products, 
    follow_up_date, call_remark, call_notes, employee_name, lead_tag, 
    assignment_status, today_s_lead, whatsapp_link
) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rahul Sharma', 'New', 15000, NOW() - INTERVAL '2 days', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'rahul@gmail.com', '+91 91234 56789', 'New Delhi', 'Google Ads', 20000, 'Under 10 Lakhs', 'Web Development', ARRAY['Custom Website', 'SEO'], NULL, 'Interested, asked to call back', 'Client is starting a new e-commerce business', 'Sahil', 'High Potential', 'Assigned', 'Yes', 'https://wa.me/919123456789'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Aarav Mehta', 'FollowUpRequired', 35000, NOW() - INTERVAL '4 days', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'aarav@outlook.com', '+91 92345 67890', 'Mumbai', 'LinkedIn', 40000, '50 Lakhs - 1 Crore', 'Mobile App Development', ARRAY['React Native App'], NOW() + INTERVAL '1 day', 'Follow up call scheduled for tomorrow morning', 'Aarav wants a mobile application for food delivery business.', 'Sahil', 'Enterprise', 'Assigned', 'No', 'https://wa.me/919234567890'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Neha Gupta', 'Converted', 75000, NOW() - INTERVAL '10 days', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'neha@startup.co', '+91 93456 78901', 'Bangalore', 'Referral', 80000, '1 - 5 Crore', 'CRM Customization', ARRAY['Salesforce Integration', 'NextJS App'], NULL, 'Deal closed, contract signed', 'Closed successfully. Onboarding scheduled next Monday.', 'Love Kumar', 'Closed Won', 'Assigned', 'No', 'https://wa.me/919345678901'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'John Doe', 'NotConnected', 0, NOW() - INTERVAL '1 day', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'john.doe@gmail.com', '+1 555 123 4567', 'New York', 'Organic Search', 5000, 'Under 10 Lakhs', 'Consultation', ARRAY['Cloud Consulting'], NOW() + INTERVAL '3 days', 'Number busy, left email', 'Tried calling 3 times, no connection.', 'Love Kumar', 'Cold Lead', 'Assigned', 'Yes', 'https://wa.me/15551234567');

-- Seed Calls
INSERT INTO "Calls" (
    whalesync_postgres_id, employee, leads, client_name, client_number, 
    duration, call_date, sentiment, call_type, service, ai_call_summary
) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rahul Sharma', '+91 91234 56789', 185, NOW() - INTERVAL '2 hours', 'Positive', 'Outgoing', 'Web Development', 'Client was highly positive about building a custom WooCommerce site. Budget matches target. Will confirm design templates over email.'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Aarav Mehta', '+91 92345 67890', 320, NOW() - INTERVAL '1 day', 'Neutral', 'Incoming', 'Mobile App Development', 'Aarav asked complex technical questions about offline-first capabilities. Love Kumar might need to be loop in for next technical assessment call.'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Neha Gupta', '+91 93456 78901', 450, NOW() - INTERVAL '3 days', 'Very Positive', 'Outgoing', 'CRM Customization', 'Closing call. Agreed on billing milestone releases. Contract link shared.');

-- Seed Attendance
INSERT INTO "Attendance" (
    whalesync_postgres_id, employee, date, status, time_in, time_out, 
    working_hours, notes, punctuality_status, employee_id, employee_name, 
    department, employee_id_from_employee, full_name_from_employee, 
    department_name_from_employee, date_status, day_name_of_date
) VALUES
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', CURRENT_DATE, 'present', 9.30, 18.00, 8.5, 'Marked check-in via browser.', 'on time', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Sahil', 'Sales & Marketing', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Sahil', 'Sales & Marketing', 'Regular', 'Today'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', CURRENT_DATE, 'present', 10.15, 19.00, 8.75, 'Late due to traffic.', 'late', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Love Kumar', 'Tech/Development', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Love Kumar', 'Tech/Development', 'Late', 'Today'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', CURRENT_DATE - 1, 'present', 9.15, 18.15, 9.0, 'Regular operations.', 'on time', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'HR Head', 'Human Resources', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'HR Head', 'Human Resources', 'Regular', 'Yesterday');

-- Seed Employee Documents
INSERT INTO "Employee Documents" (employee, document_name, document_type, collection_status, issued_date, attachment) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Pan Card.pdf', 'Identity & KYC Proof', 'Submitted', '2023-09-02', 'https://supabase.co/storage/v1/object/public/documents/pan_sahil.pdf'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Aadhar Card.pdf', 'Identity & KYC Proof', 'Submitted', '2023-09-02', 'https://supabase.co/storage/v1/object/public/documents/aadhar_sahil.pdf'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'NDA Agreement.pdf', 'Employment & Company Records', 'Submitted', '2023-07-21', 'https://supabase.co/storage/v1/object/public/documents/nda_love.pdf');

-- Seed tasks
INSERT INTO "tasks" (
    id, title, description, status, priority, due_date, assignee
) VALUES
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Setup Client Sandbox Environment', 'Create a sandbox for Neha Gupta Custom CRM integration testing.', 'pending', 'high', NOW() + INTERVAL '2 days', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Review Lead Assignment Rules', 'Check auto assignment script rules for Tech Team leads', 'completed', 'medium', NOW() - INTERVAL '1 day', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Follow up with Rahul Sharma', 'Call client back to finalize proposal details.', 'pending', 'high', NOW() + INTERVAL '4 hours', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55');

-- Seed documents (Shared library)
INSERT INTO "documents" (id, title, description, file_name, file_type, file_size, file_url, category, status, created_by) VALUES
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Company Profile 2026', 'Startup Squad Pitch Deck and Services Document', 'Company_Profile_2026.pdf', 'pdf', 4500000, 'https://supabase.co/storage/v1/object/public/shared-docs/profile.pdf', 'Marketing', 'Active', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Employee Policy Handbook', 'Company holiday list, leave policies, and rules', 'Employee_Handbook.pdf', 'pdf', 2100000, 'https://supabase.co/storage/v1/object/public/shared-docs/handbook.pdf', 'HR', 'Active', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33');

-- Seed document_assignments
INSERT INTO "document_assignments" (document_id, employee_id, can_view, can_download) VALUES
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', TRUE, TRUE),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', TRUE, TRUE),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', TRUE, FALSE),
('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', TRUE, TRUE);

-- Seed subscriptions
INSERT INTO "subscriptions" (
    id, subscription_name, vendor_id, plan_tier, cost_per_period, 
    cost_per_user, billing_cycle, auto_renewal_status, owner_id, 
    start_date, expiry_date, status, category, number_of_users
) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Slack Enterprise Suite', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Standard Plan', 450, 5, 'Monthly', 'Enabled', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-01-01', '2026-01-01', 'Active', 'Communication', 5),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'GitHub Enterprise', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Developer Pro', 300, 20, 'Annual', 'Enabled', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2025-03-01', '2026-03-01', 'Active', 'Developer Tools', 3);

-- Seed subscription_users
INSERT INTO "subscription_users" (subscription_id, user_id) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44');

-- Seed credentials
INSERT INTO "credentials" (subscription_id, email, password) VALUES
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'asus26120405@gmail.com', 'SlackPass@2026'),
('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'lovekumar@startupsquad.in', 'GitHubSecure2026!');

-- Seed tickets
INSERT INTO "tickets" (
    id, client_name, client_email, company, issue, status, priority, assigned_to
) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rahul Sharma', 'rahul@gmail.com', 'Rahul E-Commerce', 'Unable to upload products to test catalog.', 'In Progress', 'High', 'Love Kumar'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Aarav Mehta', 'aarav@outlook.com', 'Mehta Delivery Solutions', 'Lead qualification scoring issue.', 'New', 'Medium', 'Sahil');

-- Seed ticket_assignments
INSERT INTO "ticket_assignments" (ticket_id, employee_id) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55');

-- Seed ticket_chat
INSERT INTO "ticket_chat" (ticket_id, user_name, message, sender_type) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rahul Sharma', 'Hello, I get a 413 error when trying to upload product images over 5MB. Can you expand the file limits?', 'received'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Love Kumar', 'Checking the Nginx configuration. I will update the client max body size limit in the environment sandbox. Give me 10 mins.', 'sent');

-- Seed ticket_history
INSERT INTO "ticket_history" (ticket_id, user_name, action) VALUES
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sanjay Kumar Sharma', 'Ticket created and assigned to Love Kumar'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Love Kumar', 'Changed ticket status to In Progress'),
('40eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Sanjay Kumar Sharma', 'Ticket created and assigned to Sahil');

-- Seed admin_notes
INSERT INTO "admin_notes" (page_key, title, notes) VALUES
('dashboard_main', 'Q3 Sales Targets', 'Focus on Enterprise leads coming from LinkedIn this month. Special discount offering: 15% off custom CRM integrations.'),
('attendance_rules', 'Check-in Policy', 'Remember that employees can only mark check-in/out from registered PC/laptop systems connected to company systems.');
