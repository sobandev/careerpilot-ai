-- Migration: Add contact information to applications
-- This allows employers to see exactly how to contact an applicant for a specific role.

ALTER TABLE applications
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;
