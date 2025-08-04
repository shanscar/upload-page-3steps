import { useState, useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { AudioTrack, ProjectFile } from '@/types/project';

interface FileUploadData {
  files: File[];
  selectedDate: string;
  customDate?: Date;
  audioTracks: AudioTrack[];
}

interface FileUploadHook {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadFiles: (data: FileUploadData) => Promise<boolean>;
  updateAudioTrack: (trackId: string, updates: Partial<AudioTrack>) => Promise<void>;
}

export function useFileUpload(): FileUploadHook {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    uploadFile, 
    addAudioTrack, 
    updateAudioTrack: updateTrack,
    startProcessingJob 
  } = useProject();

  const uploadFiles = useCallback(async (data: FileUploadData): Promise<boolean> => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Upload files
      for (let i = 0; i < data.files.length; i++) {
        const file = data.files[i];
        
        await uploadFile(file, (progress) => {
          const totalProgress = ((i / data.files.length) + (progress / 100 / data.files.length)) * 100;
          setUploadProgress(totalProgress);
        });
      }

      // Add audio tracks to database
      for (const track of data.audioTracks) {
        if (track.is_selected) {
          await addAudioTrack({
            project_id: '', // Will be set by the context
            track_number: parseInt(track.id),
            language: track.language || 'zh-HK',
            channel_type: track.channel_type,
            is_selected: track.is_selected,
            processing_status: 'pending'
          });
        }
      }

      // Start processing jobs
      await startProcessingJob('separation');
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '檔案上傳失敗';
      setError(errorMessage);
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [uploadFile, addAudioTrack, startProcessingJob]);

  const updateAudioTrack = useCallback(async (trackId: string, updates: Partial<AudioTrack>): Promise<void> => {
    try {
      await updateTrack(trackId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新音軌失敗';
      setError(errorMessage);
    }
  }, [updateTrack]);

  return {
    isUploading,
    uploadProgress,
    error,
    uploadFiles,
    updateAudioTrack,
  };
}