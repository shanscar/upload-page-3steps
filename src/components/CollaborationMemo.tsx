import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Share, Users, Pin, Paperclip, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MemoDetailModal } from "./MemoDetailModal";

// Program Templates Data
const PROGRAM_TEMPLATES = [
  {
    id: "news",
    title: "🗞️ 時事新聞評論",
    color: "from-yellow-100 to-yellow-200 border-yellow-300",
    titleColor: "text-yellow-900",
    textColor: "text-yellow-800",
    focus: "時間索引、文字稿、社媒素材、關鍵字標籤",
    team: ["📹 剪輯師", "✍️ 時事記者", "🎨 視覺設計", "📱 社媒專員"],
    detailedTeam: [
      {
        role: "剪輯師",
        emoji: "📹",
        tasks: [
          { task: "建立時間索引標記系統", timeEstimate: "2-3小時", priority: "high" as const },
          { task: "剪輯新聞重點片段", timeEstimate: "4-5小時", priority: "high" as const },
          { task: "製作開場和結尾動畫", timeEstimate: "1-2小時", priority: "medium" as const },
          { task: "音效和背景音樂調整", timeEstimate: "1小時", priority: "low" as const }
        ]
      },
      {
        role: "時事記者",
        emoji: "✍️",
        tasks: [
          { task: "撰寫完整文字稿", timeEstimate: "3-4小時", priority: "high" as const },
          { task: "事實查核和資料來源確認", timeEstimate: "2-3小時", priority: "high" as const },
          { task: "準備相關背景資料", timeEstimate: "1-2小時", priority: "medium" as const },
          { task: "撰寫社媒推廣文案", timeEstimate: "30分鐘", priority: "low" as const }
        ]
      },
      {
        role: "視覺設計師",
        emoji: "🎨",
        tasks: [
          { task: "設計新聞圖表和資訊圖", timeEstimate: "2-3小時", priority: "high" as const },
          { task: "製作縮圖和封面設計", timeEstimate: "1-2小時", priority: "high" as const },
          { task: "準備視覺素材庫", timeEstimate: "1小時", priority: "medium" as const },
          { task: "品牌一致性檢查", timeEstimate: "30分鐘", priority: "low" as const }
        ]
      },
      {
        role: "社媒專員",
        emoji: "📱",
        tasks: [
          { task: "規劃多平台發布策略", timeEstimate: "1小時", priority: "high" as const },
          { task: "製作關鍵字標籤列表", timeEstimate: "30分鐘", priority: "high" as const },
          { task: "安排發布時程", timeEstimate: "30分鐘", priority: "medium" as const },
          { task: "準備回應模板", timeEstimate: "20分鐘", priority: "low" as const }
        ]
      }
    ]
  },
  {
    id: "culture",
    title: "🎨 文化藝術專訪",
    color: "from-pink-100 to-pink-200 border-pink-300",
    titleColor: "text-pink-900",
    textColor: "text-pink-800",
    focus: "作品介紹、訪談重點、創作賞析、藝術背景",
    team: ["🎵 剪輯師", "✍️ 文化記者", "🎨 設計師", "📱 社媒專員"],
    detailedTeam: [
      {
        role: "剪輯師",
        emoji: "🎵",
        tasks: [
          { task: "剪輯訪談精華片段", timeEstimate: "3-4小時", priority: "high" as const },
          { task: "整合作品展示鏡頭", timeEstimate: "2-3小時", priority: "high" as const },
          { task: "調色和畫面美化", timeEstimate: "2小時", priority: "medium" as const },
          { task: "添加藝術作品特寫", timeEstimate: "1小時", priority: "medium" as const }
        ]
      },
      {
        role: "文化記者",
        emoji: "✍️",
        tasks: [
          { task: "準備專業訪談問題", timeEstimate: "2小時", priority: "high" as const },
          { task: "研究藝術家背景", timeEstimate: "3小時", priority: "high" as const },
          { task: "撰寫作品賞析文案", timeEstimate: "2-3小時", priority: "medium" as const },
          { task: "整理藝術術語解釋", timeEstimate: "1小時", priority: "low" as const }
        ]
      }
    ]
  },
  {
    id: "music",
    title: "🎵 音樂娛樂榜",
    color: "from-purple-100 to-purple-200 border-purple-300",
    titleColor: "text-purple-900",
    textColor: "text-purple-800",
    focus: "榜單介紹、歌手互動、MV精華、流行趨勢",
    team: ["🎵 剪輯師", "✍️ 音樂記者", "🎨 設計師", "📱 社媒專員"]
  },
  {
    id: "lifestyle",
    title: "🏡 生活資訊服務",
    color: "from-green-100 to-green-200 border-green-300",
    titleColor: "text-green-900",
    textColor: "text-green-800",
    focus: "專家貼士、實用建議、健康資訊、理財指南",
    team: ["🎵 剪輯師", "✍️ 生活記者", "🎨 設計師", "📱 社媒專員"]
  },
  {
    id: "travel",
    title: "🌏 旅遊國際視野",
    color: "from-blue-100 to-blue-200 border-blue-300",
    titleColor: "text-blue-900",
    textColor: "text-blue-800",
    focus: "目的地介紹、旅遊體驗、國際觀察、異地文化",
    team: ["🎵 剪輯師", "✍️ 旅遊記者", "🎨 設計師", "📱 社媒專員"]
  },
  {
    id: "opera",
    title: "🎭 戲曲傳統文化",
    color: "from-orange-100 to-orange-200 border-orange-300",
    titleColor: "text-orange-900",
    textColor: "text-orange-800",
    focus: "經典演出、曲藝故事、文化傳承、戲曲名句",
    team: ["🎵 剪輯師", "✍️ 文化記者", "🎨 設計師", "📱 社媒專員"]
  },
  {
    id: "games",
    title: "🎲 互動娛樂遊戲",
    color: "from-indigo-100 to-indigo-200 border-indigo-300",
    titleColor: "text-indigo-900",
    textColor: "text-indigo-800",
    focus: "遊戲環節、互動討論、趣味短片、娛樂精華",
    team: ["🎵 剪輯師", "✍️ 娛樂記者", "🎨 設計師", "📱 社媒專員"]
  },
  {
    id: "documentary",
    title: "📚 專題紀實教育",
    color: "from-teal-100 to-teal-200 border-teal-300",
    titleColor: "text-teal-900",
    textColor: "text-teal-800",
    focus: "故事開端、人物描寫、深度分析、教育信息",
    team: ["🎵 剪輯師", "✍️ 專題記者", "🎨 設計師", "📱 社媒專員"]
  }
];

