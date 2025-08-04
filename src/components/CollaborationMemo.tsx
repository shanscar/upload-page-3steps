import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Pin, Paperclip, CheckCircle, UserPlus, Check, X } from "lucide-react";
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
  onContinue: (sentStatus?: SentStatus) => void;
}

interface SentStatus {
  timestamp: string;
  recipientCount: number;
}

export const CollaborationMemo = ({ analysisData, archiveData, onContinue }: CollaborationMemoProps) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROGRAM_TEMPLATES[0] | null>(null);
  const [assigningTask, setAssigningTask] = useState<string | null>(null);
  const [assigneeName, setAssigneeName] = useState<string>('');
  const [assignedTasks, setAssignedTasks] = useState<Array<{
    taskKey: string;
    taskName: string;
    assignee: string;
    role: string;
    emoji: string;
    priority: 'high' | 'medium' | 'low';
  }>>([]);
  const [sentStatus, setSentStatus] = useState<SentStatus | null>(null);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const projectUrl = window.location.href;
    
    // Create WhatsApp-style message with assignments
    let message = `📋 工作協作備忘錄\n${projectUrl}\n\n`;
    
    if (assignedTasks.length > 0) {
      message += "✅ 已指派任務：\n";
      
      // Group assignments by task
      const taskGroups = assignedTasks.reduce((acc, task) => {
        if (!acc[task.taskKey]) {
          acc[task.taskKey] = {
            taskName: task.taskName,
            emoji: task.emoji,
            assignees: []
          };
        }
        acc[task.taskKey].assignees.push(task.assignee);
        return acc;
      }, {} as Record<string, { taskName: string; emoji: string; assignees: string[] }>);
      
      Object.values(taskGroups).forEach((group, index) => {
        message += `${index + 1}. ${group.emoji} ${group.taskName}\n`;
        group.assignees.forEach(assignee => {
          message += `   👤 @${assignee}\n`;
        });
        message += "\n";
      });
    } else {
      message += "📝 尚未指派任務\n\n";
    }
    
    message += `📅 ${new Date().toLocaleDateString("zh-TW")}`;
    
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "協作內容已複製",
        description: "包含連結和任務指派的完整內容已複製到剪貼板",
      });
    } catch (err) {
      toast({
        title: "複製失敗",
        description: "無法複製內容，請手動複製",
        variant: "destructive",
      });
    }
  };

  const handleSendNotification = async () => {
    const currentUrl = window.location.href;
    const projectUrl = currentUrl.split('?')[0];
    
    // Group assigned tasks by assignee
    const tasksByAssignee = assignedTasks.reduce((acc, task) => {
      if (!acc[task.assignee]) {
        acc[task.assignee] = [];
      }
      acc[task.assignee].push(task);
      return acc;
    }, {} as Record<string, typeof assignedTasks>);

    const message = `🎯 協作任務分配通知

📋 專案連結: ${projectUrl}

👥 任務分配詳情:
${Object.entries(tasksByAssignee).map(([assignee, tasks]) => 
  `${assignee}:
${tasks.map(task => `  • ${task.taskName} (${task.role})`).join('\n')}`
).join('\n\n')}

🔗 請點擊上方連結查看完整專案詳情`;

    try {
      await navigator.clipboard.writeText(message);
      
      // Record sent status
      const timestamp = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const newSentStatus = {
        timestamp,
        recipientCount: Object.keys(tasksByAssignee).length
      };
      
      setSentStatus(newSentStatus);
      onContinue(newSentStatus);
      
      toast({
        title: "通知已發送",
        description: `已複製協作訊息並記錄發送狀態 (${Object.keys(tasksByAssignee).length} 位協作者)`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "發送失敗",
        description: "無法複製到剪貼板，請手動複製",
        variant: "destructive",
      });
    }
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
    setDetailModalOpen(true);
  };

  const handleModalToggleSelection = () => {
    if (selectedTemplate) {
      handleTemplateToggle(selectedTemplate.id);
    }
  };

  const handleResetSelection = () => {
    setSelectedTemplates([]);
  };

  const handleAssignTask = (taskKey: string) => {
    setAssigningTask(taskKey);
    setAssigneeName('@');
  };

  const handleSaveAssignee = () => {
    if (assigneeName.trim() && assigneeName.trim() !== '@' && assigningTask) {
      // Find the task details
      const allTasks = getPrioritizedTasks();
      let taskDetails = null;
      let roleDetails = null;
      
      for (const roleGroup of allTasks) {
        const taskIndex = parseInt(assigningTask.split('-').pop() || '0');
        if (assigningTask.startsWith(roleGroup.role) && roleGroup.tasks[taskIndex]) {
          taskDetails = roleGroup.tasks[taskIndex];
          roleDetails = roleGroup;
          break;
        }
      }
      
      if (taskDetails && roleDetails) {
        // Check if this task already has assignments
        const existingAssignments = assignedTasks.filter(task => task.taskKey === assigningTask);
        
        const newAssignment = {
          taskKey: assigningTask,
          taskName: taskDetails.task,
          assignee: assigneeName.replace(/^@/, ''),
          role: roleDetails.role,
          emoji: roleDetails.emoji,
          priority: taskDetails.priority
        };
        
        setAssignedTasks(prev => [...prev, newAssignment]);
        
        toast({
          title: "已指派任務",
          description: `任務「${taskDetails.task}」已指派給 ${assigneeName.replace(/^@/, '')}`,
        });
        
        // Reset input but keep task in assigning mode for multiple assignments
        setAssigneeName('@');
      }
    }
  };

  const handleCancelAssign = () => {
    setAssigningTask(null);
    setAssigneeName('');
  };

  const handleRemoveAssignment = (taskKey: string) => {
    setAssignedTasks(prev => prev.filter(task => task.taskKey !== taskKey));
    toast({
      title: "已移除指派",
      description: "任務指派已移除",
    });
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

  const selectedTemplateNames = selectedTemplates.map(id => 
    PROGRAM_TEMPLATES.find(t => t.id === id)?.title
  ).filter(Boolean);

  const getPrioritizedTasks = () => {
    const allTasks: Array<{
      role: string;
      emoji: string;
      task: string;
      timeEstimate: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];
    
    selectedTemplates.forEach(templateId => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
      if (template?.detailedTeam) {
        template.detailedTeam.forEach(teamMember => {
          teamMember.tasks.forEach(task => {
            allTasks.push({
              role: teamMember.role,
              emoji: teamMember.emoji,
              task: task.task,
              timeEstimate: task.timeEstimate,
              priority: task.priority
            });
          });
        });
      }
    });
    
    // Group by role
    const tasksByRole = allTasks.reduce((acc, task) => {
      const roleKey = task.role;
      if (!acc[roleKey]) {
        acc[roleKey] = {
          role: task.role,
          emoji: task.emoji,
          tasks: []
        };
      }
      acc[roleKey].tasks.push(task);
      return acc;
    }, {} as Record<string, { role: string; emoji: string; tasks: typeof allTasks }>);
    
    return Object.values(tasksByRole);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {selectedTemplates.length === 0 ? (
        // Template Selection Mode
        <>
          {/* Memo Header with Collaboration */}
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
                  
                  {/* Collaboration Section - Integrated into header */}
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1.5 rounded-md text-sm">
                       <CheckCircle className="w-4 h-4 text-green-600" />
                       <span>備忘類別選擇</span>
                     </div>
                    
                    <div className="text-sm text-amber-700 font-mono bg-amber-100 px-3 py-1 rounded">
                      {new Date().toLocaleDateString('zh-TW')}
                    </div>
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
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg p-4 h-48 group relative overflow-hidden",
                      rotation,
                      `bg-gradient-to-br ${template.color}`,
                      isSelected && "ring-2 ring-amber-400 shadow-lg scale-105 -rotate-0"
                    )}
                    onClick={() => handleTemplateToggle(template.id)}
                    onDoubleClick={() => handleMemoDoubleClick(template)}
                  >

                    <div className="h-full flex flex-col">
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 z-10">
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
                      
                      <div className="group">
                        <p className={cn("text-xs font-medium mb-1", template.textColor)}>
                          建議節目：
                        </p>
                        <div className="relative">
                          {/* Initially show all examples */}
                          <div className="group-hover:hidden">
                            <div className="flex flex-wrap gap-1">
                              {template.examples.map((example, idx) => (
                                <span key={idx} className={cn("text-xs bg-white/20 px-2 py-0.5 rounded-full", template.textColor)}>
                                  {example}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Show first 2 examples on hover */}
                          <div className="hidden group-hover:block animate-fade-in">
                            <div className="flex flex-wrap gap-1">
                              {template.examples.slice(0, 2).map((example, idx) => (
                                <span key={idx} className={cn("text-xs bg-white/30 px-2 py-0.5 rounded-full", template.textColor)}>
                                  {example}
                                </span>
                              ))}
                              {template.examples.length > 2 && (
                                <span className={cn("text-xs bg-white/20 px-2 py-0.5 rounded-full", template.textColor)}>
                                  +{template.examples.length - 2}更多
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Collaboration Layout Mode (Left memo + Right tasks by role)
        <>
           {/* Header */}
          <div className="relative mb-8">
            <Pin className="absolute -top-3 -right-3 text-slate-400 transform rotate-45 w-8 h-8 z-10" />
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 shadow-lg">
               <div className="p-6 relative">
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                     <Paperclip className="w-6 h-6 text-amber-600 transform -rotate-12" />
                     <h1 className="text-3xl font-bold text-amber-900 font-handwriting">
                       工作協作備忘錄
                     </h1>
                   </div>
                   <div className="flex items-center gap-3">
                     <Button 
                       onClick={handleCopyLink}
                       variant="outline"
                       size="sm"
                       className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                     >
                       <Copy className="w-4 h-4" />
                     </Button>
                     <div className="text-sm text-amber-700 font-mono bg-amber-100 px-3 py-1 rounded">
                       {new Date().toLocaleDateString('zh-TW')}
                     </div>
                   </div>
                 </div>
                 
                 {/* Assigned Tasks integrated in memo card */}
                 {assignedTasks.length > 0 && (
                   <div className="border-t border-amber-200 pt-4 mt-4">
                     <div className="flex flex-wrap gap-2">
                       {assignedTasks.map((task, index) => (
                         <div
                            key={index}
                            className="relative group bg-amber-100/50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-sm animate-fade-in"
                          >
                            <span className="text-sm">{task.emoji}</span>
                            <span className="font-medium text-amber-800">{task.taskName}</span>
                            <span className="text-amber-700">@{task.assignee}</span>
                           <Button
                             size="sm"
                             variant="ghost"
                             onClick={() => handleRemoveAssignment(task.taskKey)}
                             className="opacity-0 group-hover:opacity-100 transition-opacity h-3 w-3 p-0 text-amber-600 hover:text-red-500 hover:bg-amber-200 ml-1"
                           >
                             <X className="h-2 w-2" />
                           </Button>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
                 
                 {/* Complete Assignment & Send Message Button */}
                 {assignedTasks.length > 0 && (
                   <Button
                      onClick={handleSendNotification}
                     className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                     title="完成指派並發送訊息"
                   >
                     <CheckCircle className="h-6 w-6" />
                   </Button>
                 )}
                </div>
            </Card>
          </div>

          {/* Main Layout: Left 1/3 Selected Memo + Right 2/3 Role Tasks */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Left 1/3: Selected Memo Papers */}
            <div className="w-full lg:w-1/3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-amber-900">已選擇範本</h3>
                <Button
                  onClick={() => setSelectedTemplates([])}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {selectedTemplates.map((templateId, index) => {
                  const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                  if (!template) return null;
                  
                  const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
                  
                  return (
                    <div key={template.id} className="relative">
                      <Pin className="absolute -top-2 -right-1 w-5 h-5 text-red-500 transform rotate-45 z-10" />
                      <Card 
                        className={cn(
                          "p-4 h-56 relative overflow-hidden shadow-lg",
                          rotation,
                          `bg-gradient-to-br ${template.color}`,
                          "ring-2 ring-amber-400"
                        )}
                      >
                        <div className="h-full flex flex-col">
                          <div className="absolute top-2 left-2 z-10">
                            <CheckCircle className="w-5 h-5 text-green-600 bg-white rounded-full" />
                          </div>
                          
                          <h4 className={cn(
                            "text-base font-bold font-handwriting mb-3 leading-tight pr-6",
                            template.titleColor
                          )}>
                            {template.title}
                          </h4>
                          
                          <div className="flex-1">
                            <p className={cn("text-sm font-medium mb-2", template.textColor)}>
                              重點處理：
                            </p>
                            <p className={cn("text-sm leading-tight mb-3", template.textColor)}>
                              {template.focus}
                            </p>
                          </div>
                          
                          <div>
                            <p className={cn("text-sm font-medium mb-2", template.textColor)}>
                              建議分工：
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {template.team.map((member, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {member}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right 2/3: Tasks by Role */}
            <div className="w-full lg:w-2/3">
              <h3 className="text-xl font-bold text-green-900 mb-4">分工任務</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getPrioritizedTasks().map((roleGroup, index) => (
                  <Card key={index} className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{roleGroup.emoji}</span>
                        <h4 className="text-lg font-bold text-green-900">
                          {roleGroup.role.replace(/^[🎵📹✍️🎨📱]+ /, '')}
                        </h4>
                      </div>
                      
                      <div className="space-y-3">
                        {roleGroup.tasks.map((task, taskIndex) => {
                          const taskKey = `${roleGroup.role}-${taskIndex}`;
                          const isAssigning = assigningTask === taskKey;
                          const isAssigned = assignedTasks.some(assignedTask => assignedTask.taskKey === taskKey);
                          
                          return (
                            <div key={taskIndex} className="bg-white rounded-lg p-3 border border-green-200">
                              {isAssigning ? (
                                <div className="space-y-3">
                                  <p className="text-green-800 font-medium text-sm">
                                    {task.task}
                                  </p>
                                  <div className="flex items-center gap-2">
                                     <Input
                                       value={assigneeName}
                                       onChange={(e) => setAssigneeName(e.target.value)}
                                       onKeyDown={(e) => {
                                         if (e.key === 'Enter') {
                                           handleSaveAssignee();
                                         }
                                       }}
                                       placeholder="@輸入人名 (Enter確認)"
                                       className="flex-1 text-sm"
                                       autoFocus
                                     />
                                    <Button
                                      size="sm"
                                      onClick={handleSaveAssignee}
                                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                                      variant="ghost"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleCancelAssign}
                                      className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-green-800 font-medium text-sm mb-1">
                                      {task.task}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-green-600">
                                      <Badge 
                                        variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                                      </Badge>
                                      <span>{task.timeEstimate}</span>
                                    </div>
                                   </div>
                                   {isAssigned ? (
                                     <div className="ml-2 flex items-center gap-1 text-green-600">
                                       <CheckCircle className="h-4 w-4" />
                                       <span className="text-xs font-medium">已指派</span>
                                     </div>
                                   ) : (
                                     <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={() => handleAssignTask(taskKey)}
                                       className="ml-2 p-1 h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-100"
                                     >
                                       <UserPlus className="h-4 w-4" />
                                     </Button>
                                   )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}



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