import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DescriptionInputProps {
  onAnalyze: (description: string) => void;
  isAnalyzing: boolean;
}

const EXAMPLES = [
  "今日去政府總部採訪財政預算案記者會",
  "在中大訪問陳教授談AI發展",
  "突發：旺角交通意外現場報導",
  "在S5直播室訪問李醫生談胸腺癌"
];

export const DescriptionInput = ({ onAnalyze, isAnalyzing }: DescriptionInputProps) => {
  const [description, setDescription] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);

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
  };

  const handleAnalyze = () => {
    if (description.trim()) {
      onAnalyze(description.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl mb-3">💬</div>
        <h3 className="text-xl font-medium text-foreground mb-2">
          今天拍了什麼？
        </h3>
        <p className="text-sm text-muted-foreground">
          一句話就夠了
        </p>
      </div>

      <div className="relative">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：今日去政府總部採訪財政預算案..."
          className={cn(
            "min-h-[140px] text-lg p-6 transition-all duration-300 border-2",
            "focus:shadow-soft focus:border-primary focus:scale-[1.02]",
            description && "border-primary/40 bg-primary/5"
          )}
          disabled={isAnalyzing}
        />
        
        {showHint && !isAnalyzing && (
          <div className="absolute -bottom-10 left-0 text-sm text-primary animate-fade-in font-medium">
            ⚡ 按Ctrl+Enter 或點下面按鈕
          </div>
        )}
      </div>

      {showHint && description && !isAnalyzing && (
        <div className="flex justify-center animate-fade-in">
          <Button 
            onClick={handleAnalyze}
            size="lg"
            className="bg-gradient-primary hover:scale-105 transition-transform duration-200 text-lg px-8 py-6"
          >
            ⚡ AI分析
          </Button>
        </div>
      )}

      <Card className="p-4 bg-muted/30">
        <div className="text-sm text-muted-foreground mb-3">💡 例子：</div>
        <div className="grid gap-2">
          {EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className={cn(
                "text-left p-3 rounded-lg text-sm transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                description === example && "bg-primary/10 text-primary border border-primary/20"
              )}
              disabled={isAnalyzing}
            >
              「{example}」
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};