// 項目狀態類型
export type ProjectStatus = 'draft' | 'processing' | 'completed';

// 處理工作類型  
export type JobType = 'upload' | 'separation' | 'ai_analysis' | 'auto_tagging' | 'transcoding';

// 處理狀態類型
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 上傳狀態類型
export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed';

// 通知狀態類型
export type NotificationStatus = 'pending' | 'sent' | 'failed';

// 音軌頻道類型
export type ChannelType = 'mono' | 'stereo';

// 項目主表
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// 項目元數據
export interface ProjectMetadata {
  id: string;
  project_id: string;
  location?: string;
  content_type?: string;
  people: string[];
  recording_date?: string;
  template_type?: string;
  ai_confidence_score: number;
  created_at: string;
  updated_at: string;
}

// 項目檔案
export interface ProjectFile {
  id: string;
  project_id: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  upload_status: UploadStatus;
  processing_status: ProcessingStatus;
  created_at: string;
  updated_at: string;
}

// 音軌
export interface AudioTrack {
  id: string;
  project_id: string;
  track_number: number;
  language: string;
  channel_type: ChannelType;
  is_selected: boolean;
  processing_status: ProcessingStatus;
  created_at: string;
  updated_at: string;
}

// 任務指派
export interface TaskAssignment {
  id: string;
  task: string;
  assignee?: string;
  email?: string;
  deadline?: string;
  priority?: 'high' | 'medium' | 'low';
}

// 協作備忘錄
export interface CollaborationMemo {
  id: string;
  project_id: string;
  template_ids: string[];
  custom_tasks: TaskAssignment[];
  assignments: TaskAssignment[];
  share_link?: string;
  notification_status: NotificationStatus;
  created_at: string;
  updated_at: string;
}

// 處理工作
export interface ProcessingJob {
  id: string;
  project_id: string;
  job_type: JobType;
  status: ProcessingStatus;
  progress_percentage: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// 完整項目數據（包含所有關聯）
export interface FullProject {
  project: Project;
  metadata?: ProjectMetadata;
  files: ProjectFile[];
  audioTracks: AudioTrack[];
  collaborationMemo?: CollaborationMemo;
  processingJobs: ProcessingJob[];
}

// API 響應類型
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// 檔案上傳參數
export interface FileUploadParams {
  file: File;
  onProgress?: (progress: number) => void;
}

// 生成檔案路徑的函數
export interface FilePathGenerator {
  userId: string;
  projectId: string;
  fileType: 'original' | 'processed';
}

// 分析結果（從現有組件遷移）
export interface AnalysisData {
  location: string;
  type: string;
  people: string[];
  date: string;
  template: string;
}