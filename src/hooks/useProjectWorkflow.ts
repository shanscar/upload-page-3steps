import { useState, useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { AnalysisData } from '@/types/project';

// 工作流程狀態
export type WorkflowStep = 'description' | 'analysis' | 'upload' | 'collaboration' | 'completed';

interface WorkflowState {
  currentStep: WorkflowStep;
  description: string;
  analysisData: AnalysisData | null;
  canProceed: boolean;
}

export function useProjectWorkflow() {
  const { createProject, updateMetadata, state } = useProject();
  
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStep: 'description',
    description: '',
    analysisData: null,
    canProceed: false,
  });

  // 設置描述
  const setDescription = useCallback((description: string) => {
    setWorkflowState(prev => ({
      ...prev,
      description,
      canProceed: description.trim().length > 10
    }));
  }, []);

  // 設置分析結果
  const setAnalysisData = useCallback((analysisData: AnalysisData) => {
    setWorkflowState(prev => ({
      ...prev,
      analysisData,
      canProceed: true
    }));
  }, []);

  // 進入下一步
  const nextStep = useCallback(async () => {
    if (!workflowState.canProceed) return;

    switch (workflowState.currentStep) {
      case 'description':
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'analysis',
          canProceed: false 
        }));
        break;

      case 'analysis':
        // 創建項目並保存元數據
        if (workflowState.analysisData) {
          const project = await createProject(
            `${workflowState.analysisData.location} - ${workflowState.analysisData.type}`,
            workflowState.description
          );
          
          if (project) {
            await updateMetadata({
              location: workflowState.analysisData.location,
              content_type: workflowState.analysisData.type,
              people: workflowState.analysisData.people,
              recording_date: workflowState.analysisData.date,
              template_type: workflowState.analysisData.template
            });
          }
        }
        
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'upload',
          canProceed: false 
        }));
        break;

      case 'upload':
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'collaboration',
          canProceed: true 
        }));
        break;

      case 'collaboration':
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'completed',
          canProceed: true 
        }));
        break;
    }
  }, [workflowState, createProject, updateMetadata]);

  // 返回上一步
  const previousStep = useCallback(() => {
    switch (workflowState.currentStep) {
      case 'analysis':
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'description',
          canProceed: prev.description.trim().length > 10 
        }));
        break;

      case 'upload':
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'analysis',
          canProceed: !!prev.analysisData 
        }));
        break;

      case 'collaboration':
        setWorkflowState(prev => ({ 
          ...prev, 
          currentStep: 'upload',
          canProceed: false 
        }));
        break;
    }
  }, [workflowState.currentStep]);

  // 重置工作流程
  const resetWorkflow = useCallback(() => {
    setWorkflowState({
      currentStep: 'description',
      description: '',
      analysisData: null,
      canProceed: false,
    });
  }, []);

  // 設置上傳完成
  const setUploadComplete = useCallback(() => {
    setWorkflowState(prev => ({ 
      ...prev, 
      canProceed: true 
    }));
  }, []);

  return {
    workflowState,
    setDescription,
    setAnalysisData,
    setUploadComplete,
    nextStep,
    previousStep,
    resetWorkflow,
    currentProject: state.currentProject,
    loading: state.loading,
    error: state.error,
  };
}