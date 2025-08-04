import { useState, useEffect } from "react";
import { WorkflowStep } from "@/components/WorkflowStep";
import { WorkflowProgressBar } from "@/components/WorkflowProgressBar";
import { HorizontalWorkflowSteps } from "@/components/HorizontalWorkflowSteps";
import { DescriptionInput } from "@/components/DescriptionInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { FileUpload } from "@/components/FileUpload";
import { UploadProgress } from "@/components/UploadProgress";
import { CollaborationMemo } from "@/components/CollaborationMemo";
import { useIsMobile } from "@/hooks/use-mobile";

type WorkflowState = 
  | 'talk-input' 
  | 'talk-analyzing' 
  | 'talk-metadata-edit'
  | 'archive-upload'
  | 'archive-processing' 
  | 'work-collaboration';

interface AnalysisData {
  location: string;
  type: string;
  people: string[];
  date: string;
  template: string;
  focus: string;
  teamRoles: Array<{
    role: string;
    tasks: string[];
  }>;
}

interface TalkState {
  currentSubState: 'input' | 'analyzing' | 'metadata-edit';
  lastCompletedSubState: 'input' | 'analyzing' | 'metadata-edit' | null;
  description: string;
  analysisData: AnalysisData | null;
}

interface ProcessStep {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface ArchiveState {
  uploadedFiles: File[];
  metadata: any;
  processingComplete: boolean;
  lastCompletedSubState: 'upload' | 'processing' | null;
  processingSteps: ProcessStep[];
  isProcessing: boolean;
}

interface SentStatus {
  timestamp: string;
  recipientCount: number;
}

interface WorkState {
  collaborationStarted: boolean;
  selectedTemplate: any;
  sentStatus: SentStatus | null;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<WorkflowState>('talk-input');
  const [talkState, setTalkState] = useState<TalkState>({
    currentSubState: 'input',
    lastCompletedSubState: null,
    description: '',
    analysisData: null
  });
  const [archiveState, setArchiveState] = useState<ArchiveState>({
    uploadedFiles: [],
    metadata: null,
    processingComplete: false,
    lastCompletedSubState: null,
    processingSteps: [
      { id: 'upload', name: '檔案上載', progress: 0, status: 'pending' },
      { id: 'separation', name: '音軌分離', progress: 0, status: 'pending' },
      { id: 'ai_analysis', name: 'AI分析', progress: 0, status: 'pending' },
      { id: 'auto_tagging', name: '自動標記', progress: 0, status: 'pending' }
    ],
    isProcessing: false
  });
  const [workState, setWorkState] = useState<WorkState>({
    collaborationStarted: false,
    selectedTemplate: null,
    sentStatus: null
  });
  const isMobile = useIsMobile();

  // Background processing function
  const startBackgroundProcessing = async () => {
    const steps = ['separation', 'ai_analysis', 'auto_tagging'];
    
    for (const stepId of steps) {
      await simulateStep(stepId);
    }
    
    // Mark processing as complete
    setArchiveState(prev => ({
      ...prev,
      processingComplete: true,
      lastCompletedSubState: 'processing',
      isProcessing: false
    }));
  };

  const simulateStep = (stepId: string) => {
    return new Promise<void>((resolve) => {
      // Different durations for different steps to simulate realistic processing
      let baseDuration = 5000; // Base 5 seconds
      const stepName = archiveState.processingSteps.find(step => step.id === stepId)?.name || '';
      
      if (stepName.includes('音軌分離')) baseDuration = 4000; // 4-7 seconds for audio separation
      if (stepName.includes('AI分析')) baseDuration = 8000; // 8-12 seconds for AI analysis  
      if (stepName.includes('自動標記')) baseDuration = 3000; // 3-5 seconds for auto-tagging
      
      const duration = baseDuration + Math.random() * 3000;
      
      // Start processing
      setArchiveState(prev => ({
        ...prev,
        processingSteps: prev.processingSteps.map(step => 
          step.id === stepId ? { ...step, status: 'processing' } : step
        )
      }));

      const interval = setInterval(() => {
        setArchiveState(prev => ({
          ...prev,
          processingSteps: prev.processingSteps.map(step => {
            if (step.id === stepId) {
              const newProgress = Math.min(step.progress + 5, 100); // 5% increments for smoother animation
              const newStatus = newProgress >= 100 ? 'completed' as const : 'processing' as const;
              
              if (newProgress >= 100) {
                clearInterval(interval);
                resolve();
              }
              
              return { ...step, progress: newProgress, status: newStatus };
            }
            return step;
          })
        }));
      }, duration / 20); // Update every 5% instead of 10%
    });
  };

