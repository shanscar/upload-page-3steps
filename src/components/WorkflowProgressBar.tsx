import { Progress } from "@/components/ui/progress";
import { CompactStepSummary } from "@/components/CompactStepSummary";
import { cn } from "@/lib/utils";

interface ProcessStep {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface CompletedStepData {
  step: number;
  title: string;
  summary: string;
  isCompleted: boolean;
  isProcessing?: boolean;
  processingSteps?: ProcessStep[];
}

interface WorkflowProgressBarProps {
  currentStep: number;
  completedSteps?: CompletedStepData[];
  onEditStep?: (stepNumber: number) => void;
  className?: string;
}

const steps = [
  { id: 1, emoji: "🗣️", label: "述說" },
  { id: 2, emoji: "📁", label: "入檔" },
  { id: 3, emoji: "🚀", label: "開工" }
];

export const WorkflowProgressBar = ({ currentStep, completedSteps = [], onEditStep, className }: WorkflowProgressBarProps) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Compact Progress Bar */}
      <div className="flex items-center gap-4 mb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 transition-all duration-500",
                isActive || isCompleted ? "opacity-100" : "opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2",
                  isCompleted 
                    ? "bg-success text-success-foreground border-success" 
                    : isActive
                    ? "bg-primary text-primary-foreground border-primary animate-pulse-glow shadow-md"
                    : "bg-background text-foreground border-border shadow-sm"
                )}
              >
                {isCompleted ? "✓" : step.emoji}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold transition-colors duration-300 hidden sm:inline",
                  isCompleted 
                    ? "text-success" 
                    : isActive
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-border mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Completed Steps Summaries */}
      {completedSteps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {completedSteps.map((stepData) => (
            <CompactStepSummary
              key={stepData.step}
              step={stepData.step}
              title={stepData.title}
              summary={stepData.summary}
              isCompleted={stepData.isCompleted}
              isProcessing={stepData.isProcessing}
              processingSteps={stepData.processingSteps}
              onEdit={() => onEditStep?.(stepData.step)}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-3 bg-gradient-to-r from-muted to-secondary shadow-soft rounded-full overflow-hidden"
        />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};