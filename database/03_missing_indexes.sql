-- Optimize Resume querying for users
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);

-- Optimize Application querying for users and jobs
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS applications_job_id_idx ON public.applications(job_id);

-- Optimize Jobs querying 
CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs(status);
CREATE INDEX IF NOT EXISTS jobs_industry_idx ON public.jobs(industry);

-- Create HNSW index for PgVector embeddings on jobs
CREATE INDEX ON public.jobs USING hnsw (embedding vector_l2_ops);

-- Create HNSW index for PgVector embeddings on resumes 
CREATE INDEX ON public.resumes USING hnsw (embedding vector_l2_ops);