  const handleAnalyze = (desc: string) => {
    setTalkState(prev => ({
      ...prev,
      description: desc,
      currentSubState: 'analyzing',
      lastCompletedSubState: 'input'
    }));
    setCurrentState('talk-analyzing');
  };

  const handleReanalyze = (desc: string) => {
    setTalkState(prev => ({
      ...prev,
      description: desc,
      currentSubState: 'analyzing'
    }));
    setCurrentState('talk-analyzing');
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setTalkState(prev => ({
      ...prev,
      analysisData: data,
      currentSubState: 'metadata-edit',
      lastCompletedSubState: 'metadata-edit'
    }));
    setCurrentState('archive-upload');
  };

  const handleEditAnalysis = () => {
    setCurrentState('talk-metadata-edit');
  };

  const handleFileUpload = (files: File[], metadata: any) => {
    setArchiveState(prev => ({
      ...prev,
      uploadedFiles: files,
      metadata: metadata,
      lastCompletedSubState: 'upload',
      isProcessing: true,
      processingSteps: prev.processingSteps.map(step => 
        step.id === 'upload' ? { ...step, status: 'completed', progress: 100 } : step
      )
    }));
    // Skip archive-processing and go directly to collaboration
    setCurrentState('work-collaboration');
    // Start background processing
    startBackgroundProcessing();
  };

  const handleProcessingComplete = () => {
    setArchiveState(prev => ({
      ...prev,
      processingComplete: true,
      lastCompletedSubState: 'processing'
    }));
    setCurrentState('work-collaboration');
  };

  const handleTemplateSelect = (template: any) => {
    setWorkState(prev => ({
      ...prev,
      selectedTemplate: template,
      collaborationStarted: true
    }));
    console.log('Template selected:', template);
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      // Go to the last completed sub-state of talk
      const lastState = talkState.lastCompletedSubState;
      if (lastState === 'metadata-edit') {
        setCurrentState('talk-metadata-edit');
      } else if (lastState === 'analyzing') {
        setCurrentState('talk-analyzing');
      } else {
        setCurrentState('talk-input');
      }
    } else if (stepNumber === 2 && talkState.analysisData) {
      setCurrentState('archive-upload');
    } else if (stepNumber === 3 && archiveState.uploadedFiles.length > 0) {
      setCurrentState('work-collaboration');
    }
  };

  const handleArrowClick = (direction: 'next' | 'prev', fromStep: number) => {
    if (direction === 'next') {
      if (fromStep === 1 && talkState.analysisData) {
        setCurrentState('archive-upload');
      } else if (fromStep === 2 && archiveState.uploadedFiles.length > 0) {
        setCurrentState('work-collaboration');
      }
    } else if (direction === 'prev') {
      if (fromStep === 2) {
        setCurrentState('talk-metadata-edit');
      } else if (fromStep === 3) {
        setCurrentState('archive-upload');
      }
    }
  };

  const getCurrentStep = () => {
    switch (currentState) {
      case 'talk-input':
      case 'talk-analyzing':
      case 'talk-metadata-edit':
        return 1;
      case 'archive-upload':
      case 'archive-processing':
        return 2;
      case 'work-collaboration':
        return 3;
      default:
        return 1;
    }
  };

