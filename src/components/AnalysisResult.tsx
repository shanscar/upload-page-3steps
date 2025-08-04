import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DescriptionInput } from "./DescriptionInput";

interface AnalysisData {
  location: string;
  type: string;
  people: string[];
  date: string;
  template: string;
}

interface AnalysisResultProps {
  description: string;
  onConfirm: (data: AnalysisData) => void;
  onEdit: () => void;
  onReanalyze: (description: string) => void;
}

export const AnalysisResult = ({ description, onConfirm, onEdit, onReanalyze }: AnalysisResultProps) => {
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const metadataCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate AI analysis progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShowResult(true);
            // Mock analysis result based on description
            const mockData = generateMockAnalysis(description);
            setAnalysisData(mockData);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [description]);

  // Auto-focus the metadata card when analysis completes
  useEffect(() => {
    if (showResult && metadataCardRef.current) {
      setTimeout(() => {
        metadataCardRef.current?.focus();
      }, 500);
    }
  }, [showResult]);

  const generateMockAnalysis = (desc: string): AnalysisData => {
    // Simple keyword matching for demo
    let location = "未知地點";
    let type = "一般訪問";
    let people = ["相關人士"];
    let template = "標準採訪流程";

    if (desc.includes("政府總部") || desc.includes("財政預算")) {
      location = "政府總部西翼";
      type = "新聞類 > 政府記者會";
      people = ["財政司司長", "在場記者"];
      template = "政府記者會標準流程";
    } else if (desc.includes("中大") || desc.includes("教授")) {
      location = "中文大學";
      type = "學術類 > 專家訪問";
      people = ["陳教授", "研究團隊"];
      template = "學術專訪流程";
    } else if (desc.includes("突發") || desc.includes("意外")) {
      location = "旺角街頭";
      type = "突發新聞 > 現場報導";
      people = ["目擊者", "警方"];
      template = "突發新聞標準流程";
    } else if (desc.includes("直播室") || desc.includes("醫生")) {
      location = "S5直播室";
      type = "醫療類 > 專家訪問";
      people = ["李醫生", "主持人"];
      template = "醫療專訪流程";
    }

    return {
      location,
      type,
      people,
      date: "今天 (2025-08-03)",
      template
    };
  };

  if (!showResult) {
    return (
      <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="text-3xl mb-4">🤖</div>
        <h3 className="text-xl font-medium mb-4">AI正在理解...</h3>
        <Progress value={progress} className="w-full max-w-md mx-auto h-3" />
        <div className="text-sm text-primary mt-3 font-medium">{progress}%</div>
      </div>
      </div>
    );
  }

  if (!analysisData) return null;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Input available for re-analysis after completion */}
      <DescriptionInput 
        onAnalyze={onReanalyze}
        isAnalyzing={false}
        showExamples={false}
        showProgressBar={false}
        initialValue={description}
      />
      
      <div className="text-center">
        <div className="text-3xl mb-2">✨</div>
        <h3 className="text-xl font-medium text-success mb-1">分析完成！</h3>
        <p className="text-sm text-muted-foreground">檢查一下對不對，或在上面修改描述重新分析</p>
      </div>

      <Card 
        ref={metadataCardRef}
        tabIndex={0}
        className="p-6 border-success/30 bg-success/5 animate-pulse-glow focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 focus:shadow-large transition-all duration-300"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <div>
              <span className="text-sm text-muted-foreground">地點：</span>
              <span className="font-medium">{analysisData.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">📰</span>
            <div>
              <span className="text-sm text-muted-foreground">類型：</span>
              <span className="font-medium">{analysisData.type}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">👥</span>
            <div>
              <span className="text-sm text-muted-foreground">相關人物：</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {analysisData.people.map((person, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">📅</span>
            <div>
              <span className="text-sm text-muted-foreground">日期：</span>
              <span className="font-medium">{analysisData.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-lg">🎯</span>
            <div>
              <span className="text-sm text-muted-foreground">建議範本：</span>
              <span className="font-medium text-primary">{analysisData.template}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button 
          onClick={() => onConfirm(analysisData)}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-large hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 px-8 py-3 shadow-medium"
        >
          ✓ 正確
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={onEdit}
          className="hover:scale-105 transition-transform px-8 py-3"
        >
          ✏️ 修改
        </Button>
      </div>
    </div>
  );
};