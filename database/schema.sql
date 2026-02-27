-- CareerPilot AI – Supabase SQL Schema
-- Run this in the Supabase SQL Editor (https://app.supabase.com → SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- PROFILES
-- ================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'jobseeker' CHECK (role IN ('jobseeker', 'employer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COMPANIES
-- ================================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- RESUMES
-- ================================================================
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  file_url TEXT,
  raw_text TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years FLOAT DEFAULT 0,
  education_level TEXT DEFAULT 'other',
  industry TEXT DEFAULT 'technology',
  seniority TEXT DEFAULT 'junior',
  embedding FLOAT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- RESUME ANALYSIS
-- ================================================================
CREATE TABLE IF NOT EXISTS resume_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  overall_score INT DEFAULT 0,
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  keyword_optimization INT DEFAULT 0,
  profile_completeness INT DEFAULT 0,
  ai_summary TEXT,
  industry_alignment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROADMAPS
-- ================================================================
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  target_role TEXT,
  total_duration TEXT,
  ai_narrative TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- JOBS
-- ================================================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  skills_required TEXT[] DEFAULT '{}',
  experience_min FLOAT DEFAULT 0,
  experience_max FLOAT DEFAULT 10,
  education_level TEXT DEFAULT 'bachelors',
  industry TEXT,
  location TEXT,
  job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'remote', 'internship')),
  salary_min INT,
  salary_max INT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- APPLICATIONS  
-- ================================================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'viewed', 'shortlisted', 'rejected', 'hired')),
  match_score INT DEFAULT 0,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- ================================================================
-- STORAGE BUCKET (run separately if not exists)
-- ================================================================
-- Go to Storage → Create Bucket → Name: "resumes" → Public: false

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, write own
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Companies: public read, owner write
CREATE POLICY "Companies are viewable" ON companies FOR SELECT USING (true);
CREATE POLICY "Owners insert companies" ON companies FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update companies" ON companies FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete companies" ON companies FOR DELETE USING (auth.uid() = owner_id);

-- Resumes: only owner
CREATE POLICY "Users select own resume" ON resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own resume" ON resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own resume" ON resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own resume" ON resumes FOR DELETE USING (auth.uid() = user_id);

-- Resume analysis: only owner
CREATE POLICY "Users select own analysis" ON resume_analysis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own analysis" ON resume_analysis FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own analysis" ON resume_analysis FOR UPDATE USING (auth.uid() = user_id);

-- Roadmaps: only owner
CREATE POLICY "Users select own roadmap" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own roadmap" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own roadmap" ON roadmaps FOR UPDATE USING (auth.uid() = user_id);

-- Jobs: public read, employer write own
CREATE POLICY "Jobs are publicly viewable" ON jobs FOR SELECT USING (true);
CREATE POLICY "Employers insert own jobs" ON jobs FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT owner_id FROM companies WHERE id = company_id)
);
CREATE POLICY "Employers update own jobs" ON jobs FOR UPDATE USING (
  auth.uid() IN (SELECT owner_id FROM companies WHERE id = company_id)
);
CREATE POLICY "Employers delete own jobs" ON jobs FOR DELETE USING (
  auth.uid() IN (SELECT owner_id FROM companies WHERE id = company_id)
);

-- Applications: jobseekers manage own, employers view/update their job apps
CREATE POLICY "Users select own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Employers view applications" ON applications FOR SELECT USING (
  auth.uid() IN (
    SELECT c.owner_id FROM companies c
    JOIN jobs j ON j.company_id = c.id
    WHERE j.id = job_id
  )
);
CREATE POLICY "Employers update application status" ON applications FOR UPDATE USING (
  auth.uid() IN (
    SELECT c.owner_id FROM companies c
    JOIN jobs j ON j.company_id = c.id
    WHERE j.id = job_id
  )
);

-- ================================================================
-- SEED DATA – Sample Jobs (optional, for testing)
-- ================================================================
-- After creating a company, insert sample jobs:
-- INSERT INTO jobs (company_id, title, description, requirements, skills_required, experience_min, experience_max, education_level, industry, location, job_type)
-- VALUES ('your-company-id', 'Full Stack Developer', '...', '...', ARRAY['React', 'Python', 'PostgreSQL'], 2, 5, 'bachelors', 'technology', 'Karachi, Pakistan', 'full-time');
