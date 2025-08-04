import { supabase } from '@/integrations/supabase/client';
import { 
  Project, 
  ProjectMetadata, 
  ProjectFile, 
  AudioTrack, 
  CollaborationMemo, 
  ProcessingJob, 
  FullProject,
  ProjectStatus,
  JobType,
  ProcessingStatus,
  UploadStatus,
  ChannelType,
  NotificationStatus,
  TaskAssignment
} from '@/types/project';

// 類型轉換函數
export function transformProject(data: any): Project {
  return {
    ...data,
    status: data.status as ProjectStatus
  };
}

export function transformProjectMetadata(data: any): ProjectMetadata {
  return {
    ...data,
    people: Array.isArray(data.people) ? data.people : []
  };
}

export function transformProjectFile(data: any): ProjectFile {
  return {
    ...data,
    upload_status: data.upload_status as UploadStatus,
    processing_status: data.processing_status as ProcessingStatus
  };
}

export function transformAudioTrack(data: any): AudioTrack {
  return {
    ...data,
    channel_type: data.channel_type as ChannelType,
    processing_status: data.processing_status as ProcessingStatus
  };
}

export function transformCollaborationMemo(data: any): CollaborationMemo {
  return {
    ...data,
    template_ids: Array.isArray(data.template_ids) ? data.template_ids : [],
    custom_tasks: Array.isArray(data.custom_tasks) ? data.custom_tasks : [],
    assignments: Array.isArray(data.assignments) ? data.assignments : [],
    notification_status: data.notification_status as NotificationStatus
  };
}

export function transformProcessingJob(data: any): ProcessingJob {
  return {
    ...data,
    job_type: data.job_type as JobType,
    status: data.status as ProcessingStatus
  };
}

// 項目服務類
export class ProjectService {
  // 創建項目
  static async createProject(title: string, description: string): Promise<Project> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      throw new Error('用戶未登錄');
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.user.id,
        title,
        description,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return transformProject(data);
  }

  // 加載完整項目
  static async loadFullProject(projectId: string): Promise<FullProject> {
    const [
      projectResult,
      metadataResult,
      filesResult,
      tracksResult,
      memoResult,
      jobsResult
    ] = await Promise.all([
      supabase.from('projects').select().eq('id', projectId).single(),
      supabase.from('project_metadata').select().eq('project_id', projectId).maybeSingle(),
      supabase.from('project_files').select().eq('project_id', projectId),
      supabase.from('audio_tracks').select().eq('project_id', projectId),
      supabase.from('collaboration_memos').select().eq('project_id', projectId).maybeSingle(),
      supabase.from('processing_jobs').select().eq('project_id', projectId)
    ]);

    if (projectResult.error) throw projectResult.error;

    return {
      project: transformProject(projectResult.data),
      metadata: metadataResult.data ? transformProjectMetadata(metadataResult.data) : undefined,
      files: (filesResult.data || []).map(transformProjectFile),
      audioTracks: (tracksResult.data || []).map(transformAudioTrack),
      collaborationMemo: memoResult.data ? transformCollaborationMemo(memoResult.data) : undefined,
      processingJobs: (jobsResult.data || []).map(transformProcessingJob)
    };
  }

  // 加載項目列表
  static async loadProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformProject);
  }

  // 更新項目
  static async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return transformProject(data);
  }

  // 刪除項目
  static async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  // 更新或創建元數據
  static async upsertMetadata(projectId: string, metadata: Partial<ProjectMetadata>): Promise<ProjectMetadata> {
    const { data, error } = await supabase
      .from('project_metadata')
      .upsert({
        project_id: projectId,
        ...metadata
      })
      .select()
      .single();

    if (error) throw error;
    return transformProjectMetadata(data);
  }

  // 上傳檔案
  static async uploadFile(
    projectId: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ProjectFile> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('用戶未登錄');

    // 生成唯一檔案路徑
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.user.id}/${projectId}/original/${fileName}`;

    // 上傳到 Storage
    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 記錄到數據庫
    const { data, error } = await supabase
      .from('project_files')
      .insert({
        project_id: projectId,
        original_filename: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        upload_status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;
    return transformProjectFile(data);
  }

  // 添加音軌
  static async addAudioTrack(track: Omit<AudioTrack, 'id' | 'created_at' | 'updated_at'>): Promise<AudioTrack> {
    const { data, error } = await supabase
      .from('audio_tracks')
      .insert(track)
      .select()
      .single();

    if (error) throw error;
    return transformAudioTrack(data);
  }

  // 更新音軌
  static async updateAudioTrack(trackId: string, updates: Partial<AudioTrack>): Promise<AudioTrack> {
    const { data, error } = await supabase
      .from('audio_tracks')
      .update(updates)
      .eq('id', trackId)
      .select()
      .single();

    if (error) throw error;
    return transformAudioTrack(data);
  }

  // 更新或創建協作備忘錄
  static async upsertCollaborationMemo(
    projectId: string, 
    memo: Partial<CollaborationMemo>
  ): Promise<CollaborationMemo> {
    // 轉換陣列類型為 JSON
    const memoData: any = {
      project_id: projectId,
      ...memo
    };

    // 確保 JSON 欄位正確轉換
    if (memo.template_ids) {
      memoData.template_ids = memo.template_ids;
    }
    if (memo.custom_tasks) {
      memoData.custom_tasks = memo.custom_tasks;
    }
    if (memo.assignments) {
      memoData.assignments = memo.assignments;
    }

    const { data, error } = await supabase
      .from('collaboration_memos')
      .upsert(memoData)
      .select()
      .single();

    if (error) throw error;
    return transformCollaborationMemo(data);
  }

  // 創建處理工作
  static async createProcessingJob(
    projectId: string, 
    jobType: JobType
  ): Promise<ProcessingJob> {
    const { data, error } = await supabase
      .from('processing_jobs')
      .insert({
        project_id: projectId,
        job_type: jobType,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return transformProcessingJob(data);
  }

  // 更新處理工作
  static async updateProcessingJob(
    jobId: string, 
    updates: Partial<ProcessingJob>
  ): Promise<ProcessingJob> {
    const { data, error } = await supabase
      .from('processing_jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return transformProcessingJob(data);
  }

  // 生成檔案路徑
  static generateFilePath(userId: string, projectId: string, fileType: 'original' | 'processed'): string {
    const uuid = crypto.randomUUID();
    return `${userId}/${projectId}/${fileType}/${uuid}`;
  }
}