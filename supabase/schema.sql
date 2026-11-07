-- ==============================================================================
-- IEM ADMISSION MANAGEMENT SYSTEM - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Students & Administrators)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  phone TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on email and role
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ------------------------------------------------------------------------------
-- 2. APPLICATIONS TABLE (Student Application Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  personal_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  academic_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  course TEXT NOT NULL,
  department TEXT,
  preference_1 TEXT,
  preference_2 TEXT,
  preference_3 TEXT,
  class_10_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  class_12_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  entrance_exam_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  campus_preference TEXT DEFAULT 'IEM Kolkata - Main Campus (Salt Lake)',
  application_status TEXT NOT NULL DEFAULT 'draft' CHECK (
    application_status IN (
      'draft',
      'submitted',
      'under_review',
      'correction_required',
      'resubmitted',
      'approved',
      'rejected',
      'seat_allotted',
      'admission_confirmed'
    )
  ),
  admin_remarks TEXT,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(application_status);
CREATE INDEX IF NOT EXISTS idx_applications_app_number ON public.applications(application_number);

-- ------------------------------------------------------------------------------
-- 3. DOCUMENTS TABLE (Admission Documents & Verification Status)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (
    document_type IN (
      'marksheet_10th',
      'marksheet_12th',
      'id_proof',
      'photo',
      'signature',
      'entrance_scorecard',
      'other'
    )
  ),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'approved', 'rejected')
  ),
  admin_remarks TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_documents_app_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(verification_status);

-- ------------------------------------------------------------------------------
-- 4. PAYMENTS TABLE (MVP Dummy Payments - Fixed at ₹0.00)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  transaction_reference TEXT UNIQUE NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'Online Gateway (₹0.00 MVP Dummy)',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_app_id ON public.payments(application_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);

-- ------------------------------------------------------------------------------
-- 5. MERIT LIST TABLE (Merit Ranks and Scores)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.merit_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  merit_rank INT UNIQUE NOT NULL,
  academic_score NUMERIC(5, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merit_list_rank ON public.merit_list(merit_rank);

-- ------------------------------------------------------------------------------
-- 6. SEAT ALLOCATIONS TABLE (Departmental Seat Allocations)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seat_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course TEXT NOT NULL,
  department TEXT NOT NULL,
  campus TEXT NOT NULL DEFAULT 'IEM Kolkata Main Campus (Salt Lake)',
  seat_number TEXT UNIQUE NOT NULL,
  allocation_status TEXT NOT NULL DEFAULT 'allotted' CHECK (
    allocation_status IN ('allotted', 'confirmed', 'cancelled')
  ),
  allotted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seat_allocations_app ON public.seat_allocations(application_id);
CREATE INDEX IF NOT EXISTS idx_seat_allocations_seat ON public.seat_allocations(seat_number);

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS TABLE (Student & System Announcements)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'status',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merit_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- APPLICATIONS Policies
CREATE POLICY "Students can view own application"
  ON public.applications FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can create own application"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own draft application"
  ON public.applications FOR UPDATE
  USING (auth.uid() = student_id OR public.is_admin())
  WITH CHECK (
    public.is_admin() OR (
      auth.uid() = student_id AND
      application_status IN ('draft', 'correction_required', 'resubmitted')
    )
  );

-- DOCUMENTS Policies
CREATE POLICY "Students can view own documents"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = documents.application_id AND (student_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Students can upload own documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE id = documents.application_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update document verification status"
  ON public.documents FOR UPDATE
  USING (public.is_admin());

-- PAYMENTS Policies
CREATE POLICY "Students can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Students can insert own payment record"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- MERIT LIST Policies
CREATE POLICY "Authenticated users can view merit list"
  ON public.merit_list FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage merit list"
  ON public.merit_list FOR ALL
  USING (public.is_admin());

-- SEAT ALLOCATIONS Policies
CREATE POLICY "Students can view own seat allocation"
  ON public.seat_allocations FOR SELECT
  USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Only admins can manage seat allocations"
  ON public.seat_allocations FOR ALL
  USING (public.is_admin());

-- NOTIFICATIONS Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = recipient_id OR public.is_admin());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = recipient_id);

-- ------------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION
-- ------------------------------------------------------------------------------
-- Execute in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('admission-docs', 'admission-docs', false);
-- CREATE POLICY "Students can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'admission-docs' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can view own uploaded documents" ON storage.objects FOR SELECT USING (bucket_id = 'admission-docs' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
