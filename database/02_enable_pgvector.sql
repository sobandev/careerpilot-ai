-- database/02_enable_pgvector.sql

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Alter resumes to use 384-dimensional vector (for Semantic Search)
-- We need to drop the old raw float array first
-- WARNING: This will drop existing embedding data, 
-- but since it was truncated to 100 dims, it was useless anyway.
ALTER TABLE resumes DROP COLUMN IF EXISTS embedding;
ALTER TABLE resumes ADD COLUMN embedding vector(384);

-- 3. Also alter jobs table to store embeddings (it currently doesn't have an embedding column)
-- The audit noted Scoring calculates on Python. Jobs need embeddings for pgvector to work!
ALTER TABLE jobs ADD COLUMN embedding vector(384);

-- 4. Create an RPC function to perform semantic search natively in PostgreSQL
-- This function takes a resume embedding and returns matching jobs, calculating cosine distance (<=>)
CREATE OR REPLACE FUNCTION match_jobs_for_resume(
  resume_embedding vector(384),
  match_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  company_id uuid,
  title text,
  description text,
  requirements text,
  skills_required text[],
  experience_min float,
  experience_max float,
  education_level text,
  industry text,
  location text,
  job_type text,
  salary_min int,
  salary_max int,
  status text,
  views int,
  created_at timestamptz,
  updated_at timestamptz,
  company_name text,
  company_logo_url text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.company_id,
    j.title,
    j.description,
    j.requirements,
    j.skills_required,
    j.experience_min,
    j.experience_max,
    j.education_level,
    j.industry,
    j.location,
    j.job_type,
    j.salary_min,
    j.salary_max,
    j.status,
    j.views,
    j.created_at,
    j.updated_at,
    c.name as company_name,
    c.logo_url as company_logo_url,
    1 - (j.embedding <=> resume_embedding) as similarity
  FROM jobs j
  JOIN companies c ON j.company_id = c.id
  WHERE j.status = 'active'
    -- Only rank jobs that actually have an embedding
    AND j.embedding IS NOT NULL
  ORDER BY j.embedding <=> resume_embedding
  LIMIT match_limit;
END;
$$;
