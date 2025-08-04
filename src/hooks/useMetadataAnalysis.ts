import { useState, useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectMetadata } from '@/types/project';

interface AnalysisData {
  location: string;
  type: string;
  people: string[];
  date: string;
  template: string;
}

interface MetadataAnalysisHook {
  isAnalyzing: boolean;
  analysisData: AnalysisData | null;
  error: string | null;
  analyzeDescription: (description: string) => Promise<AnalysisData | null>;
  updateAnalysis: (data: AnalysisData) => Promise<void>;
  clearAnalysis: () => void;
}

export function useMetadataAnalysis(): MetadataAnalysisHook {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updateMetadata } = useProject();

  const generateMockAnalysis = (desc: string): AnalysisData => {
    // Simple keyword matching for demo
    let location = "未知地點";
    let type = "一般訪問";
    let people = ["相關人士"];
    let template = "🎨 文化藝術／人物專訪類";

    if (desc.includes("政府總部") || desc.includes("財政預算")) {
      location = "政府總部西翼";
      type = "新聞類 > 政府記者會";
      people = ["財政司司長", "在場記者"];
      template = "🗞️ 時事新聞／評論類";
    } else if (desc.includes("中大") || desc.includes("教授")) {
      location = "中文大學";
      type = "學術類 > 專家訪問";
      people = ["陳教授", "研究團隊"];
      template = "📚 專題／紀實／教育類";
    } else if (desc.includes("突發") || desc.includes("意外")) {
      location = "旺角街頭";
      type = "突發新聞 > 現場報導";
      people = ["目擊者", "警方"];
      template = "🗞️ 時事新聞／評論類";
    } else if (desc.includes("直播室") || desc.includes("醫生")) {
      location = "S5直播室";
      type = "醫療類 > 專家訪問";
      people = ["李醫生", "主持人"];
      template = "🏡 生活資訊／服務類";
    }

    return {
      location,
      type,
      people,
      date: "今天 (2025-08-03)",
      template
    };
  };

  const analyzeDescription = useCallback(async (description: string): Promise<AnalysisData | null> => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const analysis = generateMockAnalysis(description);
      setAnalysisData(analysis);

      // Save to project metadata
      const metadata: Partial<ProjectMetadata> = {
        location: analysis.location,
        content_type: analysis.type,
        people: analysis.people,
        template_type: analysis.template,
        recording_date: new Date().toISOString().split('T')[0]
      };

      await updateMetadata(metadata);

      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI 分析失敗';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [updateMetadata]);

  const updateAnalysis = useCallback(async (data: AnalysisData): Promise<void> => {
    try {
      setAnalysisData(data);

      // Update project metadata
      const metadata: Partial<ProjectMetadata> = {
        location: data.location,
        content_type: data.type,
        people: data.people,
        template_type: data.template,
        recording_date: new Date().toISOString().split('T')[0]
      };

      await updateMetadata(metadata);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新分析失敗';
      setError(errorMessage);
    }
  }, [updateMetadata]);

  const clearAnalysis = useCallback(() => {
    setAnalysisData(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysisData,
    error,
    analyzeDescription,
    updateAnalysis,
    clearAnalysis,
  };
}