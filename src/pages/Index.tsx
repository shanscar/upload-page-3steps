import { useState, useEffect } from "react";
import { WorkflowProgressBar } from "@/components/WorkflowProgressBar";
import { DescriptionInput } from "@/components/DescriptionInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { FileUpload } from "@/components/FileUpload";
import { CollaborationMemo } from "@/components/CollaborationMemo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProject } from "@/contexts/ProjectContext";
import { useProjectWorkflow } from "@/hooks/useProjectWorkflow";
import { useProcessingStatus } from "@/hooks/useProcessingStatus";
import { useMetadataAnalysis } from "@/hooks/useMetadataAnalysis";
import { useFileUpload } from "@/hooks/useFileUpload";
import { AnalysisData } from "@/types/project";

interface SentStatus {
  timestamp: string;
  recipientCount: number;
}

const Index = () => {
  const [sentStatus, setSentStatus] = useState<SentStatus | null>(null);
  
  const isMobile = useIsMobile();
  const { state: projectState, createProject, updateMetadata } = useProject();
  const workflow = useProjectWorkflow();
  const { processingJobs, isProcessing } = useProcessingStatus();
  const { analyzeDescription, analysisData, isAnalyzing } = useMetadataAnalysis();
  const { uploadFiles, isUploading } = useFileUpload();

  // Transition to analysis step when analysis data is available
  useEffect(() => {
    if (analysisData && workflow.workflowState.currentStep === 'description') {
      workflow.setAnalysisData(analysisData);
    }
  }, [analysisData, workflow]);

  // Create a project and update metadata when analysis is completed
  useEffect(() => {
    const handleProjectAndMetadata = async () => {
      if (analysisData && !projectState.currentProject) {
        try {
          // 先創建專案
          const newProject = await createProject(
            `${analysisData.location} - ${analysisData.type}`,
            `錄製於 ${analysisData.date}，參與人員：${analysisData.people.join(', ')}`
          );

          // 等待專案創建完成後更新元數據
          if (newProject) {
            const metadata = {
              location: analysisData.location,
              content_type: analysisData.type,
              people: analysisData.people,
              template_type: analysisData.template,
              recording_date: new Date().toISOString().split('T')[0]
            };
            await updateMetadata(metadata);
          }
        } catch (error) {
          console.error('項目創建或元數據更新失敗:', error);
        }
      }
    };

    handleProjectAndMetadata();
  }, [analysisData, projectState.currentProject, createProject, updateMetadata]);

  const handleAnalyze = async (description: string) => {
    await analyzeDescription(description);
    workflow.setDescription(description);
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    workflow.setAnalysisData(data);
    workflow.nextStep(); // Move to upload step
  };

  const handleFileUpload = async (files: File[], metadata: any) => {
    const success = await uploadFiles({
      files,
      selectedDate: metadata.date,
      customDate: metadata.customDate,
      audioTracks: metadata.audioTracks || []
    });
    
    if (success) {
      workflow.setUploadComplete();
      workflow.nextStep(); // Move to collaboration step
      
      // Scroll to top when entering collaboration step
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1 && analysisData) {
      workflow.setDescription(workflow.workflowState.description);
    } else if (stepNumber === 2 && analysisData) {
      // Go to upload step if analysis is complete
      workflow.nextStep();
    } else if (stepNumber === 3 && projectState.currentProject?.files.length) {
      // Go to collaboration step if files are uploaded
      workflow.nextStep();
      workflow.nextStep();
    }
  };

  const getCurrentStep = () => {
    switch (workflow.workflowState.currentStep) {
      case 'description':
        return 1;
      case 'analysis':
        return 1;
      case 'upload':
        return 2;
      case 'collaboration':
        return 3;
      case 'completed':
        return 3;
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
        title: "述說",
        summary: `${analysisData.location} - ${analysisData.type}${analysisData.people ? ` (${analysisData.people.length}人)` : ''}`,
        isCompleted: true
      });
    }

    // Show archive processing status
    if (projectState.currentProject?.files.length > 0) {
      if (isProcessing) {
        // Get current processing step
        const processingJob = processingJobs.find(job => job.status === 'processing');
        const completedJobs = processingJobs.filter(job => job.status === 'completed').length;
        completed.push({
          step: 2,
          title: "入檔",
          summary: processingJob ? `處理中... ${processingJob.job_type} ${processingJob.progress_percentage}%` : `處理中... ${completedJobs}/${processingJobs.length} 完成`,
          isCompleted: false,
          isProcessing: true,
          processingSteps: processingJobs.map(job => ({
            id: job.id,
            name: job.job_type,
            progress: job.progress_percentage,
            status: job.status
          }))
        });
      } else if (processingJobs.every(job => job.status === 'completed')) {
        completed.push({
          step: 2,
          title: "入檔",
          summary: `${projectState.currentProject.files.length}個檔案已處理完成`,
          isCompleted: true
        });
      }
    }
    
    if (sentStatus) {
      completed.push({
        step: 3,
        title: "開工",
        summary: `已發送通知 - ${sentStatus.timestamp} (${sentStatus.recipientCount}位協作者)`,
        isCompleted: true
      });
    }
    
    return completed;
  };

  // Get current active step content
  const getCurrentStepContent = () => {
    switch (workflow.workflowState.currentStep) {
      case 'description':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">分享：今天拍了什麼？</h2>
            <DescriptionInput 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing} 
              showExamples={true} 
              showProgressBar={true}
              initialValue={workflow.workflowState.description} 
            />
          </div>
        );
        
      case 'analysis':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">分享：今天拍了什麼？</h2>
            {analysisData && (
              <AnalysisResult 
                description={workflow.workflowState.description} 
                onConfirm={handleAnalysisComplete} 
                onEdit={() => workflow.previousStep()} 
                onReanalyze={handleAnalyze} 
              />
            )}
          </div>
        );
        
      case 'upload':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">入檔</h2>
            {analysisData && (
              <FileUpload 
                expectedFileType={analysisData.template} 
                onUpload={handleFileUpload}
                initialData={{
                  files: [],
                  metadata: {
                    date: projectState.currentProject?.metadata?.recording_date || "today",
                    customDate: undefined
                  },
                  selectedDate: projectState.currentProject?.metadata?.recording_date || "today",
                  audioTracks: projectState.currentProject?.audioTracks.map(track => ({
                    id: parseInt(track.id),
                    language: track.language,
                    isSelected: track.is_selected,
                    channelType: track.channel_type as 'mono' | 'stereo',
                    volumeLevel: 75 // Default volume level
                  })) || []
                }} 
              />
            )}
          </div>
        );
        
      case 'collaboration':
        return (
          <div className="space-y-6">
            {analysisData && (
              <CollaborationMemo 
                analysisData={{
                  template: analysisData.template,
                  focus: `處理 ${analysisData.type} 相關內容`,
                  teamRoles: [
                    {
                      role: '剪輯師',
                      tasks: ['音軌處理', '內容剪輯']
                    },
                    {
                      role: '記者',
                      tasks: ['內容整理', '背景核查']
                    }
                  ]
                }}
                archiveData={{
                  metadata: {
                    date: projectState.currentProject?.metadata?.recording_date,
                    customDate: undefined
                  },
                  uploadedFiles: []
                }}
                onContinue={(status?: SentStatus) => {
                  if (status) {
                    setSentStatus(status);
                    workflow.nextStep(); // Move to completed
                  }
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