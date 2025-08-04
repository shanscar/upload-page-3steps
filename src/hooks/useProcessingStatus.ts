import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProcessingJob, JobType } from '@/types/project';

interface ProcessingStatusHook {
  processingJobs: ProcessingJob[];
  isProcessing: boolean;
  completedJobs: ProcessingJob[];
  failedJobs: ProcessingJob[];
  getJobProgress: (jobType: JobType) => number;
  getJobStatus: (jobType: JobType) => string;
  startJob: (jobType: JobType) => Promise<void>;
  updateJobProgress: (jobId: string, progress: number) => Promise<void>;
  completeJob: (jobId: string) => Promise<void>;
  failJob: (jobId: string, error: string) => Promise<void>;
}

export function useProcessingStatus(): ProcessingStatusHook {
  const { state, startProcessingJob, updateProcessingJob } = useProject();
  
  const processingJobs = state.currentProject?.processingJobs || [];
  const isProcessing = processingJobs.some(job => job.status === 'processing');
  const completedJobs = processingJobs.filter(job => job.status === 'completed');
  const failedJobs = processingJobs.filter(job => job.status === 'failed');

  // 獲取特定工作類型的進度
  const getJobProgress = (jobType: JobType): number => {
    const job = processingJobs.find(j => j.job_type === jobType);
    return job?.progress_percentage || 0;
  };

  // 獲取特定工作類型的狀態
  const getJobStatus = (jobType: JobType): string => {
    const job = processingJobs.find(j => j.job_type === jobType);
    return job?.status || 'pending';
  };

  // 開始工作
  const startJob = async (jobType: JobType): Promise<void> => {
    await startProcessingJob(jobType);
  };

  // 更新工作進度
  const updateJobProgress = async (jobId: string, progress: number): Promise<void> => {
    await updateProcessingJob(jobId, {
      progress_percentage: progress,
      status: progress >= 100 ? 'completed' : 'processing'
    });
  };

  // 完成工作
  const completeJob = async (jobId: string): Promise<void> => {
    await updateProcessingJob(jobId, {
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    });
  };

  // 工作失敗
  const failJob = async (jobId: string, error: string): Promise<void> => {
    await updateProcessingJob(jobId, {
      status: 'failed',
      error_message: error
    });
  };

  return {
    processingJobs,
    isProcessing,
    completedJobs,
    failedJobs,
    getJobProgress,
    getJobStatus,
    startJob,
    updateJobProgress,
    completeJob,
    failJob,
  };
}