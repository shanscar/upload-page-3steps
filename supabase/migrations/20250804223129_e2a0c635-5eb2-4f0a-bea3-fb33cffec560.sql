-- 創建項目核心表
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 創建項目元數據表
CREATE TABLE public.project_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  location TEXT,
  content_type TEXT,
  people JSONB DEFAULT '[]'::jsonb,
  recording_date DATE,
  template_type TEXT,
  ai_confidence_score DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 創建項目檔案表
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 創建音軌表
CREATE TABLE public.audio_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  track_number INTEGER NOT NULL,
  language TEXT NOT NULL DEFAULT 'zh-HK',
  channel_type TEXT NOT NULL DEFAULT 'stereo' CHECK (channel_type IN ('mono', 'stereo')),
  is_selected BOOLEAN NOT NULL DEFAULT true,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 創建協作備忘錄表
CREATE TABLE public.collaboration_memos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  template_ids JSONB DEFAULT '[]'::jsonb,
  custom_tasks JSONB DEFAULT '[]'::jsonb,
  assignments JSONB DEFAULT '[]'::jsonb,
  share_link TEXT,
  notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 創建處理工作表
CREATE TABLE public.processing_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('upload', 'separation', 'ai_analysis', 'auto_tagging', 'transcoding')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 啟用 RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 政策
CREATE POLICY "Users can view their own projects" 
ON public.projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = user_id);

-- 項目元數據政策
CREATE POLICY "Users can view metadata of their projects" 
ON public.project_metadata FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can create metadata for their projects" 
ON public.project_metadata FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can update metadata of their projects" 
ON public.project_metadata FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

-- 項目檔案政策
CREATE POLICY "Users can view files of their projects" 
ON public.project_files FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can create files for their projects" 
ON public.project_files FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can update files of their projects" 
ON public.project_files FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

-- 音軌政策
CREATE POLICY "Users can view audio tracks of their projects" 
ON public.audio_tracks FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can create audio tracks for their projects" 
ON public.audio_tracks FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can update audio tracks of their projects" 
ON public.audio_tracks FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

-- 協作備忘錄政策
CREATE POLICY "Users can view collaboration memos of their projects" 
ON public.collaboration_memos FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can create collaboration memos for their projects" 
ON public.collaboration_memos FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can update collaboration memos of their projects" 
ON public.collaboration_memos FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

-- 處理工作政策
CREATE POLICY "Users can view processing jobs of their projects" 
ON public.processing_jobs FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can create processing jobs for their projects" 
ON public.processing_jobs FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

CREATE POLICY "Users can update processing jobs of their projects" 
ON public.processing_jobs FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

-- 創建更新時間觸發器函數
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 為所有表創建更新時間觸發器
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_metadata_updated_at
  BEFORE UPDATE ON public.project_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_files_updated_at
  BEFORE UPDATE ON public.project_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audio_tracks_updated_at
  BEFORE UPDATE ON public.audio_tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaboration_memos_updated_at
  BEFORE UPDATE ON public.collaboration_memos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_processing_jobs_updated_at
  BEFORE UPDATE ON public.processing_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 創建儲存桶
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- 創建儲存政策
CREATE POLICY "Users can view their own project files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own project files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);