import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WorkflowProgressBarProps {
  currentStep: number;
  className?: string;
}

const steps = [
  { id: 1, emoji: "💬", label: "說話" },
  { id: 2, emoji: "🎬", label: "放片" },
  { id: 3, emoji: "🚀", label: "開工" }
];

export const WorkflowProgressBar = ({ currentStep, className }: WorkflowProgressBarProps) => {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center transition-all duration-500",
                isActive || isCompleted ? "opacity-100" : "opacity-50"
              )}
            >
              <div
                className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 transition-all duration-500 border-2",
                  isCompleted 
                    ? "bg-success text-success-foreground border-success shadow-large scale-105" 
                    : isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-medium animate-pulse-glow scale-110"
                    : "bg-muted text-muted-foreground border-border shadow-soft"
                )}
              >
                {isCompleted ? "✓" : step.emoji}
              </div>
              <span
                className={cn(
                  "text-base font-semibold transition-colors duration-300",
                  isCompleted 
                    ? "text-success" 
                    : isActive
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-4 bg-gradient-to-r from-muted to-secondary shadow-medium rounded-full overflow-hidden"
        />
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-primary rounded-full transition-all duration-700 ease-out shadow-soft"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};