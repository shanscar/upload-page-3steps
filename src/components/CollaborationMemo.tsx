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
    examples: ['千禧年代', '自由風自由Phone', '星期六問責', '新聞天地', '今日立法會', '晨早新聞專輯', '政正關你事 - 為人民服務', '鏗鏘集', '日新多面睇（普通話台）', '凝聚香港（電視）', '時事摘錄（電視）'],
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
    examples: ['講東講西', '我們一直都在說故事', '裝腔啟示錄', '不完美受害人', '學人沙龍', '舊日的足跡', '港樂- 講樂', '「字」從遇見你', '典故裏的科學', '澳門雙行線'],
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
    examples: ['中文歌曲龍虎榜', 'Made in Hong Kong 李志剛', '輕談淺唱不夜天', '音樂情人', '音樂中年', '音樂說（Let The Music Speak）', '經典重溫', '瘋SHOW快活人', '終身美麗', '演藝盛薈- 開放舞台'],
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
    examples: ['精靈一點', '長者健康之道', '投資新世代', '香江暖流', '社區生活線', '晨光第一線', '開心家庭', '彩虹早晨', '星期日家加樂', '普出校園（普通話台）', '醫生與你', '謝謝你醫生', '生活- 健康- 資訊- 體育- 港式速遞'],
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
    examples: ['旅遊樂園', '我要走天涯', 'Backchat', 'The Pulse', 'Money Talk', 'The Close', 'Hong Kong Today', '灣區全媒睇', '走進東盟 II', '31看世界'],
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
    examples: ['戲曲之夜', '粵曲天地', '晚間粵曲', '星期五粵曲夜', 'Night Music 長夜細聽', 'Simply Classical 就是古典', 'Cantilena 自投羅網'],
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
    examples: ['鬥秀場', '守下留情', '三五成群', '周末午夜場', '生活日常', '下午紅人館（普通話台）', '開心朋友仔（普通話台）', 'After Hours with Michael Lance', 'Weekend Sunrise', 'Brunch with Noreen'],
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
    examples: ['香港故事', '獅子山下', 'CIBS社區參與廣播計劃', '走過青春', '教學有心人', '中華知識王', '人類足跡', '替代食物', '守護天堂', '承歡記', '你安全嗎？', 'BobieLand（兒童節目）', '快樂魔法森林（兒童節目）', '恐龍萌遊記（兒童節目）', '大自然生態人'],
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
          { task: '紀實片段剪輯' },
          { task: '教育內容編輯' },
          { task: '專題故事製作' }
        ]
      },
      {
        role: '✍️ 專題記者',
        emoji: '🔍',
        tasks: [
          { task: '深度調研' },
          { task: '專題撰寫' },
          { task: '事實驗證' }
        ]
      },
      {
        role: '🎨 設計師',
        emoji: '📊',
        tasks: [
          { task: '專題視覺設計' },
          { task: '教育圖表製作' },
          { task: '紀實包裝設計' }
        ]
      },
      {
        role: '📱 社媒專員',
        emoji: '📚',
        tasks: [
          { task: '教育內容推廣' },
          { task: '專題分享' },
          { task: '知識社群維護' }
        ]
      }
    ]
  }
];

// Interfaces
interface CollaborationMemoProps {
  analysisData?: any;
  archiveData?: any;
  onContinue: (data: any) => void;
}

interface SentStatus {
  [key: string]: boolean;
}

