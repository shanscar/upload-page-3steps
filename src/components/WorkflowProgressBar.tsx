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
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center transition-all duration-300",
              currentStep >= step.id ? "opacity-100" : "opacity-40"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all duration-300 shadow-soft",
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground scale-110"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.emoji}
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-muted shadow-soft"
      />
    </div>
  );
};