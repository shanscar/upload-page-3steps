import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  Project, 
  ProjectMetadata, 
  ProjectFile, 
  AudioTrack, 
  CollaborationMemo, 
  ProcessingJob, 
  FullProject 
} from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProjectService, transformProcessingJob } from '@/services/projectService';

// 項目狀態
interface ProjectState {
  currentProject: FullProject | null;
  projects: Project[];
  loading: boolean;
  error: string | null;
}

// 項目動作
type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PROJECT'; payload: FullProject | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_METADATA'; payload: ProjectMetadata }
  | { type: 'ADD_FILE'; payload: ProjectFile }
  | { type: 'UPDATE_FILE'; payload: ProjectFile }
  | { type: 'ADD_AUDIO_TRACK'; payload: AudioTrack }
  | { type: 'UPDATE_AUDIO_TRACK'; payload: AudioTrack }
  | { type: 'UPDATE_COLLABORATION_MEMO'; payload: CollaborationMemo }
  | { type: 'ADD_PROCESSING_JOB'; payload: ProcessingJob }
  | { type: 'UPDATE_PROCESSING_JOB'; payload: ProcessingJob };

// 初始狀態
const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  loading: false,
  error: null,
};

// Reducer
function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    
    case 'ADD_PROJECT':
      return { 
        ...state, 
        projects: [action.payload, ...state.projects] 
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.project.id === action.payload.id 
          ? { ...state.currentProject, project: action.payload }
          : state.currentProject
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.project.id === action.payload 
          ? null 
          : state.currentProject
      };
    
    case 'UPDATE_METADATA':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { ...state.currentProject, metadata: action.payload }
          : null
      };
    
    case 'ADD_FILE':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { 
              ...state.currentProject, 
              files: [...state.currentProject.files, action.payload] 
            }
          : null
      };
    
    case 'UPDATE_FILE':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { 
              ...state.currentProject, 
              files: state.currentProject.files.map(f => 
                f.id === action.payload.id ? action.payload : f
              ) 
            }
          : null
      };
    
    case 'ADD_AUDIO_TRACK':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { 
              ...state.currentProject, 
              audioTracks: [...state.currentProject.audioTracks, action.payload] 
            }
          : null
      };
    
    case 'UPDATE_AUDIO_TRACK':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { 
              ...state.currentProject, 
              audioTracks: state.currentProject.audioTracks.map(t => 
                t.id === action.payload.id ? action.payload : t
              ) 
            }
          : null
      };
    
    case 'UPDATE_COLLABORATION_MEMO':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { ...state.currentProject, collaborationMemo: action.payload }
          : null
      };
    
    case 'ADD_PROCESSING_JOB':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { 
              ...state.currentProject, 
              processingJobs: [...state.currentProject.processingJobs, action.payload] 
            }
          : null
      };
    
    case 'UPDATE_PROCESSING_JOB':
      return {
        ...state,
        currentProject: state.currentProject 
          ? { 
              ...state.currentProject, 
              processingJobs: state.currentProject.processingJobs.map(j => 
                j.id === action.payload.id ? action.payload : j
              ) 
            }
          : null
      };
    
    default:
      return state;
  }
}

// Context
interface ProjectContextType {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  
  // 項目操作
  createProject: (title: string, description: string) => Promise<Project | null>;
  loadProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  loadProjects: () => Promise<void>;
  
  // 元數據操作
  updateMetadata: (metadata: Partial<ProjectMetadata>) => Promise<void>;
  
  // 檔案操作
  uploadFile: (file: File, onProgress?: (progress: number) => void) => Promise<ProjectFile | null>;
  
