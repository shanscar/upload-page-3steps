import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit3 } from "lucide-react";

interface CompactStepSummaryProps {
  step: number;
  title: string;
  summary: string;
  isCompleted: boolean;
  onEdit: () => void;
  className?: string;
}

export const CompactStepSummary = ({ 
  step, 
  title, 
  summary, 
  isCompleted, 
  onEdit, 
  className 
}: CompactStepSummaryProps) => {
  if (!isCompleted) return null;

  return (
    <Card className={cn(
      "p-3 border transition-all duration-300 hover:shadow-medium cursor-pointer",
      "border-success/30 bg-success/5 hover:bg-success/10",
      className
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-full bg-success text-success-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
            ✓
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-success truncate">{title}</h4>
            <p className="text-xs text-muted-foreground truncate">{summary}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="h-8 w-8 p-0 text-success hover:text-success-foreground hover:bg-success/20 flex-shrink-0"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};