import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Share, Users, Calendar, Mic, FileAudio, Pin, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollaborationMemoProps {
  analysisData: {
    template: string;
    focus: string;
    teamRoles: Array<{
      role: string;
      tasks: string[];
    }>;
  };
  archiveData: {
    metadata: {
      date?: string;
      customDate?: Date;
      audioTracks?: Array<{
        id: string;
        language: string;
        fileName: string;
      }>;
    };
    uploadedFiles: File[];
  };
  onContinue: () => void;
}

export const CollaborationMemo = ({ analysisData, archiveData, onContinue }: CollaborationMemoProps) => {
  const [colleagueEmail, setColleagueEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
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

    // Mock sharing functionality
    toast({
      title: "分享成功",
      description: `已將工作範本發送給 ${colleagueEmail}`,
    });
    setColleagueEmail("");
    setShareMessage("");
  };

  const formatDate = () => {
    if (archiveData.metadata.customDate) {
      return archiveData.metadata.customDate.toLocaleDateString('zh-TW');
    }
    return archiveData.metadata.date === 'today' ? '今天' : '昨天';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Memo Header with Pin */}
      <div className="relative">
        <Pin className="absolute -top-2 -right-2 text-slate-400 transform rotate-45 w-6 h-6" />
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-amber-200 shadow-lg transform rotate-0.5">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-amber-600 transform -rotate-12" />
                <h2 className="text-2xl font-bold text-amber-900 font-handwriting">
                  工作協作備忘錄
                </h2>
              </div>
              <div className="text-sm text-amber-700 font-mono bg-amber-100 px-2 py-1 rounded">
                {new Date().toLocaleDateString('zh-TW')}
              </div>
            </div>

            <Separator className="bg-amber-300 mb-4" />

            {/* Project Info Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                項目資訊
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    錄製日期: {formatDate()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    節目類型: {analysisData.template}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800">檔案數量: {archiveData.uploadedFiles.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800">
                    音軌語言: {archiveData.metadata.audioTracks?.map(track => track.language).join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-amber-300 mb-4" />

            {/* Processing Template Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">處理流程範本</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="mb-3">
                  <h4 className="font-medium text-amber-900 mb-2">重點處理方向:</h4>
                  <p className="text-amber-800 text-sm leading-relaxed">{analysisData.focus}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-amber-900 mb-2">建議分工:</h4>
                  <div className="space-y-2">
                    {analysisData.teamRoles.map((role, index) => (
                      <div key={index} className="bg-white border border-amber-200 rounded p-3">
                        <h5 className="font-medium text-amber-900 mb-1">{role.role}</h5>
                        <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                          {role.tasks.map((task, taskIndex) => (
                            <li key={taskIndex}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-amber-300 mb-4" />

            {/* Collaboration Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                協作分享
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Copy Link */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">複製項目連結</h4>
                  <p className="text-sm text-amber-700 mb-3">分享此項目連結給相關同事</p>
                  <Button 
                    onClick={handleCopyLink}
                    variant="outline" 
                    className="w-full bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    複製連結
                  </Button>
                </div>

                {/* Share to Colleague */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">@ 分享給同事</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="輸入同事郵箱"
                      value={colleagueEmail}
                      onChange={(e) => setColleagueEmail(e.target.value)}
                      className="bg-white border-amber-300"
                    />
                    <Input
                      placeholder="添加備註訊息 (可選)"
                      value={shareMessage}
                      onChange={(e) => setShareMessage(e.target.value)}
                      className="bg-white border-amber-300"
                    />
                    <Button 
                      onClick={handleShareToColleague}
                      variant="outline"
                      className="w-full bg-white border-amber-300 text-amber-800 hover:bg-amber-100"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      發送範本
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-amber-300 mb-4" />

            {/* Action Footer */}
            <div className="flex justify-end">
              <Button 
                onClick={onContinue}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                完成協作設定
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};