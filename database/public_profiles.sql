-- Remove existing restrictive SELECT policies if they exist (optional, but let's just add a public read policy)
DO $$
BEGIN
    -- Drop restrictive select if we want to replace it, or just add a new public one
    -- Actually, it's easier to just add a NEW public policy. PostgreSQL allows multiple policies (they are ORed).
END
$$;

-- Allow public read access to resumes
CREATE POLICY "Public resumes are viewable" ON resumes FOR SELECT USING (true);

-- Allow public read access to resume analysis
CREATE POLICY "Public analysis is viewable" ON resume_analysis FOR SELECT USING (true);

-- Allow public read access to storage 'resumes' bucket
-- (Only necessary if you want people to download the raw PDF)
CREATE POLICY "Public resume files" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
