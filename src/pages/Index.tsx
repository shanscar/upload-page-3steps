import { useState } from "react";
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

interface ArchiveState {
  uploadedFiles: File[];
  metadata: any;
  processingComplete: boolean;
  lastCompletedSubState: 'upload' | 'processing' | null;
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
    lastCompletedSubState: null
  });
  const [workState, setWorkState] = useState<WorkState>({
    collaborationStarted: false,
    selectedTemplate: null,
    sentStatus: null
  });
  const isMobile = useIsMobile();

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
      lastCompletedSubState: 'upload'
    }));
    setCurrentState('archive-processing');
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
        title: "說話",
        summary: `${talkState.analysisData.location} - ${talkState.analysisData.type}${talkState.analysisData.people ? ` (${talkState.analysisData.people.length}人)` : ''}`
      });
    }
    
    if (archiveState.processingComplete && archiveState.lastCompletedSubState === 'processing') {
      completed.push({
        step: 2,
        title: "入檔",
        summary: `${archiveState.uploadedFiles.length}個檔案已處理完成`
      });
    }
    
    if (workState.sentStatus) {
      completed.push({
        step: 3,
        title: "工作",
        summary: `已發送通知 - ${workState.sentStatus.timestamp} (${workState.sentStatus.recipientCount}位協作者)`
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
            <h2 className="text-2xl font-semibold text-foreground">說說今天拍了什麼</h2>
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
            <h2 className="text-2xl font-semibold text-foreground">說說今天拍了什麼</h2>
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
      
      case 'archive-processing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">處理中</h2>
            {talkState.analysisData && (
              <UploadProgress
                files={archiveState.uploadedFiles}
                metadata={archiveState.metadata}
                analysisData={talkState.analysisData}
                onComplete={handleProcessingComplete}
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
