import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Pin, Paperclip, CheckCircle, Users, UserPlus, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MemoDetailModal } from "./MemoDetailModal";

// Team member suggestions with roles
const TEAM_MEMBERS = [
  { id: '@張剪輯', name: '張剪輯', role: '剪輯師', emoji: '🎬' },
  { id: '@李記者', name: '李記者', role: '記者', emoji: '📰' },
  { id: '@王設計', name: '王設計', role: '設計師', emoji: '🎨' },
  { id: '@陳社媒', name: '陳社媒', role: '社媒專員', emoji: '📱' },
  { id: '@林文化', name: '林文化', role: '文化記者', emoji: '🎭' },
  { id: '@黃音樂', name: '黃音樂', role: '音樂記者', emoji: '🎵' },
  { id: '@趙旅遊', name: '趙旅遊', role: '旅遊記者', emoji: '✈️' },
  { id: '@吳生活', name: '吳生活', role: '生活記者', emoji: '🏡' }
];

// Program Templates Data - keeping existing structure
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
          { task: '創作片段編輯', timeEstimate: '1.5小時', priority: 'high' as const }
        ]
      },
      {
        role: '✍️ 文化記者',
        emoji: '🎭',
        tasks: [
          { task: '背景分析', timeEstimate: '2小時', priority: 'high' as const },
          { task: '深度整理', timeEstimate: '1.5小時', priority: 'high' as const }
        ]
      }
    ]
  }
];