  // Generate completed steps summaries
  const getCompletedSteps = () => {
    const completed = [];
    
    if (talkState.analysisData && talkState.lastCompletedSubState === 'metadata-edit') {
      completed.push({
        step: 1,
        title: "述說",
        summary: `${talkState.analysisData.location} - ${talkState.analysisData.type}${talkState.analysisData.people ? ` (${talkState.analysisData.people.length}人)` : ''}`,
        isCompleted: true
      });
    }
    
    // Show archive processing status
    if (archiveState.uploadedFiles.length > 0) {
      if (archiveState.isProcessing) {
        // Get current processing step
        const processingStep = archiveState.processingSteps.find(step => step.status === 'processing');
        const completedSteps = archiveState.processingSteps.filter(step => step.status === 'completed').length;
        
        completed.push({
          step: 2,
          title: "入檔",
          summary: processingStep 
            ? `處理中... ${processingStep.name} ${processingStep.progress}%` 
            : `處理中... ${completedSteps}/${archiveState.processingSteps.length} 完成`,
          isCompleted: false,
          isProcessing: true,
          processingSteps: archiveState.processingSteps
        });
      } else if (archiveState.processingComplete) {
        completed.push({
          step: 2,
          title: "入檔",
          summary: `${archiveState.uploadedFiles.length}個檔案已處理完成`,
          isCompleted: true
        });
      }
    }
    
    if (workState.sentStatus) {
      completed.push({
        step: 3,
        title: "工作",
        summary: `已發送通知 - ${workState.sentStatus.timestamp} (${workState.sentStatus.recipientCount}位協作者)`,
        isCompleted: true
      });
    }
    
    return completed;
  };

  // Get current active step content
  const getCurrentStepContent = () => {
    switch (currentState) {
      case 'talk-input':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">分享今天拍了什麼</h2>
            <DescriptionInput 
              onAnalyze={handleAnalyze}
              isAnalyzing={false}
              showExamples={true}
              showProgressBar={false}
            />
          </div>
        );
      
      case 'talk-analyzing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">分享今天拍了什麼</h2>
            <AnalysisResult
              description={talkState.description}
              onConfirm={handleAnalysisComplete}
              onEdit={handleEditAnalysis}
              onReanalyze={handleReanalyze}
            />
          </div>
        );
      
      case 'talk-metadata-edit':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">編輯詳細資料</h2>
            {talkState.analysisData && (
              <AnalysisResult
                description={talkState.description}
                onConfirm={handleAnalysisComplete}
                onEdit={handleEditAnalysis}
                onReanalyze={handleReanalyze}
              />
            )}
          </div>
        );
      
      case 'archive-upload':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">入檔</h2>
            {talkState.analysisData && (
              <FileUpload
                expectedFileType={talkState.analysisData.template}
                onUpload={handleFileUpload}
                initialData={{
                  files: archiveState.uploadedFiles,
                  metadata: archiveState.metadata,
                  selectedDate: archiveState.metadata?.date,
                  customDate: archiveState.metadata?.customDate,
                  audioTracks: archiveState.metadata?.audioTracks
                }}
              />
            )}
          </div>
        );
      
      
      case 'work-collaboration':
        return (
          <div className="space-y-6">
            {talkState.analysisData && (
              <CollaborationMemo
                analysisData={talkState.analysisData}
                archiveData={archiveState}
                onContinue={(sentStatus?: SentStatus) => {
                  if (sentStatus) {
                    setWorkState(prev => ({ ...prev, sentStatus }));
                  }
                  console.log('Collaboration completed');
                }}
              />
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/10 to-secondary/20">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="max-w-7xl mx-auto">
          <WorkflowProgressBar 
            currentStep={getCurrentStep()} 
            completedSteps={getCompletedSteps()}
            onEditStep={handleStepClick}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="min-h-[60vh]">
          {getCurrentStepContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
