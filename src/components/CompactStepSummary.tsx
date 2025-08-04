import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit3, MapPin, FileText, Users, Calendar, Settings } from "lucide-react";

interface AnalysisData {
  location: string;
  type: string;
  people: string[];
  date: string;
  template: string;
}

interface CompactStepSummaryProps {
  step: number;
  title: string;
  analysisData?: AnalysisData;
  summary?: string;
  isCompleted: boolean;
  onEdit: () => void;
  className?: string;
}

export const CompactStepSummary = ({ 
  step, 
  title, 
  analysisData,
  summary, 
  isCompleted, 
  onEdit, 
  className 
}: CompactStepSummaryProps) => {
  if (!isCompleted) return null;

  // For step 1, show detailed metadata if available
  const showMetadata = step === 1 && analysisData;

  return (
    <Card className={cn(
      "p-4 border transition-all duration-300 hover:shadow-medium cursor-pointer",
      "border-completed/30 bg-completed/5 hover:bg-completed/10",
      className
    )}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-full bg-completed text-completed-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <h4 className="text-sm font-semibold text-completed truncate">{title}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-8 w-8 p-0 text-completed hover:text-completed-foreground hover:bg-completed/20 flex-shrink-0"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>

        {/* Content */}
        {showMetadata ? (
          <div className="grid grid-cols-1 gap-2 text-xs">
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{analysisData.location}</span>
            </div>
            
            {/* Type */}
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{analysisData.type}</span>
            </div>
            
            {/* People */}
            {analysisData.people && analysisData.people.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-wrap gap-1 min-w-0 flex-1">
                  {analysisData.people.slice(0, 3).map((person, index) => (
                    <span 
                      key={index}
                      className="inline-block px-1.5 py-0.5 bg-secondary/50 text-secondary-foreground rounded text-xs truncate"
                    >
                      {person}
                    </span>
                  ))}
                  {analysisData.people.length > 3 && (
                    <span className="text-muted-foreground">+{analysisData.people.length - 3}</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{analysisData.date}</span>
            </div>
            
            {/* Template */}
            <div className="flex items-center gap-2">
              <Settings className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">{analysisData.template}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{summary}</p>
        )}
      </div>
    </Card>
  );
};