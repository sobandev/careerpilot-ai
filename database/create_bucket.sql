-- 1. Create a public bucket named 'resumes'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to the resumes
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes');

-- 3. Allow authenticated users to upload resumes
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.role() = 'authenticated'
);
