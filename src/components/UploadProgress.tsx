import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadProgressProps {
  files: File[];
  metadata: any;
  analysisData: any;
  onComplete: () => void;
}

interface ProcessStep {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const UploadProgress = ({ files, metadata, analysisData, onComplete }: UploadProgressProps) => {
  const [steps, setSteps] = useState<ProcessStep[]>([
    { id: 'upload', name: '檔案上載', progress: 0, status: 'processing' },
    { id: 'separation', name: '音軌分離', progress: 0, status: 'pending' },
    { id: 'ai_analysis', name: 'AI分析', progress: 0, status: 'pending' },
    { id: 'auto_tagging', name: '自動標記', progress: 0, status: 'pending' }
  ]);

  const [shareLink, setShareLink] = useState("");
  const [assignedTeam, setAssignedTeam] = useState<string[]>([]);

  useEffect(() => {
    // Simulate upload and processing steps
    const processSteps = async () => {
      // Step 1: File upload
      await simulateProgress('upload', 100, 3500);
      
      // Step 2: Audio separation
      await simulateProgress('separation', 100, 5500);
      
      // Step 3: AI analysis
      await simulateProgress('ai_analysis', 100, 4500);
      
      // Step 4: Auto tagging
      await simulateProgress('auto_tagging', 100, 3500);
      
      // Generate mock results
      setShareLink("https://workflow.rthk.hk/project/abc123");
      setAssignedTeam(["張編輯", "李記者", "王設計師"]);
      
      setTimeout(onComplete, 1000);
    };

    processSteps();
  }, [onComplete]);

  const simulateProgress = (stepId: string, targetProgress: number, duration: number) => {
    return new Promise<void>((resolve) => {
      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, status: 'processing' as const } : step
      ));

      const interval = setInterval(() => {
        setSteps(prev => prev.map(step => {
          if (step.id === stepId) {
            const newProgress = Math.min(step.progress + 5, targetProgress);
            const newStatus = newProgress >= targetProgress ? 'completed' as const : 'processing' as const;
            
            if (newProgress >= targetProgress) {
              clearInterval(interval);
              resolve();
            }
            
            return { ...step, progress: newProgress, status: newStatus };
          }
          return step;
        }));
      }, duration / 20);
    });
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const getStepIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed': return '✓';
      case 'processing': return '🔄';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const getStepColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-primary';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const allCompleted = steps.every(step => step.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-2xl mb-2">✅</div>
        <h3 className="text-lg font-medium text-success">上載完成！</h3>
      </div>

      {/* Processing Steps */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">📊 處理進度：</h4>
        <div className="space-y-4">
          {steps.map(step => (
            <div key={step.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn("text-lg", getStepColor(step.status))}>
                    {getStepIcon(step.status)}
                  </span>
                  <span className={cn(
                    "font-medium",
                    step.status === 'completed' && "text-success",
                    step.status === 'processing' && "text-primary"
                  )}>
                    {step.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {step.progress}%
                </span>
              </div>
              <Progress 
                value={step.progress} 
                className={cn(
                  "h-2",
                  step.status === 'completed' && "[&>div]:bg-success",
                  step.status === 'processing' && "[&>div]:bg-primary"
                )}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* File Summary */}
      <Card className="p-6 bg-muted/30">
        <h4 className="font-medium mb-4">📋 上載預覽：</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span>📁</span>
            <span>檔案：{files[0]?.name} ({Math.round((files[0]?.size || 0) / (1024 * 1024))}MB)</span>
          </div>
          <div className="flex items-center gap-3">
            <span>🎵</span>
            <span>音軌：{metadata.audioTracks?.length || 0}個音軌，{metadata.languages?.join('、') || '未知語言'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>📅</span>
            <span>日期：2025年8月3日</span>
          </div>
          <div className="flex items-center gap-3">
            <span>📰</span>
            <span>分類：{analysisData.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>👥</span>
            <span>人物：{analysisData.people.join('、')}</span>
          </div>
        </div>
      </Card>

      {/* Results */}
      {allCompleted && (
        <div className="space-y-4 animate-fade-in">
          <Card className="p-6 border-success/30 bg-success/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span>🔗</span>
                <span className="text-sm text-muted-foreground">分享連結：</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyShareLink}
                  className="text-xs"
                >
                  已複製到剪貼板
                </Button>
              </div>
              
              <div className="flex items-start gap-3">
                <span>📧</span>
                <div>
                  <span className="text-sm text-muted-foreground">工作分配：</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {assignedTeam.map((member, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                      >
                        @ {member}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">通知已發送給相關同事</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};