const CollaborationMemo = ({ analysisData, archiveData, onContinue }: CollaborationMemoProps) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [taskAssignments, setTaskAssignments] = useState<{[key: string]: string}>({});
  const [customTasks, setCustomTasks] = useState<Array<{id: string, task: string, assignee?: string}>>([]);
  const [newTask, setNewTask] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [assigningTask, setAssigningTask] = useState<string | null>(null);
  const [assigneeInput, setAssigneeInput] = useState('');
  const [sentStatuses, setSentStatuses] = useState<SentStatus>({});
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    const followUpTasks = getFollowUpTasks();
    const projectUrl = "https://radio-content-hub.lovableproject.com";
    
    let message = `🎙️ 電台內容協作計劃\n\n`;
    message += `💻 專案連結: ${projectUrl}\n\n`;
    
    if (followUpTasks.length > 0) {
      message += `📋 指派任務：\n`;
      followUpTasks.forEach((task, index) => {
        const assignee = taskAssignments[task.id] || '待指派';
        message += `${index + 1}. ${task.task}${assignee !== '待指派' ? ` - ${assignee}` : ''}\n`;
      });
    }
    
    if (customTasks.length > 0) {
      message += `\n🔧 自定義任務：\n`;
      customTasks.forEach((task, index) => {
        message += `${index + 1}. ${task.task}${task.assignee ? ` - ${task.assignee}` : ''}\n`;
      });
    }
    
    message += `\n🚀 讓我們開始協作吧！`;
    
    navigator.clipboard.writeText(message);
    toast({
      title: "複製成功",
      description: "協作連結已複製到剪貼板",
    });
  };

  const handleSendNotification = () => {
    const followUpTasks = getFollowUpTasks();
    const allTasks = [...followUpTasks, ...customTasks];
    
    const assignedTasks = allTasks.filter(task => {
      const assignee = 'assignee' in task ? task.assignee : taskAssignments[task.id];
      return assignee && assignee !== '待指派';
    });
    
    if (assignedTasks.length === 0) {
      toast({
        title: "提醒",
        description: "請至少指派一個任務才能發送通知",
        variant: "destructive"
      });
      return;
    }
    
    let message = `🎙️ 電台內容製作通知\n\n`;
    message += `您有新的任務指派：\n\n`;
    
    assignedTasks.forEach((task, index) => {
      const assignee = 'assignee' in task ? task.assignee : taskAssignments[task.id];
      message += `📌 ${task.task}\n`;
      message += `👤 負責人：${assignee}\n\n`;
    });
    
    message += `💻 請前往協作平台查看詳細資訊並開始工作\n`;
    message += `🔗 https://radio-content-hub.lovableproject.com`;
    
    navigator.clipboard.writeText(message);
    
    // Mark all assigned tasks as sent
    const newSentStatuses = { ...sentStatuses };
    assignedTasks.forEach(task => {
      newSentStatuses[task.id] = true;
    });
    setSentStatuses(newSentStatuses);
    
    toast({
      title: "通知已複製",
      description: "團隊通知訊息已複製到剪貼板，請發送給相關成員",
    });
    
    // Continue to next step
    onContinue({
      selectedTemplates: selectedTemplates,
      taskAssignments: taskAssignments,
      customTasks: customTasks,
      type: 'collaboration-memo'
    });
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleMemoDoubleClick = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleAssignTask = (taskId: string) => {
    setAssigningTask(taskId);
    setAssigneeInput(taskAssignments[taskId] || '');
  };

  const handleSaveAssignee = (taskId: string) => {
    if (assigneeInput.trim()) {
      setTaskAssignments(prev => ({
        ...prev,
        [taskId]: assigneeInput.trim()
      }));
    } else {
      setTaskAssignments(prev => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    }
    setAssigningTask(null);
    setAssigneeInput('');
  };

  const handleCancelAssign = () => {
    setAssigningTask(null);
    setAssigneeInput('');
  };

  const handleRemoveAssignment = (taskId: string) => {
    setTaskAssignments(prev => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
    
    setSentStatuses(prev => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
  };

  const handleAddCustomTask = () => {
    if (newTask.trim()) {
      const taskId = `custom-${Date.now()}`;
      setCustomTasks(prev => [...prev, {
        id: taskId,
        task: newTask.trim(),
        assignee: newAssignee.trim() || undefined
      }]);
      setNewTask('');
      setNewAssignee('');
    }
  };

  const getFollowUpTasks = () => {
    const tasks: Array<{id: string, task: string, templateTitle: string, role: string}> = [];
    
    selectedTemplates.forEach(templateId => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        template.detailedTeam.forEach(teamMember => {
          teamMember.tasks.forEach((task, taskIndex) => {
            tasks.push({
              id: `${templateId}-${teamMember.role}-${taskIndex}`,
              task: task.task,
              templateTitle: template.title,
              role: teamMember.role
            });
          });
        });
      }
    });
    
    return tasks;
  };

  const getPrioritizedTasks = () => {
    return getFollowUpTasks();
  };

  if (selectedTemplates.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">協作備忘錄</h2>
          <p className="text-lg text-gray-600">選擇適合的節目類別，開始團隊協作</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAM_TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                "bg-gradient-to-br", template.color
              )}
              onClick={() => handleTemplateToggle(template.id)}
              onDoubleClick={() => handleMemoDoubleClick(template)}
            >
              <div className="p-6">
                <h3 className={cn("text-lg font-semibold mb-4", template.titleColor)}>
                  {template.title}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className={cn("text-sm font-medium", template.textColor)}>重點：</span>
                    <p className={cn("text-sm mt-1", template.textColor)}>{template.focus}</p>
                  </div>
                  
                  <div>
                    <span className={cn("text-sm font-medium", template.textColor)}>團隊角色：</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.team.map((role, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <span className={cn("text-xs", template.textColor)}>
                    雙擊查看詳細資訊
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <MemoDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          template={selectedTemplate}
          isSelected={selectedTemplate ? selectedTemplates.includes(selectedTemplate.id) : false}
          onToggleSelection={selectedTemplate ? () => handleTemplateToggle(selectedTemplate.id) : () => {}}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">協作備忘錄</h2>
        <p className="text-gray-600">管理選定的節目類別和任務指派</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Selected Templates */}
        <div className="lg:col-span-1">
          <Card className="h-fit">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">已選節目類別</h3>
                <Badge variant="secondary">{selectedTemplates.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {selectedTemplates.map(templateId => {
                  const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                  if (!template) return null;
                  
                  return (
                    <Card key={templateId} className={cn("bg-gradient-to-br", template.color)}>
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <h4 className={cn("font-medium text-sm", template.titleColor)}>
                            {template.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTemplateToggle(templateId)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {template.team.map((role, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <Button 
                onClick={() => setSelectedTemplates([])}
                variant="outline" 
                className="w-full"
                disabled={selectedTemplates.length === 0}
              >
                清除全部選擇
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Tabbed Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="processing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="processing">重點處理範疇</TabsTrigger>
              <TabsTrigger value="tasks">任務指派</TabsTrigger>
            </TabsList>
            
            <TabsContent value="processing" className="space-y-4">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">重點處理範疇總覽</h3>
                  
                  {selectedTemplates.map(templateId => {
                    const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                    if (!template) return null;
                    
                    return (
                      <div key={templateId} className="mb-6 last:mb-0">
                        <h4 className={cn("font-medium text-base mb-3", template.titleColor)}>
                          {template.title}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {template.processingAreas.map((area, index) => (
                            <Card key={index} className="border-l-4 border-l-blue-400">
                              <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">{area.icon}</span>
                                  <span className="font-medium text-sm">{area.label}</span>
                                </div>
                                <p className="text-sm text-gray-600">{area.content}</p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">任務指派管理</h3>
                    <div className="flex gap-2">
                      <Button onClick={handleCopyLink} variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        複製連結
                      </Button>
                      <Button onClick={handleSendNotification} size="sm">
                        <Hand className="h-4 w-4 mr-2" />
                        發送通知
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tasks from selected templates */}
                  <div className="space-y-4">
                    {selectedTemplates.map(templateId => {
                      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
                      if (!template) return null;
                      
                      return (
                        <div key={templateId}>
                          <h4 className={cn("font-medium text-base mb-3", template.titleColor)}>
                            {template.title}
                          </h4>
                          
                          <div className="space-y-3">
                            {template.detailedTeam.map((teamMember, teamIndex) => (
                              <div key={teamIndex}>
                                <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                                  <span>{teamMember.emoji}</span>
                                  {teamMember.role}
                                </h5>
                                
                                <div className="space-y-2 ml-6">
                                  {teamMember.tasks.map((task, taskIndex) => {
                                    const taskId = `${templateId}-${teamMember.role}-${taskIndex}`;
                                    const isAssigned = taskAssignments[taskId];
                                    const isSent = sentStatuses[taskId];
                                    
                                    return (
                                      <div key={taskIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <div className="flex-1">
                                          <span className="text-sm">{task.task}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                          {assigningTask === taskId ? (
                                            <div className="flex items-center gap-2">
                                              <Input
                                                value={assigneeInput}
                                                onChange={(e) => setAssigneeInput(e.target.value)}
                                                placeholder="輸入負責人"
                                                className="w-32 h-8"
                                                onKeyPress={(e) => {
                                                  if (e.key === 'Enter') {
                                                    handleSaveAssignee(taskId);
                                                  }
                                                }}
                                              />
                                              <Button
                                                onClick={() => handleSaveAssignee(taskId)}
                                                size="sm"
                                                className="h-8 px-2"
                                              >
                                                <Check className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                onClick={handleCancelAssign}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-2"
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <>
                                              {isAssigned ? (
                                                <div className="flex items-center gap-2">
                                                  <Badge variant={isSent ? "default" : "secondary"} className="text-xs">
                                                    {isAssigned}
                                                    {isSent && <CheckCircle className="h-3 w-3 ml-1" />}
                                                  </Badge>
                                                  <Button
                                                    onClick={() => handleRemoveAssignment(taskId)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                  >
                                                    <X className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              ) : (
                                                <Button
                                                  onClick={() => handleAssignTask(taskId)}
                                                  variant="outline"
                                                  size="sm"
                                                  className="h-8 px-2"
                                                >
                                                  <UserPlus className="h-3 w-3" />
                                                </Button>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Custom Task Addition */}
                  <Separator className="my-6" />
                  
                  <div>
                    <h4 className="font-medium text-base mb-3">新增自定義任務</h4>
                    
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="輸入任務內容"
                        className="flex-1"
                      />
                      <Input
                        value={newAssignee}
                        onChange={(e) => setNewAssignee(e.target.value)}
                        placeholder="負責人 (可選)"
                        className="w-32"
                      />
                      <Button 
                        onClick={handleAddCustomTask}
                        disabled={!newTask.trim()}
                      >
                        新增
                      </Button>
                    </div>
                    
                    {customTasks.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-gray-700">自定義任務</h5>
                        {customTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                            <Paperclip className="h-4 w-4 text-blue-600" />
                            <div className="flex-1">
                              <span className="text-sm">{task.task}</span>
                            </div>
                            {task.assignee && (
                              <Badge variant="secondary" className="text-xs">
                                {task.assignee}
                              </Badge>
                            )}
                            <Button
                              onClick={() => setCustomTasks(prev => prev.filter(t => t.id !== task.id))}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MemoDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        isSelected={selectedTemplate ? selectedTemplates.includes(selectedTemplate.id) : false}
        onToggleSelection={selectedTemplate ? () => handleTemplateToggle(selectedTemplate.id) : () => {}}
      />
    </div>
  );
};

export default CollaborationMemo;