  // 音軌操作
  addAudioTrack: (track: Omit<AudioTrack, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAudioTrack: (trackId: string, updates: Partial<AudioTrack>) => Promise<void>;
  
  // 協作操作
  updateCollaborationMemo: (memo: Partial<CollaborationMemo>) => Promise<void>;
  
  // 處理工作操作
  startProcessingJob: (jobType: ProcessingJob['job_type']) => Promise<void>;
  updateProcessingJob: (jobId: string, updates: Partial<ProcessingJob>) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { toast } = useToast();

  // 實時監聽處理工作更新
  useEffect(() => {
    if (!state.currentProject) return;

    const channel = supabase
      .channel('processing-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'processing_jobs',
          filter: `project_id=eq.${state.currentProject.project.id}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            dispatch({ 
              type: 'UPDATE_PROCESSING_JOB', 
              payload: transformProcessingJob(payload.new) 
            });
          } else if (payload.eventType === 'INSERT') {
            dispatch({ 
              type: 'ADD_PROCESSING_JOB', 
              payload: transformProcessingJob(payload.new) 
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.currentProject?.project.id]);

  // 創建項目
  const createProject = async (title: string, description: string): Promise<Project | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const project = await ProjectService.createProject(title, description);
      dispatch({ type: 'ADD_PROJECT', payload: project });
      toast({ title: '項目創建成功' });
      
      return project;
    } catch (error) {
      const message = error instanceof Error ? error.message : '創建項目失敗';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({ title: '錯誤', description: message, variant: 'destructive' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 加載項目
  const loadProject = async (projectId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const fullProject = await ProjectService.loadFullProject(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: fullProject });
    } catch (error) {
      const message = error instanceof Error ? error.message : '加載項目失敗';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 更新項目
  const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
    try {
      const project = await ProjectService.updateProject(projectId, updates);
      dispatch({ type: 'UPDATE_PROJECT', payload: project });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新項目失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 刪除項目
  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      await ProjectService.deleteProject(projectId);
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
      toast({ title: '項目已刪除' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '刪除項目失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 加載項目列表
  const loadProjects = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const projects = await ProjectService.loadProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      const message = error instanceof Error ? error.message : '加載項目列表失敗';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 更新元數據
  const updateMetadata = async (metadata: Partial<ProjectMetadata>): Promise<void> => {
    if (!state.currentProject) return;

    try {
      const updatedMetadata = await ProjectService.upsertMetadata(
        state.currentProject.project.id, 
        metadata
      );
      dispatch({ type: 'UPDATE_METADATA', payload: updatedMetadata });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新元數據失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 上傳檔案
  const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<ProjectFile | null> => {
    if (!state.currentProject) return null;

    try {
      const projectFile = await ProjectService.uploadFile(
        state.currentProject.project.id, 
        file, 
        onProgress
      );
      dispatch({ type: 'ADD_FILE', payload: projectFile });
      return projectFile;
    } catch (error) {
      const message = error instanceof Error ? error.message : '檔案上傳失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
      return null;
    }
  };

  // 添加音軌
  const addAudioTrack = async (track: Omit<AudioTrack, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    try {
      const audioTrack = await ProjectService.addAudioTrack(track);
      dispatch({ type: 'ADD_AUDIO_TRACK', payload: audioTrack });
    } catch (error) {
      const message = error instanceof Error ? error.message : '添加音軌失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 更新音軌
  const updateAudioTrack = async (trackId: string, updates: Partial<AudioTrack>): Promise<void> => {
    try {
      const audioTrack = await ProjectService.updateAudioTrack(trackId, updates);
      dispatch({ type: 'UPDATE_AUDIO_TRACK', payload: audioTrack });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新音軌失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 更新協作備忘錄
  const updateCollaborationMemo = async (memo: Partial<CollaborationMemo>): Promise<void> => {
    if (!state.currentProject) return;

    try {
      const collaborationMemo = await ProjectService.upsertCollaborationMemo(
        state.currentProject.project.id, 
        memo
      );
      dispatch({ type: 'UPDATE_COLLABORATION_MEMO', payload: collaborationMemo });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新協作備忘錄失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 開始處理工作
  const startProcessingJob = async (jobType: ProcessingJob['job_type']): Promise<void> => {
    if (!state.currentProject) return;

    try {
      const processingJob = await ProjectService.createProcessingJob(
        state.currentProject.project.id, 
        jobType
      );
      dispatch({ type: 'ADD_PROCESSING_JOB', payload: processingJob });
    } catch (error) {
      const message = error instanceof Error ? error.message : '開始處理工作失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  // 更新處理工作
  const updateProcessingJob = async (jobId: string, updates: Partial<ProcessingJob>): Promise<void> => {
    try {
      const processingJob = await ProjectService.updateProcessingJob(jobId, updates);
      dispatch({ type: 'UPDATE_PROCESSING_JOB', payload: processingJob });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新處理工作失敗';
      toast({ title: '錯誤', description: message, variant: 'destructive' });
    }
  };

  const value: ProjectContextType = {
    state,
    dispatch,
    createProject,
    loadProject,
    updateProject,
    deleteProject,
    loadProjects,
    updateMetadata,
    uploadFile,
    addAudioTrack,
    updateAudioTrack,
    updateCollaborationMemo,
    startProcessingJob,
    updateProcessingJob,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// Hook
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}