interface CollaborationMemoProps {
  analysisData?: {
    template?: string;
    focus?: string;
    teamRoles?: Array<{
      role: string;
      tasks: string[];
    }>;
  };
  archiveData?: {
    metadata?: {
      date?: string;
      customDate?: Date;
    };
    uploadedFiles?: File[];
  };
  onContinue: () => void;
}

export const CollaborationMemo = ({ analysisData, archiveData, onContinue }: CollaborationMemoProps) => {
  const [colleagueEmail, setColleagueEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROGRAM_TEMPLATES[0] | null>(null);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const projectUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast({
        title: "連結已複製",
        description: "項目連結已複製到剪貼板",
      });
    } catch (err) {
      toast({
        title: "複製失敗",
        description: "無法複製連結，請手動複製",
        variant: "destructive",
      });
    }
  };

  const handleShareToColleague = () => {
    if (!colleagueEmail) {
      toast({
        title: "請輸入同事郵箱",
        description: "請先輸入要分享的同事郵箱地址",
        variant: "destructive",
      });
      return;
    }

    const selectedTemplateNames = selectedTemplates.map(id => 
      PROGRAM_TEMPLATES.find(t => t.id === id)?.title
    ).join('、');

    toast({
      title: "分享成功",
      description: `已將選中的流程範本 (${selectedTemplateNames || '無'}) 發送給 ${colleagueEmail}`,
    });
    setColleagueEmail("");
    setShareMessage("");
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTemplates(PROGRAM_TEMPLATES.map(t => t.id));
  };

  const handleClearAll = () => {
    setSelectedTemplates([]);
  };

  const handleMemoDoubleClick = (template: typeof PROGRAM_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setDetailModalOpen(true);
  };

  const handleModalToggleSelection = () => {
    if (selectedTemplate) {
      handleTemplateToggle(selectedTemplate.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Memo Header */}
      <div className="relative mb-8">
        <Pin className="absolute -top-3 -right-3 text-slate-400 transform rotate-45 w-8 h-8 z-10" />
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Paperclip className="w-6 h-6 text-amber-600 transform -rotate-12" />
                <h1 className="text-3xl font-bold text-amber-900 font-handwriting">
                  工作協作備忘錄
                </h1>
              </div>
              <div className="text-sm text-amber-700 font-mono bg-amber-100 px-3 py-1 rounded">
                {new Date().toLocaleDateString('zh-TW')}
              </div>
            </div>
            
            <p className="text-amber-800 text-lg font-handwriting mb-4">
              📝 重新選擇或調整處理流程，打造最適合的工作範本
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button 
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                >
                  全選
                </Button>
                <Button 
                  onClick={handleClearAll}
                  variant="outline"
                  size="sm"
                  className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                >
                  清除
                </Button>
              </div>
              <div className="text-sm text-amber-700">
                已選擇 {selectedTemplates.length} / {PROGRAM_TEMPLATES.length} 個流程
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Process Options - Memo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {PROGRAM_TEMPLATES.map((template, index) => {
          const isSelected = selectedTemplates.includes(template.id);
          const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
          
          return (
            <div key={template.id} className="relative">
              {/* Pin for each memo */}
              <Pin className={cn(
                "absolute -top-2 -right-1 w-5 h-5 transform rotate-45 z-10",
                isSelected ? "text-red-500" : "text-slate-400"
              )} />
              
              {/* Memo Card */}
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg p-4 h-48 group",
                  rotation,
                  `bg-gradient-to-br ${template.color}`,
                  isSelected && "ring-2 ring-amber-400 shadow-lg scale-105 -rotate-0"
                )}
                onClick={() => handleTemplateToggle(template.id)}
                onDoubleClick={() => handleMemoDoubleClick(template)}
              >
                {/* Double-click hint */}
                <div className="absolute top-1 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3 text-slate-500" />
                </div>
                <div className="h-full flex flex-col">
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 left-2">
                      <CheckCircle className="w-5 h-5 text-green-600 bg-white rounded-full" />
                    </div>
                  )}
                  
                  {/* Title */}
                  <h3 className={cn(
                    "text-sm font-bold font-handwriting mb-2 leading-tight",
                    template.titleColor
                  )}>
                    {template.title}
                  </h3>
                  
                  {/* Focus areas */}
                  <div className="flex-1">
                    <p className={cn("text-xs font-medium mb-1", template.textColor)}>
                      重點處理：
                    </p>
                    <p className={cn("text-xs leading-tight mb-2", template.textColor)}>
                      {template.focus}
                    </p>
                  </div>
                  
                  {/* Team */}
                  <div>
                    <p className={cn("text-xs font-medium mb-1", template.textColor)}>
                      建議分工：
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.team.slice(0, 2).map((member, idx) => (
                        <span key={idx} className={cn("text-xs", template.textColor)}>
                          {member.split(' ')[0]}
                        </span>
                      ))}
                      {template.team.length > 2 && (
                        <span className={cn("text-xs", template.textColor)}>
                          +{template.team.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Double-click instruction */}
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={cn("text-xs", template.textColor)}>
                      雙擊查看詳情
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Collaboration Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg mb-6">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900 font-handwriting">
              協作分享
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Copy Link */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">複製項目連結</h4>
              <p className="text-sm text-blue-700 mb-3">分享選中的流程範本給相關同事</p>
              <Button 
                onClick={handleCopyLink}
                variant="outline" 
                className="w-full bg-white border-blue-300 text-blue-800 hover:bg-blue-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                複製連結
              </Button>
            </div>

            {/* Share to Colleague */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">@ 分享給同事</h4>
              <div className="space-y-2">
                <Input
                  placeholder="輸入同事郵箱"
                  value={colleagueEmail}
                  onChange={(e) => setColleagueEmail(e.target.value)}
                  className="bg-white border-blue-300"
                />
                <Input
                  placeholder="添加備註訊息 (可選)"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  className="bg-white border-blue-300"
                />
                <Button 
                  onClick={handleShareToColleague}
                  variant="outline"
                  className="w-full bg-white border-blue-300 text-blue-800 hover:bg-blue-100"
                  disabled={selectedTemplates.length === 0}
                >
                  <Share className="w-4 h-4 mr-2" />
                  發送範本 ({selectedTemplates.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Footer */}
      <div className="flex justify-end">
        <Button 
          onClick={onContinue}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
          disabled={selectedTemplates.length === 0}
        >
          完成協作設定 ({selectedTemplates.length} 個範本)
        </Button>
      </div>

      {/* Detail Modal */}
      <MemoDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        template={selectedTemplate}
        isSelected={selectedTemplate ? selectedTemplates.includes(selectedTemplate.id) : false}
        onToggleSelection={handleModalToggleSelection}
      />
    </div>
  );
};