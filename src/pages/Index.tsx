import { useState } from "react";
import { WorkflowStep } from "@/components/WorkflowStep";
import { WorkflowProgressBar } from "@/components/WorkflowProgressBar";
import { HorizontalWorkflowSteps } from "@/components/HorizontalWorkflowSteps";
import { DescriptionInput } from "@/components/DescriptionInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { FileUpload } from "@/components/FileUpload";
import { UploadProgress } from "@/components/UploadProgress";
import { ProgramTypeTemplates } from "@/components/ProgramTypeTemplates";
import { useIsMobile } from "@/hooks/use-mobile";

type WorkflowState = 'input' | 'analyzing' | 'upload' | 'processing' | 'collaboration' | 'viewDetails';

interface AnalysisData {
  location: string;
  type: string;
  people: string[];
  date: string;
  template: string;
}

const Index = () => {
  const [currentState, setCurrentState] = useState<WorkflowState>('input');
  const [description, setDescription] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadMetadata, setUploadMetadata] = useState<any>(null);
  const [viewingStep, setViewingStep] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const handleAnalyze = (desc: string) => {
    setDescription(desc);
    setCurrentState('analyzing');
  };

  const handleReanalyze = (desc: string) => {
    setDescription(desc);
    // Stay on analyzing state but trigger re-analysis
    setCurrentState('analyzing');
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setCurrentState('upload');
  };

  const handleEditAnalysis = () => {
    setCurrentState('input');
  };

  const handleEditFromView = () => {
    setViewingStep(null);
    setCurrentState('analyzing');
  };

  const handleFileUpload = (files: File[], metadata: any) => {
    setUploadedFiles(files);
    setUploadMetadata(metadata);
    setCurrentState('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentState('collaboration');
  };

  const handleTemplateSelect = (template: any) => {
    // 完成流程
    console.log('Template selected:', template);
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    if (stepNumber === 1) {
      setCurrentState('input');
    } else if (stepNumber === 2 && analysisData) {
      setCurrentState('upload');
    } else if (stepNumber === 3 && uploadedFiles.length > 0) {
      setCurrentState('processing');
    }
  };

  const handleViewDetails = (stepNumber: number) => {
    setViewingStep(stepNumber);
    setCurrentState('viewDetails');
  };

  const handleBackFromView = () => {
    setViewingStep(null);
    // Return to appropriate state based on progress
    if (uploadedFiles.length > 0) {
      setCurrentState('processing');
    } else if (analysisData) {
      setCurrentState('upload');
    } else {
      setCurrentState('input');
    }
  };

  const handleArrowClick = (direction: 'next' | 'prev', fromStep: number) => {
    if (direction === 'next') {
      if (fromStep === 1 && analysisData) {
        setCurrentState('upload');
      } else if (fromStep === 2 && uploadedFiles.length > 0) {
        setCurrentState('processing');
      }
    } else if (direction === 'prev') {
      if (fromStep === 2) {
        setCurrentState('input');
      } else if (fromStep === 3) {
        setCurrentState('upload');
      }
    }
  };

  const getCurrentStep = () => {
    switch (currentState) {
      case 'input':
      case 'analyzing':
        return 1;
      case 'upload':
        return 2;
      case 'processing':
      case 'collaboration':
        return 3;
      case 'viewDetails':
        return viewingStep || 1;
      default:
        return 1;
    }
  };

  // Generate completed steps summaries
  const getCompletedSteps = () => {
    const completed = [];
    
    if (analysisData) {
      completed.push({
        step: 1,
        title: "說說今天拍了什麼",
        summary: `${analysisData.location} - ${analysisData.type}${analysisData.people ? ` (${analysisData.people.length}人)` : ''}`
      });
    }
    
    if (uploadedFiles.length > 0) {
      completed.push({
        step: 2,
        title: "放入影片",
        summary: `${uploadedFiles.length}個檔案已上傳`
      });
    }
    
    return completed;
  };

  // Get current active step content
  const getCurrentStepContent = () => {
    switch (currentState) {
      case 'input':
      case 'analyzing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">說說今天拍了什麼</h2>
            {currentState === 'input' && (
              <DescriptionInput 
                onAnalyze={handleAnalyze}
                isAnalyzing={false}
                showExamples={true}
                showProgressBar={false}
              />
            )}
            {currentState === 'analyzing' && (
              <AnalysisResult
                description={description}
                onConfirm={handleAnalysisComplete}
                onEdit={handleEditAnalysis}
                onReanalyze={handleReanalyze}
              />
            )}
          </div>
        );
      
      case 'upload':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">放入影片</h2>
            {analysisData && (
              <FileUpload
                expectedFileType={analysisData.template}
                onUpload={handleFileUpload}
              />
            )}
          </div>
        );
      
      case 'processing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">處理中</h2>
            {analysisData && (
              <UploadProgress
                files={uploadedFiles}
                metadata={uploadMetadata}
                analysisData={analysisData}
                onComplete={handleProcessingComplete}
              />
            )}
          </div>
        );
      
      case 'collaboration':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-6">
              <div className="text-2xl">✅</div>
              <h2 className="text-2xl font-semibold text-success">處理完成！團隊已收到通知</h2>
              <p className="text-muted-foreground">影片已自動分配給相關同事，可以開始協作了</p>
            </div>
            <ProgramTypeTemplates
              onSelectTemplate={handleTemplateSelect}
            />
          </div>
        );

      case 'viewDetails':
        if (viewingStep === 1 && analysisData) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">詳細資訊</h2>
              <AnalysisResult
                description={description}
                onConfirm={handleAnalysisComplete}
                onEdit={handleEditFromView}
                onReanalyze={handleReanalyze}
                viewOnly={true}
                onBack={handleBackFromView}
                initialData={analysisData}
              />
            </div>
          );
        }
        return null;
      
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
            onViewStep={handleViewDetails}
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
