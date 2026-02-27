-- database/01_fix_rls_security.sql

-- 1. Drop the overly permissive public policies
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

DROP POLICY IF EXISTS "Resumes are viewable by everyone" ON resumes;

-- 2. Ensure owners can still view their own profiles and resumes
-- (Profiles owner view is implicitly needed if we dropped the public one, but let's add it explicitly if it doesn't exist)
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- 3. Create policies for Employers to view applicants
-- An employer can view a candidate's profile IF the candidate has applied to a job owned by that employer's company.
CREATE POLICY "Employers view applicant profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE a.user_id = profiles.id
      AND c.owner_id = auth.uid()
  )
);

-- An employer can view a candidate's resume IF the candidate has applied to a job owned by that employer's company.
CREATE POLICY "Employers view applicant resumes" ON resumes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE a.user_id = resumes.user_id
      AND c.owner_id = auth.uid()
  )
);

-- 4. Allow everyone to see employer profiles (e.g. for job listings)
CREATE POLICY "Employer profiles are public" ON profiles FOR SELECT USING (role = 'employer');
