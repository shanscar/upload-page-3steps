import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Step {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
}

interface HorizontalWorkflowStepsProps {
  steps: Step[];
  className?: string;
}

export const HorizontalWorkflowSteps = ({ steps, className }: HorizontalWorkflowStepsProps) => {
  // Determine grid layout based on active step
  const getGridCols = () => {
    const activeIndex = steps.findIndex(step => step.isActive);
    if (activeIndex === 0) return "grid-cols-[1.5fr_auto_1fr_auto_1fr]"; // First step active
    if (activeIndex === 1) return "grid-cols-[1fr_auto_2fr_auto_1fr]"; // Second step active  
    if (activeIndex === 2) return "grid-cols-[1fr_auto_1fr_auto_1.5fr]"; // Third step active
    return "grid-cols-[1fr_auto_1fr_auto_1fr]"; // Default equal spacing
  };

  return (
    <div className={cn("grid gap-4 items-start", getGridCols(), className)}>
      {steps.map((stepData, index) => (
        <>
          <Card
            key={stepData.step}
            className={cn(
              "p-6 transition-all duration-500 border-2 h-full",
              stepData.isActive && "border-primary bg-primary/5 shadow-lg scale-[1.02]",
              stepData.isCompleted && "border-success bg-success/5 hover:bg-success/10 cursor-pointer",
              !stepData.isActive && !stepData.isCompleted && "border-border bg-muted/20 opacity-60"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-soft",
                  stepData.isActive && "bg-primary text-primary-foreground scale-110",
                  stepData.isCompleted && "bg-success text-success-foreground",
                  !stepData.isActive && !stepData.isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {stepData.isCompleted ? "✓" : stepData.step}
              </div>
              <h2
                className={cn(
                  "font-semibold transition-colors",
                  stepData.isActive && "text-foreground text-lg",
                  stepData.isCompleted && "text-foreground text-base",
                  !stepData.isActive && !stepData.isCompleted && "text-muted-foreground text-sm"
                )}
              >
                {stepData.title}
              </h2>
            </div>
            <div
              className={cn(
                "transition-all duration-300",
                stepData.isActive && "opacity-100",
                stepData.isCompleted && "opacity-80",
                !stepData.isActive && !stepData.isCompleted && "opacity-50"
              )}
            >
              {stepData.children}
            </div>
          </Card>
          
          {/* Arrow between steps */}
          {index < steps.length - 1 && (
            <div className="flex items-center justify-center pt-12">
              <ChevronRight
                className={cn(
                  "w-5 h-5 transition-colors",
                  stepData.isCompleted ? "text-success" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </>
      ))}
    </div>
  );
};