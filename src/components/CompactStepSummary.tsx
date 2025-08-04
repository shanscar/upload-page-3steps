import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Edit3, Loader2 } from "lucide-react";

interface ProcessStep {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface CompactStepSummaryProps {
  step: number;
  title: string;
  summary: string;
  isCompleted: boolean;
  onEdit: () => void;
  className?: string;
  isProcessing?: boolean;
  processingSteps?: ProcessStep[];
}

export const CompactStepSummary = ({ 
  step, 
  title, 
  summary, 
  isCompleted, 
  onEdit, 
  className,
  isProcessing = false,
  processingSteps = []
}: CompactStepSummaryProps) => {
  if (!isCompleted && !isProcessing) return null;

  const handleCardClick = () => {
    onEdit();
  };

  const currentProcessingStep = processingSteps.find(step => step.status === 'processing');
  const completedProcessingSteps = processingSteps.filter(step => step.status === 'completed').length;
  const overallProgress = processingSteps.length > 0 ? (completedProcessingSteps / processingSteps.length) * 100 : 0;

  return (
    <Card 
      onClick={handleCardClick}
      className={cn(
        "p-3 border transition-all duration-300 hover:shadow-medium cursor-pointer",
        isCompleted ? "border-completed/30 bg-completed/5 hover:bg-completed/10" : "border-primary/30 bg-primary/5 hover:bg-primary/10",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn(
            "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0",
            isCompleted ? "bg-completed text-completed-foreground" : "bg-primary text-primary-foreground"
          )}>
            {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : "✓"}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className={cn(
              "text-sm font-semibold truncate",
              isCompleted ? "text-completed" : "text-primary"
            )}>
              {title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">{summary}</p>
            {isProcessing && processingSteps.length > 0 && (
              <div className="space-y-1">
                <Progress 
                  value={overallProgress} 
                  className="h-1.5"
                />
                <div className="text-xs text-muted-foreground">
                  {currentProcessingStep ? `${currentProcessingStep.name}...` : `${completedProcessingSteps}/${processingSteps.length} 完成`}
                </div>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className={cn(
            "h-8 w-8 p-0 flex-shrink-0",
            isCompleted 
              ? "text-completed hover:text-completed-foreground hover:bg-completed/20"
              : "text-primary hover:text-primary-foreground hover:bg-primary/20"
          )}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};