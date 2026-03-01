-- database/06_add_application_ai_feedback.sql
-- Add an ai_feedback column to applications table to store the generated tips

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS ai_feedback JSONB DEFAULT '[]'::JSONB;
