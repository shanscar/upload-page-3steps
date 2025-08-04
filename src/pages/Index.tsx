import { useState } from "react";
import { WorkflowStep } from "@/components/WorkflowStep";
import { DescriptionInput } from "@/components/DescriptionInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { FileUpload } from "@/components/FileUpload";
import { UploadProgress } from "@/components/UploadProgress";
import { ProgramTypeTemplates } from "@/components/ProgramTypeTemplates";

type WorkflowState = 'input' | 'analyzing' | 'upload' | 'processing' | 'collaboration';

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

  const handleAnalyze = (desc: string) => {
    setDescription(desc);
    setCurrentState('analyzing');
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setCurrentState('upload');
  };

  const handleEditAnalysis = () => {
    setCurrentState('input');
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
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              📱 影片協作工作流程
            </h1>
            <p className="text-muted-foreground">
              說話 → 放片 → 開工
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Step 1: Description Input */}
          <WorkflowStep
            step={1}
            title="說說今天拍了什麼"
            isActive={currentState === 'input' || currentState === 'analyzing'}
            isCompleted={getCurrentStep() > 1}
          >
            {currentState === 'input' && (
              <DescriptionInput 
                onAnalyze={handleAnalyze}
                isAnalyzing={false}
              />
            )}
            {currentState === 'analyzing' && (
              <AnalysisResult
                description={description}
                onConfirm={handleAnalysisComplete}
                onEdit={handleEditAnalysis}
              />
            )}
            {getCurrentStep() > 1 && analysisData && (
              <div className="text-sm text-muted-foreground">
                ✓ 已分析：{analysisData.type} - {analysisData.location}
              </div>
            )}
          </WorkflowStep>

          {/* Step 2: File Upload */}
          <WorkflowStep
            step={2}
            title="放入影片"
            isActive={currentState === 'upload'}
            isCompleted={getCurrentStep() > 2}
          >
            {currentState === 'upload' && analysisData && (
              <FileUpload
                expectedFileType={analysisData.template}
                onUpload={handleFileUpload}
              />
            )}
            {getCurrentStep() > 2 && uploadedFiles.length > 0 && (
              <div className="text-sm text-muted-foreground">
                ✓ 已上載：{uploadedFiles[0].name}
              </div>
            )}
          </WorkflowStep>

          {/* Step 3: Processing & Collaboration */}
          <WorkflowStep
            step={3}
            title="開始協作"
            isActive={currentState === 'processing' || currentState === 'collaboration'}
            isCompleted={false}
          >
            {currentState === 'processing' && analysisData && (
              <UploadProgress
                files={uploadedFiles}
                metadata={uploadMetadata}
                analysisData={analysisData}
                onComplete={handleProcessingComplete}
              />
            )}
            {currentState === 'collaboration' && (
              <div className="space-y-6">
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <h3 className="text-lg font-medium text-success mb-2">
                    處理完成！團隊已收到通知
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    影片已自動分配給相關同事，可以開始協作了
                  </p>
                </div>
                
                <ProgramTypeTemplates
                  onSelectTemplate={handleTemplateSelect}
                />
              </div>
            )}
          </WorkflowStep>
        </div>
      </div>
    </div>
  );
};

export default Index;
