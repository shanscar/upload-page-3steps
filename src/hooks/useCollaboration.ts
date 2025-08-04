import { useState, useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { CollaborationMemo, TaskAssignment } from '@/types/project';

interface CollaborationData {
  templateIds: string[];
  assignments: TaskAssignment[];
  customTasks: TaskAssignment[];
}

interface CollaborationHook {
  isLoading: boolean;
  memo: CollaborationMemo | null;
  error: string | null;
  updateMemo: (data: Partial<CollaborationData>) => Promise<void>;
  sendNotifications: () => Promise<{ timestamp: string; recipientCount: number } | null>;
  generateShareLink: () => Promise<string | null>;
}

export function useCollaboration(): CollaborationHook {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    state, 
    updateCollaborationMemo,
    startProcessingJob 
  } = useProject();

  const memo = state.currentProject?.collaborationMemo || null;

  const updateMemo = useCallback(async (data: Partial<CollaborationData>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const memoData: Partial<CollaborationMemo> = {
        template_ids: data.templateIds || [],
        assignments: data.assignments || [],
        custom_tasks: data.customTasks || [],
        notification_status: 'pending'
      };

      await updateCollaborationMemo(memoData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新協作備忘錄失敗';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [updateCollaborationMemo]);

  const sendNotifications = useCallback(async (): Promise<{ timestamp: string; recipientCount: number } | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Update notification status
      await updateCollaborationMemo({
        notification_status: 'sent'
      });

      // Start notification processing job
      await startProcessingJob('transcoding');

      // Return mock response
      return {
        timestamp: new Date().toLocaleString('zh-HK'),
        recipientCount: memo?.assignments?.length || 0
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '發送通知失敗';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [updateCollaborationMemo, startProcessingJob, memo]);

  const generateShareLink = useCallback(async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate a mock share link
      const shareLink = `https://example.com/project/${state.currentProject?.project.id}`;
      
      await updateCollaborationMemo({
        share_link: shareLink
      });

      return shareLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成分享連結失敗';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [updateCollaborationMemo, state.currentProject]);

  return {
    isLoading,
    memo,
    error,
    updateMemo,
    sendNotifications,
    generateShareLink,
  };
}