import { useState } from "react";
import { WorkflowStep } from "@/components/WorkflowStep";
import { DescriptionInput } from "@/components/DescriptionInput";
import { AnalysisResult } from "@/components/AnalysisResult";
import { FileUpload } from "@/components/FileUpload";
import { UploadProgress } from "@/components/UploadProgress";
import { ProgramTypeTemplates } from "@/components/ProgramTypeTemplates";

type WorkflowState = 'input' | 'analyzing' | 'result' | 'upload' | 'processing' | 'templates' | 'completed';

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
    setCurrentState('templates');
  };

  const handleTemplateSelect = (template: any) => {
    setCurrentState('completed');
  };

  const getCurrentStep = () => {
    switch (currentState) {
      case 'input':
      case 'analyzing':
      case 'result':
        return 1;
      case 'upload':
        return 2;
      case 'processing':
        return 3;
      case 'templates':
      case 'completed':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-card">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              📺 影片處理工作流程系統
            </h1>
            <p className="text-muted-foreground">
              智能分析 • 自動處理 • 團隊協作
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
            title="今日做了什麼 - 完整設計"
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
            title="拖拽影片檔案"
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

          {/* Step 3: Processing */}
          <WorkflowStep
            step={3}
            title="確認上載 & 處理"
            isActive={currentState === 'processing'}
            isCompleted={getCurrentStep() > 3}
          >
            {currentState === 'processing' && analysisData && (
              <UploadProgress
                files={uploadedFiles}
                metadata={uploadMetadata}
                analysisData={analysisData}
                onComplete={handleProcessingComplete}
              />
            )}
            {getCurrentStep() > 3 && (
              <div className="text-sm text-muted-foreground">
                ✓ 處理完成，已生成分享連結並通知團隊
              </div>
            )}
          </WorkflowStep>

          {/* Step 4: Program Templates */}
          <WorkflowStep
            step={4}
            title="工作分配範本"
            isActive={currentState === 'templates'}
            isCompleted={currentState === 'completed'}
          >
            {currentState === 'templates' && (
              <ProgramTypeTemplates
                onSelectTemplate={handleTemplateSelect}
              />
            )}
            {currentState === 'completed' && (
              <div className="text-center p-8">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-success mb-2">
                  工作流程設置完成！
                </h3>
                <p className="text-muted-foreground">
                  系統已為你的團隊安排好所有工作分配，可以開始協作了。
                </p>
              </div>
            )}
          </WorkflowStep>
        </div>
      </div>
    </div>
  );
};

export default Index;
