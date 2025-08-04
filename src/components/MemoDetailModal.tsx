import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pin, Clock, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetail {
  task: string;
  timeEstimate: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  selected?: boolean;
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
  detailedTeam?: TeamMemberDetail[];
}

interface MemoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ProgramTemplate | null;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export const MemoDetailModal = ({ 
  isOpen, 
  onClose, 
  template, 
  isSelected, 
  onToggleSelection 
}: MemoDetailModalProps) => {
  if (!template) return null;

  // Initialize task selection state - default all selected
  const [taskSelections, setTaskSelections] = React.useState<{[key: string]: boolean}>({});

  React.useEffect(() => {
    if (template?.detailedTeam) {
      const initialSelections: {[key: string]: boolean} = {};
      template.detailedTeam.forEach((member, memberIndex) => {
        member.tasks.forEach((task, taskIndex) => {
          const taskKey = `${memberIndex}-${taskIndex}`;
          initialSelections[taskKey] = true; // Default all selected
        });
      });
      setTaskSelections(initialSelections);
    }
  }, [template]);

  const toggleTaskSelection = (memberIndex: number, taskIndex: number) => {
    const taskKey = `${memberIndex}-${taskIndex}`;
    setTaskSelections(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {template.title} 詳細分工
          </DialogTitle>
        </DialogHeader>
        
        {/* Enlarged Memo Card */}
        <div className="relative">
          {/* Pin decoration */}
          <Pin className={cn(
            "absolute -top-4 -right-4 w-8 h-8 transform rotate-45 z-10",
            isSelected ? "text-red-500" : "text-slate-400"
          )} />
          
          {/* Large memo card */}
          <div className={cn(
            "p-8 rounded-lg border-2 shadow-xl",
            `bg-gradient-to-br ${template.color}`
          )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className={cn(
                  "text-3xl font-bold font-handwriting mb-3",
                  template.titleColor
                )}>
                  {template.title}
                </h2>
                
                {/* Examples */}
                <div className="mb-3">
                  <p className={cn("text-sm font-medium mb-2", template.titleColor)}>
                    🎯 適用例子：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.examples.map((example, index) => (
                      <Badge key={index} variant="outline" className={cn("text-xs", template.textColor)}>
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  {isSelected && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      已選擇
                    </Badge>
                  )}
                  <Badge variant="outline" className={cn("border-2", template.textColor)}>
                    {template.detailedTeam?.length || template.team.length} 個角色
                  </Badge>
                </div>
              </div>
              
              <Button
                onClick={onToggleSelection}
                variant={isSelected ? "destructive" : "default"}
                size="lg"
                className="ml-4"
              >
                {isSelected ? "取消選擇" : "選擇此範本"}
              </Button>
            </div>
            
            {/* Focus Areas */}
            <div className="mb-6">
              <h3 className={cn("text-lg font-bold mb-2", template.titleColor)}>
                🎯 重點處理範圍
              </h3>
              <p className={cn("text-base leading-relaxed", template.textColor)}>
                {template.focus}
              </p>
            </div>
            
            <Separator className="my-6" />
            
            {/* Processing Areas */}
            <div className="mb-6">
              <h3 className={cn("text-lg font-bold mb-4", template.titleColor)}>
                ⚙️ 四大處理重點
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.processingAreas.map((area, index) => (
                  <div key={index} className="bg-white/60 rounded-lg p-4 border border-white/40">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{area.icon}</span>
                      <h4 className={cn("font-bold text-sm", template.titleColor)}>
                        {area.label}
                      </h4>
                    </div>
                    <p className={cn("text-xs leading-relaxed", template.textColor)}>
                      {area.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-6" />
            
            {/* Detailed Team Breakdown */}
            <div>
              <h3 className={cn("text-lg font-bold mb-4", template.titleColor)}>
                👥 詳細分工建議
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(template.detailedTeam || []).map((member, index) => (
                  <div key={index} className="bg-white/50 rounded-lg p-4 border border-white/30">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <h4 className={cn("font-bold text-lg", template.titleColor)}>
                        {member.role}
                      </h4>
                    </div>
                    
                    <div className="space-y-2">
                      {member.tasks.map((task, taskIndex) => {
                        const taskKey = `${index}-${taskIndex}`;
                        const isTaskSelected = taskSelections[taskKey];
                        
                        return (
                          <div 
                            key={taskIndex} 
                            className={cn(
                              "rounded p-4 border cursor-pointer transition-all duration-200 text-center",
                              isTaskSelected 
                                ? "bg-white/70 border-white/40 hover:bg-white/80" 
                                : "bg-white/30 border-white/20 opacity-60 hover:bg-white/40"
                            )}
                            onClick={() => toggleTaskSelection(index, taskIndex)}
                          >
                            <div className="flex items-center justify-center gap-2 mb-2">
                              {isTaskSelected && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                              <p className={cn(
                                "text-sm font-medium",
                                template.textColor,
                                !isTaskSelected && "line-through"
                              )}>
                                {task.task}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            關閉
          </Button>
          <Button 
            onClick={() => {
              onToggleSelection();
              onClose();
            }}
            variant={isSelected ? "destructive" : "default"}
          >
            {isSelected ? "取消選擇並關閉" : "選擇並關閉"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};