import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format, subDays } from "date-fns";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<AnalysisData | null>(null);
  const [newPersonName, setNewPersonName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const metadataCardRef = useRef<HTMLDivElement>(null);

  const getQuickDateOptions = () => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const dayBeforeYesterday = subDays(today, 2);
    
    return [
      { label: "今天", date: today },
      { label: "昨天", date: yesterday },
      { label: "前天", date: dayBeforeYesterday }
    ];
  };

  const formatDateForDisplay = (date: Date) => {
    return format(date, "yyyy-MM-dd (EEEE)", { locale: undefined });
  };

  const handleEditMode = () => {
    if (analysisData) {
      setEditData({ ...analysisData });
      setSelectedDate(new Date());
      setIsEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    if (editData) {
      setAnalysisData(editData);
      onConfirm(editData);
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditMode(false);
    setNewPersonName("");
  };

  const addPerson = () => {
    if (newPersonName.trim() && editData) {
      setEditData({
        ...editData,
        people: [...editData.people, newPersonName.trim()]
      });
      setNewPersonName("");
    }
  };

  const removePerson = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        people: editData.people.filter((_, i) => i !== index)
      });
    }
  };

  const handlePersonKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPerson();
    }
  };

  const handleQuickDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (editData) {
      setEditData({
        ...editData,
        date: formatDateForDisplay(date)
      });
    }
  };

  const handleCalendarDateSelect = (date: Date | undefined) => {
    if (date && editData) {
      setSelectedDate(date);
      setEditData({
        ...editData,
        date: formatDateForDisplay(date)
      });
    }
  };

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
        <h3 className="text-xl font-medium text-success">✨ 分析完成！請檢查或修改描述重新分析</h3>
      </div>

      <Card 
        ref={metadataCardRef}
        tabIndex={0}
        className={cn(
          "p-6 focus:outline-none focus:ring-2 focus:shadow-large transition-all duration-300",
          isEditMode 
            ? "border-2 border-[hsl(var(--focus-highlight))] bg-[hsl(var(--focus-highlight)_/_0.1)] focus:ring-[hsl(var(--focus-highlight))] focus:border-[hsl(var(--focus-highlight))]"
            : "border-[hsl(var(--focus-highlight))] bg-[hsl(var(--focus-highlight)_/_0.3)] focus:ring-[hsl(var(--focus-highlight))] focus:border-[hsl(var(--focus-highlight))]"
        )}
      >
        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-center gap-3">
            <span className="text-lg">📍</span>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">地點：</span>
              {isEditMode ? (
                <Input
                  value={editData?.location || ""}
                  onChange={(e) => setEditData(prev => prev ? { ...prev, location: e.target.value } : null)}
                  className="mt-1"
                  placeholder="輸入地點"
                />
              ) : (
                <span className="font-medium">{analysisData.location}</span>
              )}
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-3">
            <span className="text-lg">📰</span>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">類型：</span>
              {isEditMode ? (
                <Select 
                  value={editData?.type || ""} 
                  onValueChange={(value) => setEditData(prev => prev ? { ...prev, type: value } : null)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="新聞類 > 政府記者會">新聞類 &gt; 政府記者會</SelectItem>
                    <SelectItem value="學術類 > 專家訪問">學術類 &gt; 專家訪問</SelectItem>
                    <SelectItem value="突發新聞 > 現場報導">突發新聞 &gt; 現場報導</SelectItem>
                    <SelectItem value="醫療類 > 專家訪問">醫療類 &gt; 專家訪問</SelectItem>
                    <SelectItem value="一般訪問">一般訪問</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-medium">{analysisData.type}</span>
              )}
            </div>
          </div>

          {/* People */}
          <div className="flex items-start gap-3">
            <span className="text-lg">👥</span>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">相關人物：</span>
              {isEditMode ? (
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {editData?.people.map((person, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                      >
                        <span>{person}</span>
                        <button
                          onClick={() => removePerson(index)}
                          className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    onKeyPress={handlePersonKeyPress}
                    placeholder="輸入人名後按 Enter 添加"
                    className="text-sm"
                  />
                </div>
              ) : (
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
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <span className="text-lg">📅</span>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">日期：</span>
              {isEditMode ? (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {getQuickDateOptions().map((option) => (
                      <Button
                        key={option.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickDateSelect(option.date)}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? formatDateForDisplay(selectedDate) : "自選日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleCalendarDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <span className="font-medium">{analysisData.date}</span>
              )}
            </div>
          </div>

          {/* Template */}
          <div className="flex items-center gap-3">
            <span className="text-lg">🎯</span>
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">建議範本：</span>
              {isEditMode ? (
                <Select 
                  value={editData?.template || ""} 
                  onValueChange={(value) => setEditData(prev => prev ? { ...prev, template: value } : null)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="選擇範本" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="政府記者會標準流程">政府記者會標準流程</SelectItem>
                    <SelectItem value="學術專訪流程">學術專訪流程</SelectItem>
                    <SelectItem value="突發新聞標準流程">突發新聞標準流程</SelectItem>
                    <SelectItem value="醫療專訪流程">醫療專訪流程</SelectItem>
                    <SelectItem value="標準採訪流程">標準採訪流程</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-medium text-primary">{analysisData.template}</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        {isEditMode ? (
          <>
            <Button 
              onClick={handleSaveEdit}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-large hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 px-8 py-3 shadow-medium"
            >
              ✓ 保存
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleCancelEdit}
              className="hover:scale-105 transition-transform px-8 py-3"
            >
              ✕ 取消
            </Button>
          </>
        ) : (
          <>
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
              onClick={handleEditMode}
              className="hover:scale-105 transition-transform px-8 py-3"
            >
              ✏️ 修改
            </Button>
          </>
        )}
      </div>
    </div>
  );
};