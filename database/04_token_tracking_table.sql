-- Table for tracking API token usage
CREATE TABLE IF NOT EXISTS public.token_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying token usage by user
CREATE INDEX IF NOT EXISTS token_usage_user_id_idx ON public.token_usage_logs(user_id);
-- Index for querying token usage by date/time (e.g. daily limits)
CREATE INDEX IF NOT EXISTS token_usage_created_at_idx ON public.token_usage_logs(created_at);

-- Set RLS policies for token usage
ALTER TABLE public.token_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own token logs"
    ON public.token_usage_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own token logs"
    ON public.token_usage_logs FOR SELECT
    USING (auth.uid() = user_id);
