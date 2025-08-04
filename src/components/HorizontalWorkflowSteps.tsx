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
  return (
    <div className={cn("grid grid-cols-3 gap-6", className)}>
      {steps.map((stepData, index) => (
        <div key={stepData.step} className="flex items-start">
          <Card
            className={cn(
              "flex-1 p-6 transition-all duration-300 border-2 min-h-[300px]",
              stepData.isActive && "border-primary bg-primary/5 shadow-medium",
              stepData.isCompleted && "border-success bg-success/5",
              !stepData.isActive && !stepData.isCompleted && "border-border bg-muted/20 opacity-60"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-soft",
                  stepData.isActive && "bg-primary text-primary-foreground",
                  stepData.isCompleted && "bg-success text-success-foreground",
                  !stepData.isActive && !stepData.isCompleted && "bg-muted text-muted-foreground"
                )}
              >
                {stepData.isCompleted ? "✓" : stepData.step}
              </div>
              <h2
                className={cn(
                  "text-lg font-semibold transition-colors",
                  stepData.isActive && "text-foreground",
                  stepData.isCompleted && "text-foreground",
                  !stepData.isActive && !stepData.isCompleted && "text-muted-foreground"
                )}
              >
                {stepData.title}
              </h2>
            </div>
            <div
              className={cn(
                "transition-opacity duration-300",
                !stepData.isActive && !stepData.isCompleted && "opacity-50"
              )}
            >
              {stepData.children}
            </div>
          </Card>
          
          {/* Arrow between steps */}
          {index < steps.length - 1 && (
            <div className="flex items-center justify-center w-8 mt-16">
              <ChevronRight
                className={cn(
                  "w-6 h-6 transition-colors",
                  stepData.isCompleted ? "text-success" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};