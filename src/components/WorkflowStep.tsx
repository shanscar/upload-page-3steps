import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  step: number;
  title: string;
  isActive?: boolean;
  isCompleted?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const WorkflowStep = ({ 
  step, 
  title, 
  isActive = false, 
  isCompleted = false, 
  children, 
  className 
}: WorkflowStepProps) => {
  return (
    <Card className={cn(
      "p-6 transition-all duration-300 border-2",
      isActive && "border-primary bg-primary/5 shadow-medium",
      isCompleted && "border-success bg-success/5",
      !isActive && !isCompleted && "border-border bg-muted/20",
      className
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-soft",
          isActive && "bg-primary text-primary-foreground",
          isCompleted && "bg-success text-success-foreground",
          !isActive && !isCompleted && "bg-muted text-muted-foreground"
        )}>
          {isCompleted ? "✓" : step}
        </div>
        <h2 className={cn(
          "text-xl font-semibold transition-colors",
          isActive && "text-foreground",
          isCompleted && "text-foreground",
          !isActive && !isCompleted && "text-muted-foreground"
        )}>
          {title}
        </h2>
      </div>
      <div className={cn(
        "transition-opacity duration-300",
        !isActive && !isCompleted && "opacity-50"
      )}>
        {children}
      </div>
    </Card>
  );
};