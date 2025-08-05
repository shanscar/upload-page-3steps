-- 徹底禁用所有表格的 Row Level Security
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_metadata DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_memos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs DISABLE ROW LEVEL SECURITY;