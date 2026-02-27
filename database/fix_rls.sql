-- Allow employers (and anyone) to view profiles of applicants
-- This is necessary because the default policy "Users can manage own profile" 
-- restricts viewing to ONLY the owner. Employers need read access.

CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Allow employers to view resumes of applicants
CREATE POLICY "Resumes are viewable by everyone" 
ON resumes FOR SELECT 
USING (true);
