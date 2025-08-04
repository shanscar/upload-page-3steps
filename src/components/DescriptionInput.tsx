import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface DescriptionInputProps {
  onAnalyze: (description: string) => void;
  isAnalyzing: boolean;
  showExamples?: boolean;
  showProgressBar?: boolean;
  initialValue?: string;
}

const EXAMPLES = [
  "今日政府總部採訪財政司司長談預算案",
  "今日下午2點在政府總部大樓記者會廳，採訪財政司司長陳茂波講解新一年度預算案重點，現場約30名記者出席",
  "突發：旺角亞皆老街交通意外，涉及兩車相撞，現場有輕傷人士送院",
  "在香港電台廣播大樓錄音室專訪瑪麗醫院腫瘤科李醫生，討論肺腺癌最新治療方案及預防方法"
];

export const DescriptionInput = ({ 
  onAnalyze, 
  isAnalyzing, 
  showExamples = true, 
  showProgressBar = false,
  initialValue = ""
}: DescriptionInputProps) => {
  const [description, setDescription] = useState(initialValue);
  const [showHint, setShowHint] = useState(false);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Set initial value when prop changes
  useEffect(() => {
    setDescription(initialValue);
  }, [initialValue]);

  // Auto focus on mount
  useEffect(() => {
    if (textareaRef.current && !isAnalyzing) {
      textareaRef.current.focus();
    }
  }, [isAnalyzing]);

  // Progress bar effect when analyzing
  useEffect(() => {
    if (showProgressBar && isAnalyzing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [showProgressBar, isAnalyzing]);

  useEffect(() => {
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    if (description.length > 0) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 1500);
      setTypingTimer(timer);
    } else {
      setShowHint(false);
    }

    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [description]);

  const handleExampleClick = (example: string) => {
    setDescription(example);
    setShowHint(true);
    // Focus and position cursor at end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(example.length, example.length);
      }
    }, 0);
  };

  const handleAnalyze = () => {
    if (description.trim()) {
      onAnalyze(description.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleAnalyze();
    }
    // Ctrl+Enter or Cmd+Enter for newline (default behavior)
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-3xl mb-3">💬</div>
        <h3 className="text-xl font-medium text-foreground mb-2">
          講講今日的拍攝情況
        </h3>
        <p className="text-sm text-muted-foreground">
          越詳細越好：時間、地點、人物、事件
        </p>
      </div>

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：今日下午2點在政府總部大樓記者會廳，採訪財政司司長陳茂波講解新一年度預算案重點..."
          className={cn(
            "min-h-[140px] text-xl p-6 pr-20 transition-all duration-300 border-2 shadow-sm",
            "bg-card focus:shadow-medium focus:border-primary focus:scale-[1.02]",
            "caret-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
            description && "border-primary/40 bg-primary/5 shadow-md"
          )}
          disabled={isAnalyzing}
        />
        
        {/* Integrated button at bottom-right corner */}
        {showHint && description && !isAnalyzing && !showProgressBar && (
          <Button
            onClick={handleAnalyze}
            size="sm"
            className="absolute bottom-3 right-3 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm px-4 py-3 shadow-sm animate-fade-in"
          >
            <Bot className="w-4 h-4 mr-1" />
            Enter
          </Button>
        )}
      </div>

      {/* Show progress bar when analyzing */}
      {showProgressBar && isAnalyzing && description && (
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">⚡ AI 分析中...</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-secondary"
            />
          </div>
        </div>
      )}

      {/* Show examples only when showExamples is true */}
      {showExamples && (
        <Card className="p-6 bg-accent/50 border-2 border-accent shadow-md">
          <div className="text-sm text-foreground mb-4 font-medium">💡 例子：</div>
          <div className="grid gap-3">
            {EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className={cn(
                  "text-left p-4 rounded-lg text-sm transition-all duration-200 border",
                  "bg-card hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  "border-border hover:border-accent-foreground/20",
                  description === example && "bg-primary/10 text-primary-text border-primary/40 shadow-sm"
                )}
                disabled={isAnalyzing}
              >
                「{example}」
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};