interface TaskAssignment {
  taskId: string;
  assignedTo: string[];
}

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
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROGRAM_TEMPLATES[0] | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [showAssignInput, setShowAssignInput] = useState<string | null>(null);
  const [assignInput, setAssignInput] = useState('');
  const { toast } = useToast();

  const handleCopyMessage = async () => {
    const selectedTemplateNames = selectedTemplates.map(id => 
      PROGRAM_TEMPLATES.find(t => t.id === id)?.title
    ).filter(Boolean);

    const followUpTasks = getFollowUpTasks();
    
    // Format message with assignments
    let message = `📋 工作協作備忘錄 (${new Date().toLocaleDateString('zh-TW')})\n\n`;
    message += `已選範本：${selectedTemplateNames.join('、')}\n\n`;
    message += `🎯 跟進事項：\n`;
    
    followUpTasks.forEach((task, index) => {
      const assignment = taskAssignments.find(a => a.taskId === task.id);
      const assignedText = assignment && assignment.assignedTo.length > 0 
        ? ` (${assignment.assignedTo.join(' ')})` 
        : '';
      message += `${index + 1}. ${task.task}${assignedText}\n`;
    });

    // Add team assignment summary
    const allAssignedMembers = new Set<string>();
    taskAssignments.forEach(assignment => {
      assignment.assignedTo.forEach(member => allAssignedMembers.add(member));
    });
    
    if (allAssignedMembers.size > 0) {
      message += `\n👥 協作成員：${Array.from(allAssignedMembers).join(' ')}\n`;
    }

    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "訊息已複製",
        description: "協作備忘錄已複製到剪貼板，包含所有指派信息",
      });
    } catch (err) {
      toast({
        title: "複製失敗",
        description: "無法複製訊息，請手動複製",
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

  // Extract follow-up tasks from selected templates with unique IDs
  const getFollowUpTasks = () => {
    const allTasks: Array<{id: string, task: string, priority: string, timeEstimate: string, templateId: string}> = [];
    
    selectedTemplates.forEach(templateId => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === templateId);
      if (template?.detailedTeam) {
        template.detailedTeam.forEach(teamMember => {
          teamMember.tasks.forEach((task, taskIndex) => {
            const taskId = `${templateId}-${teamMember.role}-${taskIndex}`;
            allTasks.push({
              id: taskId,
              task: task.task,
              priority: task.priority,
              timeEstimate: task.timeEstimate,
              templateId
            });
          });
        });
      }
    });
    
    return allTasks;
  };

  const handleAssignTask = (taskId: string) => {
    setShowAssignInput(taskId);
    setAssignInput('');
  };

  const handleConfirmAssignment = (taskId: string) => {
    if (!assignInput.trim()) return;
    
    // Parse @ mentions
    const mentions = assignInput.match(/@\w+/g) || [];
    const validMentions = mentions.filter(mention => 
      TEAM_MEMBERS.some(member => member.id === mention)
    );

    if (validMentions.length > 0) {
      setTaskAssignments(prev => {
        const existing = prev.find(a => a.taskId === taskId);
        if (existing) {
          return prev.map(a => 
            a.taskId === taskId 
              ? { ...a, assignedTo: [...new Set([...a.assignedTo, ...validMentions])] }
              : a
          );
        } else {
          return [...prev, { taskId, assignedTo: validMentions }];
        }
      });
    }

    setShowAssignInput(null);
    setAssignInput('');
  };

  const handleRemoveAssignment = (taskId: string, memberToRemove: string) => {
    setTaskAssignments(prev => 
      prev.map(a => 
        a.taskId === taskId 
          ? { ...a, assignedTo: a.assignedTo.filter(m => m !== memberToRemove) }
          : a
      ).filter(a => a.assignedTo.length > 0)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const selectedTemplateNames = selectedTemplates.map(id => 
    PROGRAM_TEMPLATES.find(t => t.id === id)?.title
  ).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Integrated Layout - Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Template Selection */}
        <div className="lg:col-span-2">
          {/* Memo Header */}
          <div className="relative mb-6">
            <Pin className="absolute -top-3 -right-3 text-slate-400 transform rotate-45 w-8 h-8 z-10" />
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-6 h-6 text-amber-600 transform -rotate-12" />
                    <h1 className="text-2xl font-bold text-amber-900 font-handwriting">
                      工作協作備忘錄
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={handleCopyMessage}
                      variant="outline" 
                      size="sm"
                      className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
                      disabled={selectedTemplates.length === 0}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      複製訊息
                    </Button>
                    
                    <div className="text-sm text-amber-700 font-mono bg-amber-100 px-3 py-1 rounded">
                      {new Date().toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-amber-700">
                  已選擇 {selectedTemplates.length} / {PROGRAM_TEMPLATES.length} 個流程
                </div>
              </div>
            </Card>
          </div>

          {/* Template Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {PROGRAM_TEMPLATES.map((template, index) => {
              const isSelected = selectedTemplates.includes(template.id);
              const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
              
              return (
                <div key={template.id} className="relative">
                  <Pin className={cn(
                    "absolute -top-2 -right-1 w-5 h-5 transform rotate-45 z-10",
                    isSelected ? "text-red-500" : "text-slate-400"
                  )} />
                  
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg p-4 h-32 group relative overflow-hidden",
                      rotation,
                      `bg-gradient-to-br ${template.color}`,
                      isSelected && "ring-2 ring-amber-400 shadow-lg scale-105 -rotate-0"
                    )}
                    onClick={() => handleTemplateToggle(template.id)}
                    onDoubleClick={() => handleMemoDoubleClick(template)}
                  >
                    <div className="h-full flex flex-col">
                      {isSelected && (
                        <div className="absolute top-2 left-2 z-10">
                          <CheckCircle className="w-5 h-5 text-green-600 bg-white rounded-full" />
                        </div>
                      )}
                      
                      <h3 className={cn(
                        "text-sm font-bold font-handwriting mb-2 leading-tight",
                        template.titleColor
                      )}>
                        {template.title}
                      </h3>
                      
                      <div className="flex-1">
                        <p className={cn("text-xs leading-tight", template.textColor)}>
                          {template.focus}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Follow-up Tasks & Assignments */}
        <div className="lg:col-span-1">
          {selectedTemplates.length > 0 && (
            <>
              {/* Selected Templates Summary */}
              <Card className="mb-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                <div className="p-4">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">
                    📋 已選範本
                  </h3>
                  <div className="space-y-2">
                    {selectedTemplateNames.map((name, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Follow-up Tasks with Assignments */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg">
                <div className="p-4">
                  <h3 className="text-lg font-bold text-green-900 font-handwriting mb-4">
                    🎯 跟進事項
                  </h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFollowUpTasks().map((task, index) => {
                      const assignment = taskAssignments.find(a => a.taskId === task.id);
                      const isAssigning = showAssignInput === task.id;
                      
                      return (
                        <div key={task.id} className="p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <Badge className={cn("text-xs px-2 py-0.5", getPriorityColor(task.priority))}>
                                  {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                                </Badge>
                              </div>
                              <p className="text-green-800 font-medium text-sm">{task.task}</p>
                              <p className="text-green-600 text-xs mt-1">預估時間：{task.timeEstimate}</p>
                            </div>
                            
                            {!isAssigning && (
                              <Button
                                onClick={() => handleAssignTask(task.id)}
                                size="sm"
                                variant="outline"
                                className="text-xs px-2 py-1"
                              >
                                <UserPlus className="w-3 h-3 mr-1" />
                                指派
                              </Button>
                            )}
                          </div>

                          {/* Assignment Input */}
                          {isAssigning && (
                            <div className="mt-2 p-2 bg-gray-50 rounded border">
                              <Input
                                value={assignInput}
                                onChange={(e) => setAssignInput(e.target.value)}
                                placeholder="輸入 @同事ID，例如：@張剪輯 @李記者"
                                className="text-xs mb-2"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleConfirmAssignment(task.id);
                                  }
                                }}
                              />
                              <div className="flex flex-wrap gap-1 mb-2">
                                {TEAM_MEMBERS.map(member => (
                                  <Button
                                    key={member.id}
                                    onClick={() => setAssignInput(prev => prev + (prev ? ' ' : '') + member.id)}
                                    size="sm"
                                    variant="outline"
                                    className="text-xs px-2 py-1 h-6"
                                  >
                                    {member.emoji} {member.name}
                                  </Button>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleConfirmAssignment(task.id)}
                                  size="sm"
                                  className="text-xs px-3 py-1 h-6"
                                >
                                  確認
                                </Button>
                                <Button
                                  onClick={() => setShowAssignInput(null)}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-3 py-1 h-6"
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Assigned Members */}
                          {assignment && assignment.assignedTo.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {assignment.assignedTo.map((memberID, idx) => {
                                const member = TEAM_MEMBERS.find(m => m.id === memberID);
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    <span>{member?.emoji}</span>
                                    <span>{memberID}</span>
                                    <button
                                      onClick={() => handleRemoveAssignment(task.id, memberID)}
                                      className="ml-1 text-blue-600 hover:text-red-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {getFollowUpTasks().length === 0 && (
                    <p className="text-green-700 text-center py-8 italic text-sm">
                      請先選擇範本以查看跟進事項
                    </p>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end mt-8">
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
