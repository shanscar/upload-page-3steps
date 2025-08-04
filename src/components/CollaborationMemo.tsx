import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Share, Users, Pin, Paperclip, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MemoDetailModal } from "./MemoDetailModal";

// Program Templates Data
const PROGRAM_TEMPLATES = [
  {
    id: '1',
    title: '🗞️ 時事新聞／評論類',
    color: 'from-blue-100 to-blue-200',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
    examples: ['自由風自由Phone', '星期六問責', '新聞天地'],
    focus: '專注於時事分析、政治評論、社會議題深度報導',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '主持開場、議題重點、來賓意見、聽眾來電、總結評論' },
      { icon: '📝', label: '文字稿', content: '金句語錄、政策解讀、觀點對比、社會爭議' },
      { icon: '📱', label: '社媒素材', content: '議題精華短片、資料圖表、討論焦點卡片' },
      { icon: '🔍', label: '關鍵字標籤', content: '時政人物、焦點政策、社會熱話' }
    ],
    team: ['剪輯師', '時事記者', '視覺設計', '社媒專員'],
    detailedTeam: [
      {
        role: '📹 剪輯師',
        emoji: '🎬',
        tasks: [
          { task: '新聞重點剪輯', timeEstimate: '2-3小時', priority: 'high' as const },
          { task: '聽眾來電整理', timeEstimate: '1-2小時', priority: 'medium' as const },
          { task: '議題精華製作', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 時事記者',
        emoji: '📰',
        tasks: [
          { task: '觀點提煉', timeEstimate: '2小時', priority: 'high' as const },
          { task: '事實核查', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '背景資料整理', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 視覺設計',
        emoji: '🖼️',
        tasks: [
          { task: '政策對比圖', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '時事資訊卡', timeEstimate: '1小時', priority: 'medium' as const },
          { task: '數據圖表設計', timeEstimate: '2小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '📲',
        tasks: [
          { task: '網上話題包裝', timeEstimate: '1小時', priority: 'high' as const },
          { task: '焦點推廣', timeEstimate: '30分鐘', priority: 'medium' as const },
          { task: '輿論監測', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '🎨 文化藝術／人物專訪類',
    color: 'from-purple-100 to-purple-200',
    titleColor: 'text-purple-800',
    textColor: 'text-purple-700',
    examples: ['講東講西', '我們一直都在說故事', '藝術家專題'],
    focus: '深度人物訪談、藝術創作分享、文化背景探索',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '作品介紹段落、嘉賓訪問、創作展示' },
      { icon: '📝', label: '文字稿', content: '藝術家語錄、作品意義、文化背景' },
      { icon: '📱', label: '社媒素材', content: '訪談重點片段、創作賞析、名言金句' },
      { icon: '🔍', label: '關鍵字標籤', content: '藝術家姓名、作品名稱、藝術類型' }
    ],
    team: ['剪輯師', '文化記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '✂️',
        tasks: [
          { task: '重點訪談剪輯', timeEstimate: '2-3小時', priority: 'high' as const },
          { task: '創作片段編輯', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '背景音樂配置', timeEstimate: '45分鐘', priority: 'low' as const }
        ]
      },
      {
        role: '✍️ 文化記者',
        emoji: '🎭',
        tasks: [
          { task: '背景分析', timeEstimate: '2小時', priority: 'high' as const },
          { task: '深度整理', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '文化脈絡研究', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🖌️',
        tasks: [
          { task: '藝術宣傳圖', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '故事圖像化', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '作品展示設計', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🌟',
        tasks: [
          { task: '深度人物推廣', timeEstimate: '1小時', priority: 'high' as const },
          { task: '專訪精華分享', timeEstimate: '45分鐘', priority: 'medium' as const },
          { task: '藝術社群互動', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '3',
    title: '🎵 音樂娛樂／流行榜類',
    color: 'from-pink-100 to-pink-200',
    titleColor: 'text-pink-800',
    textColor: 'text-pink-700',
    examples: ['中文歌曲龍虎榜', 'Made in Hong Kong', '輕談淺唱不夜天'],
    focus: '音樂趨勢分析、榜單內容製作、歌手互動展示',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '音樂播放環節、榜單介紹、歌手互動' },
      { icon: '📝', label: '文字稿', content: '歌曲創作背景、歌手語錄、音樂趨勢' },
      { icon: '📱', label: '社媒素材', content: 'MV短片、音樂榜單視覺化、流行精選剪輯' },
      { icon: '🔍', label: '關鍵字標籤', content: '歌手名稱、歌曲標題、流行音樂類型' }
    ],
    team: ['剪輯師', '音樂記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '🎧',
        tasks: [
          { task: '熱門片段剪輯', timeEstimate: '2小時', priority: 'high' as const },
          { task: 'Live演出編輯', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '音效後製', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 音樂記者',
        emoji: '🎤',
        tasks: [
          { task: '流行分析', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '新碟資料整理', timeEstimate: '1小時', priority: 'medium' as const },
          { task: '音樂趨勢研究', timeEstimate: '45分鐘', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🎨',
        tasks: [
          { task: '榜單圖像設計', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '藝人宣傳設計', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: 'MV視覺包裝', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🎶',
        tasks: [
          { task: '音樂精華推廣', timeEstimate: '45分鐘', priority: 'high' as const },
          { task: '榜單內容分享', timeEstimate: '30分鐘', priority: 'medium' as const },
          { task: '粉絲互動管理', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '4',
    title: '🏡 生活資訊／服務類',
    color: 'from-green-100 to-green-200',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
    examples: ['精靈一點', '長者健康之道', '投資新世代'],
    focus: '實用生活建議、專家指導、聽眾服務資訊',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '專家貼士、實用建議、聽眾參與段落' },
      { icon: '📝', label: '文字稿', content: '重點資訊、建議要點、生活數據摘要' },
      { icon: '📱', label: '社媒素材', content: '健康貼士圖表、理財資訊卡' },
      { icon: '🔍', label: '關鍵字標籤', content: '生活主題、專家姓名、知識分類' }
    ],
    team: ['剪輯師', '生活記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '📹',
        tasks: [
          { task: '貼士剪輯', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '實用段落編輯', timeEstimate: '1小時', priority: 'medium' as const },
          { task: '專家訪談剪輯', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 生活記者',
        emoji: '📋',
        tasks: [
          { task: '指引內容整理', timeEstimate: '2小時', priority: 'high' as const },
          { task: '知識整理', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '專家資料核實', timeEstimate: '45分鐘', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '💡',
        tasks: [
          { task: '資訊圖卡設計', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '健康視覺設計', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '數據圖表製作', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🔔',
        tasks: [
          { task: '生活建議推廣', timeEstimate: '45分鐘', priority: 'high' as const },
          { task: '資訊重點包裝', timeEstimate: '30分鐘', priority: 'medium' as const },
          { task: '用戶諮詢回應', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '5',
    title: '🌏 旅遊／國際視野類',
    color: 'from-cyan-100 to-cyan-200',
    titleColor: 'text-cyan-800',
    textColor: 'text-cyan-700',
    examples: ['旅遊樂園', '我要走天涯', 'The Pulse', 'Backchat'],
    focus: '旅遊體驗分享、國際視野拓展、文化交流探討',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '目的地介紹、旅遊體驗、國際觀察段落' },
      { icon: '📝', label: '文字稿', content: '旅遊感受、全球趨勢、異地故事' },
      { icon: '📱', label: '社媒素材', content: '旅遊精華短片、世界地圖圖示、景點推介' },
      { icon: '🔍', label: '關鍵字標籤', content: '旅遊地點、國家名稱、國際議題' }
    ],
    team: ['剪輯師', '旅遊記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '🌍',
        tasks: [
          { task: '遊歷故事剪輯', timeEstimate: '2小時', priority: 'high' as const },
          { task: '旅遊片段編輯', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '景點介紹製作', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 旅遊／國際記者',
        emoji: '✈️',
        tasks: [
          { task: '異地分析', timeEstimate: '2小時', priority: 'high' as const },
          { task: '文化觀察', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '旅遊資訊整理', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🗺️',
        tasks: [
          { task: '地圖設計', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '景點圖片處理', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '旅遊視覺包裝', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🏖️',
        tasks: [
          { task: '國際內容分享', timeEstimate: '45分鐘', priority: 'high' as const },
          { task: '旅遊推廣', timeEstimate: '30分鐘', priority: 'medium' as const },
          { task: '旅友互動管理', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '6',
    title: '🎭 戲曲／傳統文化類',
    color: 'from-amber-100 to-amber-200',
    titleColor: 'text-amber-800',
    textColor: 'text-amber-700',
    examples: ['戲曲之夜', '粵曲天地', '晚間粵曲'],
    focus: '傳統文化傳承、戲曲藝術推廣、文化教育普及',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '經典演出、藝人介紹、曲藝故事' },
      { icon: '📝', label: '文字稿', content: '曲目背景、戲曲名句、文化傳承' },
      { icon: '📱', label: '社媒素材', content: '經典片段、曲藝知識、藝人故事' },
      { icon: '🔍', label: '關鍵字標籤', content: '曲目名稱、戲曲流派、傳統文化' }
    ],
    team: ['剪輯師', '文化記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '🎬',
        tasks: [
          { task: '戲曲片段剪輯', timeEstimate: '2.5小時', priority: 'high' as const },
          { task: '名段精華製作', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '背景音樂處理', timeEstimate: '45分鐘', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 文化記者',
        emoji: '📜',
        tasks: [
          { task: '曲藝介紹撰寫', timeEstimate: '2小時', priority: 'high' as const },
          { task: '藝人資料整理', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '文化背景研究', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🎨',
        tasks: [
          { task: '戲曲主題視覺', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '文化推廣圖設計', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '傳統元素包裝', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🏮',
        tasks: [
          { task: '戲曲推介', timeEstimate: '45分鐘', priority: 'high' as const },
          { task: '歷史故事散播', timeEstimate: '30分鐘', priority: 'medium' as const },
          { task: '文化社群維護', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '7',
    title: '🎲 互動娛樂／遊戲類',
    color: 'from-orange-100 to-orange-200',
    titleColor: 'text-orange-800',
    textColor: 'text-orange-700',
    examples: ['鬥秀場', '守下留情', '三五成群'],
    focus: '互動遊戲設計、娛樂內容製作、聽眾參與活動',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '開場、遊戲環節、互動討論' },
      { icon: '📝', label: '文字稿', content: '互動對話、遊戲規則、聽眾反應' },
      { icon: '📱', label: '社媒素材', content: '趣味短片、互動精華、遊戲花絮' },
      { icon: '🔍', label: '關鍵字標籤', content: '節目主題、遊戲名稱、娛樂類型' }
    ],
    team: ['剪輯師', '娛樂記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '🎮',
        tasks: [
          { task: '趣味段落剪輯', timeEstimate: '2小時', priority: 'high' as const },
          { task: '互動精華製作', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '搞笑時刻集錦', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 娛樂記者',
        emoji: '🎪',
        tasks: [
          { task: '有趣內容整理', timeEstimate: '1.5小時', priority: 'high' as const },
          { task: '遊戲規則說明', timeEstimate: '1小時', priority: 'medium' as const },
          { task: '娛樂趨勢分析', timeEstimate: '45分鐘', priority: 'low' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🎨',
        tasks: [
          { task: '遊戲視覺設計', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '趣味圖卡製作', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '互動元素設計', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🎉',
        tasks: [
          { task: '娛樂推廣', timeEstimate: '45分鐘', priority: 'high' as const },
          { task: '爆笑短片製作', timeEstimate: '30分鐘', priority: 'medium' as const },
          { task: '遊戲互動管理', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
  },
  {
    id: '8',
    title: '📚 專題／紀實／教育類',
    color: 'from-indigo-100 to-indigo-200',
    titleColor: 'text-indigo-800',
    textColor: 'text-indigo-700',
    examples: ['香港故事', '獅子山下', 'CIBS社區計劃'],
    focus: '深度專題製作、紀實報導、教育內容傳播',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '故事開端、人物描寫、重要事件' },
      { icon: '📝', label: '文字稿', content: '真實故事、教育信息、深度分析' },
      { icon: '📱', label: '社媒素材', content: '紀實剪輯、人物片段、教育展示' },
      { icon: '🔍', label: '關鍵字標籤', content: '主角名稱、社會事件、教育主題' }
    ],
    team: ['剪輯師', '專題記者', '設計師', '社媒專員'],
    detailedTeam: [
      {
        role: '🎵 剪輯師',
        emoji: '📽️',
        tasks: [
          { task: '故事精華剪輯', timeEstimate: '3小時', priority: 'high' as const },
          { task: '人物訪談編輯', timeEstimate: '2小時', priority: 'high' as const },
          { task: '紀實場景製作', timeEstimate: '1.5小時', priority: 'medium' as const }
        ]
      },
      {
        role: '✍️ 專題記者',
        emoji: '🔍',
        tasks: [
          { task: '深度分析撰寫', timeEstimate: '3小時', priority: 'high' as const },
          { task: '內容梳理', timeEstimate: '2小時', priority: 'high' as const },
          { task: '事實查證', timeEstimate: '1小時', priority: 'medium' as const }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '📊',
        tasks: [
          { task: '紀實圖像設計', timeEstimate: '2小時', priority: 'medium' as const },
          { task: '教育圖卡製作', timeEstimate: '1.5小時', priority: 'medium' as const },
          { task: '專題視覺包裝', timeEstimate: '1小時', priority: 'low' as const }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '📖',
        tasks: [
          { task: '故事推廣', timeEstimate: '1小時', priority: 'high' as const },
          { task: '教育資源分享', timeEstimate: '45分鐘', priority: 'medium' as const },
          { task: '社會議題討論', timeEstimate: '持續進行', priority: 'medium' as const }
        ]
      }
    ]
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
  const { toast } = useToast();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [colleagueEmail, setColleagueEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROGRAM_TEMPLATES[0] | null>(null);

  const handleCopyMessage = () => {
    const selectedItems = selectedTemplates.map(id => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === id);
      return template?.title || '';
    }).join(', ');
    
    const message = `📋 工作協作事項\n\n已選範本：${selectedItems}\n\n跟進事項：\n${getFollowUpTasks().map((task, index) => `${index + 1}. ${task}`).join('\n')}\n\n項目連結：${window.location.href}`;
    
    navigator.clipboard.writeText(message);
    toast({
      title: "訊息已複製",
      description: "協作訊息已複製到剪貼板",
    });
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

  const handleMemoDoubleClick = (template: typeof PROGRAM_TEMPLATES[0]) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleModalToggleSelection = () => {
    if (selectedTemplate) {
      handleTemplateToggle(selectedTemplate.id);
    }
  };

  const handleResetSelection = () => {
    setSelectedTemplates([]);
  };

  // Extract follow-up tasks from selected templates
  const getFollowUpTasks = () => {
    const allTasks: string[] = [];
    
    selectedTemplates.forEach(templateId => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
      if (template?.detailedTeam) {
        template.detailedTeam.forEach(teamMember => {
          teamMember.tasks.forEach(task => {
            if (!allTasks.includes(task.task)) {
              allTasks.push(task.task);
            }
          });
        });
      }
    });
    
    return allTasks;
  };

  // Show simplified memo when templates are selected
  if (selectedTemplates.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 relative">
        {/* Whiteboard texture background */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Left side - Main Whiteboard */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {/* Whiteboard Header */}
              <div className="bg-white rounded-lg p-8 shadow-lg border-4 border-slate-300 mb-6" style={{
                backgroundImage: `linear-gradient(45deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(45deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
              }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold font-handwriting text-slate-800 mb-2">
                      📋 工作協作大畫板
                    </h1>
                    <p className="text-slate-600 text-lg">
                      {new Date().toLocaleDateString('zh-TW', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • 早晨工作提醒
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleResetSelection}
                    className="border-slate-400 text-slate-700 hover:bg-slate-100"
                  >
                    重新選擇範本
                  </Button>
                </div>

                {/* Selected Templates Summary */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200 border-dashed">
                  <h2 className="text-2xl font-bold text-blue-800 mb-3 font-handwriting">📝 今日處理範本</h2>
                  <div className="flex flex-wrap gap-3">
                    {selectedTemplates.map(templateId => {
                      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                      return template ? (
                        <Badge key={templateId} className="bg-blue-100 text-blue-800 border-blue-300 text-sm py-1 px-3">
                          {template.title}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Follow-up Items */}
                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200 border-dashed">
                  <h2 className="text-2xl font-bold text-yellow-800 mb-4 font-handwriting">✅ 跟進事項清單</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getFollowUpTasks().map((task, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-200 shadow-sm">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-yellow-900 font-medium">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Collaboration Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-lg border-4 border-slate-300 sticky top-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4 font-handwriting">👥 協作分享</h2>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleCopyMessage} 
                    variant="outline" 
                    className="w-full flex items-center gap-2 border-slate-300 hover:bg-slate-50"
                  >
                    <Copy className="w-4 h-4" />
                    複製訊息
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="同事email"
                      value={colleagueEmail}
                      onChange={(e) => setColleagueEmail(e.target.value)}
                      className="border-slate-300"
                    />
                    <Button 
                      onClick={handleShareToColleague} 
                      className="w-full flex items-center gap-2 bg-slate-700 hover:bg-slate-800"
                    >
                      <Share className="w-4 h-4" />
                      發送給同事
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center mt-8">
            <Button onClick={onContinue} size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
              完成協作設定
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Template selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 relative">
      {/* Whiteboard texture background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Large Whiteboard Header */}
        <div className="bg-white rounded-lg p-8 shadow-lg border-4 border-slate-300 mb-8" style={{
          backgroundImage: `linear-gradient(45deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(45deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}>
          <div className="text-center">
            <h1 className="text-5xl font-bold font-handwriting text-slate-800 mb-4">
              📋 工作協作大畫板
            </h1>
            <p className="text-slate-600 text-xl font-handwriting">
              選擇適合的節目範本，開始今日的工作協作
            </p>
          </div>
        </div>

        {/* Template Selection Controls - Simplified */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge variant="outline" className="border-slate-400 text-slate-700 bg-white text-lg py-2 px-4">
            已選擇 {selectedTemplates.length} 個範本
          </Badge>
        </div>

        {/* Template Grid - Large Whiteboard Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PROGRAM_TEMPLATES.map((template) => {
            const isSelected = selectedTemplates.includes(template.id);
            
            return (
              <div key={template.id} className="relative group">
                {/* Pin decoration */}
                <Pin className={cn(
                  "absolute -top-4 -right-4 w-8 h-8 transform rotate-45 z-10 transition-colors",
                  isSelected ? "text-red-500" : "text-slate-400"
                )} />
                
                {/* Memo card on whiteboard */}
                <Card 
                  className={cn(
                    "h-64 p-4 cursor-pointer transition-all duration-300 transform",
                    `bg-gradient-to-br ${template.color}`,
                    "border-2 shadow-lg",
                    isSelected ? "border-red-300 scale-105 shadow-xl" : "border-slate-300 hover:scale-102 hover:shadow-xl",
                    "group-hover:shadow-2xl"
                  )}
                  onClick={() => handleTemplateToggle(template.id)}
                  onDoubleClick={() => handleMemoDoubleClick(template)}
                >
                  <div className="h-full flex flex-col justify-between">
                    {/* Header */}
                    <div>
                      <h3 className={cn(
                        "text-lg font-bold font-handwriting mb-2 leading-tight",
                        template.titleColor
                      )}>
                        {template.title}
                      </h3>
                      
                      {/* Examples */}
                      <div className="mb-3">
                        <p className={cn("text-xs font-medium mb-1", template.titleColor)}>
                          🎯 例子：
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.examples.slice(0, 2).map((example, index) => (
                            <Badge key={index} variant="outline" className={cn("text-xs py-0 px-1", template.textColor)}>
                              {example}
                            </Badge>
                          ))}
                          {template.examples.length > 2 && (
                            <Badge variant="outline" className={cn("text-xs py-0 px-1", template.textColor)}>
                              +{template.examples.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={cn("text-xs border", template.textColor)}>
                          {template.team.length} 個角色
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                      
                      <p className={cn("text-xs leading-tight line-clamp-2", template.textColor)}>
                        {template.focus}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Collaboration Section - Simplified */}
        {selectedTemplates.length > 0 && (
          <div className="bg-white rounded-lg p-6 border-4 border-slate-300 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 font-handwriting">👥 快速協作</h2>
            
            <div className="flex items-center justify-center gap-4">
              <Button 
                onClick={handleCopyMessage} 
                variant="outline" 
                className="flex items-center gap-2 border-slate-400 hover:bg-slate-50"
              >
                <Copy className="w-4 h-4" />
                複製訊息
              </Button>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {selectedTemplates.length > 0 && (
          <div className="flex justify-center">
            <Button onClick={onContinue} size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
              完成協作設定
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <MemoDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        isSelected={selectedTemplate ? selectedTemplates.includes(selectedTemplate.id) : false}
        onToggleSelection={handleModalToggleSelection}
      />
    </div>
  );
};