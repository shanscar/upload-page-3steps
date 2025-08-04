import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Pin, Paperclip, CheckCircle, UserPlus, Check, X, ArrowUp, Hand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MemoDetailModal } from "./MemoDetailModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Program Templates Data
const PROGRAM_TEMPLATES = [
  {
    id: '1',
    title: '🗞️ 時事新聞／評論類',
    color: 'from-blue-100 to-blue-200',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
    examples: ['千禧年代', '自由風自由Phone', '星期六問責', '新聞天地', '今日立法會'],
    focus: '專注於時事分析、政治評論、社會議題深度報導',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '主持開場、議題重點、來賓意見、聽眾來電' },
      { icon: '📝', label: '文字稿', content: '金句語錄、政策解讀、觀點對比、社會爭議、總結評論' },
      { icon: '📱', label: '社媒素材', content: '議題精華短片、資料圖表、討論焦點卡片' },
      { icon: '🔍', label: '關鍵字標籤', content: '時政人物、焦點政策、社會熱話' }
    ],
    team: ['剪輯師', '時事記者', '視覺設計', '社媒專員'],
    detailedTeam: [
      {
        role: '📹 剪輯師',
        emoji: '🎬',
        tasks: [
          { task: '新聞重點剪輯' },
          { task: '聽眾來電整理' },
          { task: '議題精華製作' }
        ]
      },
      {
        role: '✍️ 時事記者',
        emoji: '📰',
        tasks: [
          { task: '觀點提煉' },
          { task: '事實核查' },
          { task: '背景資料整理' }
        ]
      },
      {
        role: '🎨 視覺設計',
        emoji: '🖼️',
        tasks: [
          { task: '政策對比圖' },
          { task: '時事資訊卡' },
          { task: '數據圖表設計' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '📲',
        tasks: [
          { task: '網上話題包裝' },
          { task: '焦點推廣' },
          { task: '輿論監測' }
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
    examples: ['講東講西', '我們一直都在說故事', '裝腔啟示錄', '不完美受害人', '學人沙龍'],
    focus: '深度人物訪談、藝術創作分享、文化背景探索',
    processingAreas: [
      { icon: '⏰', label: '時間索引', content: '作品介紹、嘉賓訪問、創作展示' },
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
          { task: '重點訪談剪輯' },
          { task: '創作片段編輯' },
          { task: '背景音樂配置' }
        ]
      },
      {
        role: '✍️ 文化記者',
        emoji: '🎭',
        tasks: [
          { task: '背景分析' },
          { task: '深度整理' },
          { task: '文化脈絡研究' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🖌️',
        tasks: [
          { task: '藝術宣傳圖' },
          { task: '故事圖像化' },
          { task: '作品展示設計' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🌟',
        tasks: [
          { task: '深度人物推廣' },
          { task: '專訪精華分享' },
          { task: '藝術社群互動' }
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
    examples: ['中文歌曲龍虎榜', 'Made in Hong Kong 李志剛', '輕談淺唱不夜天', '音樂情人', '音樂中年'],
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
          { task: '熱門片段剪輯' },
          { task: 'Live演出編輯' },
          { task: '音效後製' }
        ]
      },
      {
        role: '✍️ 音樂記者',
        emoji: '🎤',
        tasks: [
          { task: '流行分析' },
          { task: '新碟資料整理' },
          { task: '音樂趨勢研究' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🎨',
        tasks: [
          { task: '榜單圖像設計' },
          { task: '藝人宣傳設計' },
          { task: 'MV視覺包裝' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🎶',
        tasks: [
          { task: '音樂精華推廣' },
          { task: '榜單內容分享' },
          { task: '粉絲互動管理' }
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
    examples: ['精靈一點', '長者健康之道', '投資新世代', '香江暖流', '社區生活線'],
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
          { task: '貼士剪輯' },
          { task: '實用段落編輯' },
          { task: '專家訪談剪輯' }
        ]
      },
      {
        role: '✍️ 生活記者',
        emoji: '📋',
        tasks: [
          { task: '指引內容整理' },
          { task: '知識整理' },
          { task: '專家資料核實' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '💡',
        tasks: [
          { task: '資訊圖卡設計' },
          { task: '健康視覺設計' },
          { task: '數據圖表製作' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🔔',
        tasks: [
          { task: '生活建議推廣' },
          { task: '資訊重點包裝' },
          { task: '用戶諮詢回應' }
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
    examples: ['旅遊樂園', '我要走天涯', 'Backchat', 'The Pulse', 'Money Talk'],
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
          { task: '遊歷故事剪輯' },
          { task: '旅遊片段編輯' },
          { task: '景點介紹製作' }
        ]
      },
      {
        role: '✍️ 旅遊／國際記者',
        emoji: '✈️',
        tasks: [
          { task: '異地分析' },
          { task: '文化觀察' },
          { task: '旅遊資訊整理' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🗺️',
        tasks: [
          { task: '地圖設計' },
          { task: '景點圖片處理' },
          { task: '旅遊視覺包裝' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🏖️',
        tasks: [
          { task: '國際內容分享' },
          { task: '旅遊推廣' },
          { task: '旅友互動管理' }
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
    examples: ['戲曲之夜', '粵曲天地', '晚間粵曲', '星期五粵曲夜'],
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
          { task: '戲曲片段剪輯' },
          { task: '名段精華製作' },
          { task: '背景音樂處理' }
        ]
      },
      {
        role: '✍️ 文化記者',
        emoji: '📜',
        tasks: [
          { task: '曲藝介紹撰寫' },
          { task: '藝人資料整理' },
          { task: '文化背景研究' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🎨',
        tasks: [
          { task: '戲曲主題視覺' },
          { task: '文化推廣圖設計' },
          { task: '傳統元素包裝' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🏮',
        tasks: [
          { task: '戲曲推介' },
          { task: '歷史故事散播' },
          { task: '文化社群維護' }
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
    examples: ['鬥秀場', '守下留情', '三五成群', '周末午夜場', '生活日常'],
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
          { task: '趣味段落剪輯' },
          { task: '互動精華製作' },
          { task: '搞笑時刻集錦' }
        ]
      },
      {
        role: '✍️ 娛樂記者',
        emoji: '🎪',
        tasks: [
          { task: '有趣內容整理' },
          { task: '遊戲規則說明' },
          { task: '娛樂趨勢分析' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '🎨',
        tasks: [
          { task: '遊戲視覺設計' },
          { task: '趣味圖卡製作' },
          { task: '互動元素設計' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '🎉',
        tasks: [
          { task: '娛樂推廣' },
          { task: '爆笑短片製作' },
          { task: '遊戲互動管理' }
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
    examples: ['香港故事', '獅子山下', 'CIBS社區參與廣播計劃', '走過青春', '教學有心人'],
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
          { task: '紀實剪輯' },
          { task: '故事情節編輯' },
          { task: '專題片頭製作' }
        ]
      },
      {
        role: '✍️ 專題記者',
        emoji: '📚',
        tasks: [
          { task: '深度研究' },
          { task: '背景分析撰寫' },
          { task: '專題內容整理' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '📊',
        tasks: [
          { task: '專題視覺包裝' },
          { task: '教育圖表設計' },
          { task: '紀實圖像處理' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '📖',
        tasks: [
          { task: '教育內容推廣' },
          { task: '專題推介' },
          { task: '知識分享' }
        ]
      }
    ]
  }
];

// Interfaces
interface CollaborationMemoProps {
  analysisData?: any;
  archiveData?: any;
  onContinue: () => void;
}

interface SentStatus {
  [key: string]: boolean;
}

interface TaskDetail {
  task: string;
}

interface TeamMemberDetail {
  role: string;
  emoji: string;
  tasks: TaskDetail[];
}

interface ProcessingArea {
  icon: string;
  label: string;
  content: string;
}

interface ProgramTemplate {
  id: string;
  title: string;
  color: string;
  titleColor: string;
  textColor: string;
  examples: string[];
  focus: string;
  processingAreas: ProcessingArea[];
  team: string[];
  detailedTeam: TeamMemberDetail[];
}

interface TaskAssignment {
  task: string;
  assignee: string;
  templateId: string;
  role: string;
}

interface CustomTask {
  task: string;
  assignee?: string;
}

export const CollaborationMemo: React.FC<CollaborationMemoProps> = ({ 
  analysisData, 
  archiveData, 
  onContinue 
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [assigningTask, setAssigningTask] = useState<TaskAssignment | null>(null);
  const [assigneeInput, setAssigneeInput] = useState('');
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [customTaskInput, setCustomTaskInput] = useState('');
  const [customAssigneeInput, setCustomAssigneeInput] = useState('');
  const [sentStatus, setSentStatus] = useState<SentStatus>({});
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const currentUrl = window.location.href;
    let message = `📢 項目協作通知\n\n🔗 項目連結：${currentUrl}\n\n`;
    
    if (taskAssignments.length > 0 || customTasks.length > 0) {
      message += "📋 任務分配：\n";
      
      taskAssignments.forEach(assignment => {
        message += `• @${assignment.assignee}: ${assignment.task}\n`;
      });
      
      customTasks.filter(task => task.assignee).forEach(task => {
        message += `• @${task.assignee}: ${task.task}\n`;
      });
    }
    
    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "已複製到剪貼板",
        description: "項目連結和任務分配已準備好分享",
      });
    } catch (err) {
      toast({
        title: "複製失敗",
        description: "請手動複製連結",
        variant: "destructive",
      });
    }
  };

  const handleSendNotification = async (templateId: string) => {
    const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const assignedTasks = taskAssignments.filter(ta => ta.templateId === templateId);
    const currentUrl = window.location.href;
    
    let message = `📢 ${template.title} 協作通知\n\n🔗 項目連結：${currentUrl}\n\n`;
    
    if (assignedTasks.length > 0) {
      message += "📋 你的任務分配：\n";
      assignedTasks.forEach(assignment => {
        message += `• @${assignment.assignee}: ${assignment.task}\n`;
      });
    }
    
    try {
      await navigator.clipboard.writeText(message);
      setSentStatus(prev => ({
        ...prev,
        [templateId]: true
      }));
      
      toast({
        title: "通知已準備",
        description: `${template.title} 的協作通知已複製到剪貼板`,
      });
    } catch (err) {
      toast({
        title: "複製失敗",
        description: "請手動複製通知內容",
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

  const handleMemoDoubleClick = (template: ProgramTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleAssignTask = (task: string, templateId: string, role: string) => {
    setAssigningTask({ task, assignee: '', templateId, role });
    setAssigneeInput('');
  };

  const handleSaveAssignee = () => {
    if (!assigningTask || !assigneeInput.trim()) return;
    
    const newAssignment: TaskAssignment = {
      ...assigningTask,
      assignee: assigneeInput.trim()
    };
    
    setTaskAssignments(prev => {
      const filtered = prev.filter(ta => ta.task !== assigningTask.task || ta.templateId !== assigningTask.templateId);
      return [...filtered, newAssignment];
    });
    
    setAssigningTask(null);
    setAssigneeInput('');
    
    toast({
      title: "任務已指派",
      description: `已將「${assigningTask.task}」指派給 @${assigneeInput.trim()}`,
    });
  };

  const handleRemoveAssignment = (task: string, templateId: string) => {
    setTaskAssignments(prev => 
      prev.filter(ta => !(ta.task === task && ta.templateId === templateId))
    );
    
    toast({
      title: "任務指派已移除",
      description: "任務指派已成功移除",
    });
  };

  const handleAddCustomTask = () => {
    if (!customTaskInput.trim()) return;
    
    const newTask: CustomTask = {
      task: customTaskInput.trim(),
      assignee: customAssigneeInput.trim() || undefined
    };
    
    setCustomTasks(prev => [...prev, newTask]);
    setCustomTaskInput('');
    setCustomAssigneeInput('');
    
    toast({
      title: "自定義任務已添加",
      description: `已添加任務：${newTask.task}`,
    });
  };

  const getFollowUpTasks = () => {
    const allTasks = new Set<string>();
    
    selectedTemplates.forEach(templateId => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        template.detailedTeam.forEach(member => {
          member.tasks.forEach(task => {
            allTasks.add(task.task);
          });
        });
      }
    });
    
    return Array.from(allTasks);
  };

  const getPrioritizedTasks = () => {
    const tasksByRole: { [role: string]: TaskDetail[] } = {};
    
    selectedTemplates.forEach(templateId => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        template.detailedTeam.forEach(member => {
          if (!tasksByRole[member.role]) {
            tasksByRole[member.role] = [];
          }
          tasksByRole[member.role].push(...member.tasks);
        });
      }
    });
    
    return tasksByRole;
  };

  const getTaskAssignment = (task: string, templateId: string) => {
    return taskAssignments.find(ta => ta.task === task && ta.templateId === templateId);
  };

  const isTaskAssigned = (task: string, templateId: string) => {
    return taskAssignments.some(ta => ta.task === task && ta.templateId === templateId);
  };

  if (selectedTemplates.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">📝 製作備忘錄</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            選擇適合的節目類型模板，為你的專案建立協作備忘錄
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PROGRAM_TEMPLATES.map((template) => {
            const isSelected = selectedTemplates.includes(template.id);
            
            return (
              <Card
                key={template.id}
                className={cn(
                  "relative p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group border-2",
                  `bg-gradient-to-br ${template.color}`,
                  isSelected ? "border-primary scale-105 shadow-xl" : "border-transparent hover:border-muted-foreground/20"
                )}
                style={{
                  transform: `rotate(${Math.random() * 6 - 3}deg)`,
                }}
                onClick={() => handleTemplateToggle(template.id)}
                onDoubleClick={() => handleMemoDoubleClick(template)}
              >
                <div className="absolute top-2 right-2">
                  <Pin className={cn(
                    "w-5 h-5 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className={cn("text-lg font-bold", template.titleColor)}>
                      {template.title}
                    </h3>
                    <p className={cn("text-sm mt-2", template.textColor)}>
                      {template.focus}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className={cn("text-xs font-medium", template.textColor)}>
                      節目例子：
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.examples.slice(0, 3).map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                      {template.examples.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.examples.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-black/10">
                    <div className="flex flex-wrap gap-1">
                      {template.team.map((member, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {selectedTemplates.length > 0 && (
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => {}}
              size="lg"
              className="px-8"
            >
              建立協作備忘錄 ({selectedTemplates.length} 個模板)
              <ArrowUp className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        <MemoDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          template={selectedTemplate}
          isSelected={selectedTemplate ? selectedTemplates.includes(selectedTemplate.id) : false}
          onToggleSelection={() => selectedTemplate && handleTemplateToggle(selectedTemplate.id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">📝 協作備忘錄</h2>
        <p className="text-lg text-muted-foreground">
          管理你的專案任務分配和協作流程
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">已選擇的備忘紙</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTemplates([])}
            >
              重新選擇
            </Button>
          </div>

          <div className="grid gap-4">
            {selectedTemplates.map((templateId) => {
              const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
              if (!template) return null;

              const templateAssignments = taskAssignments.filter(ta => ta.templateId === templateId);
              const isSent = sentStatus[templateId];

              return (
                <Card
                  key={templateId}
                  className={cn(
                    "p-4 transition-all duration-300 cursor-pointer hover:shadow-md border-2",
                    `bg-gradient-to-br ${template.color}`,
                    "border-transparent"
                  )}
                  style={{
                    transform: `rotate(${Math.random() * 4 - 2}deg)`,
                  }}
                  onDoubleClick={() => handleMemoDoubleClick(template)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={cn("font-bold text-sm", template.titleColor)}>
                        {template.title}
                      </h4>
                      <p className={cn("text-xs mt-1", template.textColor)}>
                        {template.focus}
                      </p>
                      
                      {templateAssignments.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {templateAssignments.slice(0, 2).map((assignment, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Paperclip className="w-3 h-3 text-primary" />
                              <span className="text-xs text-foreground">
                                @{assignment.assignee}: {assignment.task}
                              </span>
                            </div>
                          ))}
                          {templateAssignments.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{templateAssignments.length - 2} 個任務...
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Pin className="w-4 h-4 text-primary" />
                      
                      {templateAssignments.length > 0 && (
                        <Button
                          size="sm"
                          variant={isSent ? "secondary" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendNotification(templateId);
                          }}
                          className="text-xs px-2 py-1 h-6"
                        >
                          {isSent ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              已發送
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              發送
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="processing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="processing">重點處理範疇</TabsTrigger>
              <TabsTrigger value="tasks">任務分配</TabsTrigger>
            </TabsList>

            <TabsContent value="processing" className="space-y-4">
              {selectedTemplates.map((templateId) => {
                const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                if (!template) return null;

                return (
                  <Card key={templateId} className="p-4">
                    <h4 className="font-semibold text-sm mb-3 text-primary">
                      {template.title}
                    </h4>
                    <div className="grid gap-3">
                      {template.processingAreas.map((area, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="text-lg">{area.icon}</div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{area.label}</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              {area.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {selectedTemplates.map((templateId) => {
                const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                if (!template) return null;

                return (
                  <Card key={templateId} className="p-4">
                    <h4 className="font-semibold text-sm mb-3 text-primary">
                      {template.title}
                    </h4>
                    <div className="space-y-4">
                      {template.detailedTeam.map((member, memberIdx) => (
                        <div key={memberIdx} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{member.emoji}</span>
                            <h5 className="font-medium text-sm">{member.role}</h5>
                          </div>
                          <div className="ml-6 space-y-2">
                            {member.tasks.map((task, taskIdx) => {
                              const assignment = getTaskAssignment(task.task, templateId);
                              const isAssigned = isTaskAssigned(task.task, templateId);
                              const isCurrentlyAssigning = assigningTask?.task === task.task && 
                                                         assigningTask?.templateId === templateId;

                              return (
                                <div key={taskIdx} className="flex items-center justify-between p-2 rounded border bg-muted/50">
                                  <span className="text-sm flex-1">{task.task}</span>
                                  
                                  {isCurrentlyAssigning ? (
                                    <div className="flex items-center gap-2 ml-2">
                                      <Input
                                        placeholder="@用戶名"
                                        value={assigneeInput}
                                        onChange={(e) => setAssigneeInput(e.target.value)}
                                        className="w-24 h-6 text-xs"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleSaveAssignee();
                                          } else if (e.key === 'Escape') {
                                            setAssigningTask(null);
                                            setAssigneeInput('');
                                          }
                                        }}
                                        autoFocus
                                      />
                                      <Button
                                        size="sm"
                                        onClick={handleSaveAssignee}
                                        className="h-6 px-2"
                                      >
                                        <Check className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setAssigningTask(null);
                                          setAssigneeInput('');
                                        }}
                                        className="h-6 px-2"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : isAssigned && assignment ? (
                                    <div className="flex items-center gap-2 ml-2">
                                      <Badge variant="secondary" className="text-xs">
                                        @{assignment.assignee}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRemoveAssignment(task.task, templateId)}
                                        className="h-6 px-2"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAssignTask(task.task, templateId, member.role)}
                                      className="h-6 px-2 ml-2"
                                    >
                                      <UserPlus className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}

              <Card className="p-4">
                <h4 className="font-semibold text-sm mb-3">自定義任務</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="輸入自定義任務..."
                      value={customTaskInput}
                      onChange={(e) => setCustomTaskInput(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="@指派給 (可選)"
                      value={customAssigneeInput}
                      onChange={(e) => setCustomAssigneeInput(e.target.value)}
                      className="w-32"
                    />
                    <Button
                      onClick={handleAddCustomTask}
                      disabled={!customTaskInput.trim()}
                    >
                      添加
                    </Button>
                  </div>

                  {customTasks.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {customTasks.map((task, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded border bg-muted/50">
                          <span className="text-sm flex-1">{task.task}</span>
                          {task.assignee && (
                            <Badge variant="secondary" className="text-xs">
                              @{task.assignee}
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCustomTasks(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="h-6 px-2 ml-2"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            複製協作連結
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSelectedTemplates([])}
          >
            返回選擇
          </Button>
          <Button
            onClick={onContinue}
            className="flex items-center gap-2"
          >
            完成協作設定
            <Hand className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <MemoDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        isSelected={selectedTemplate ? selectedTemplates.includes(selectedTemplate.id) : false}
        onToggleSelection={() => selectedTemplate && handleTemplateToggle(selectedTemplate.id)}
      />
    </div>
  );
};