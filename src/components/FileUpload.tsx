import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AudioWaveform, Circle, CircleDot, Check, ChevronDown, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface FileUploadProps {
  expectedFileType: string;
  onUpload: (files: File[], metadata: any) => void;
}

interface AudioTrack {
  id: number;
  language?: string;
  isSelected: boolean;
  channelType: 'mono' | 'stereo' | 'surround';
  volumeLevel: number; // 0-100 for waveform height
}

interface DragState {
  isDragging: boolean;
  draggedLanguage: string | null;
  dropTarget: number | null;
}

export const FileUpload = ({ expectedFileType, onUpload }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [selectedDate, setSelectedDate] = useState("today");
  const [customDate, setCustomDate] = useState<Date>();
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedLanguage: null,
    dropTarget: null
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    setUploadedFiles(files);
    // Mock audio track detection with enhanced properties - no default languages
    const mockTracks: AudioTrack[] = [
      { id: 1, isSelected: true, channelType: "stereo", volumeLevel: 85 },
      { id: 2, isSelected: false, channelType: "stereo", volumeLevel: 72 },
      { id: 3, isSelected: false, channelType: "mono", volumeLevel: 68 },
      { id: 4, isSelected: false, channelType: "surround", volumeLevel: 45 }
    ];
    setAudioTracks(mockTracks);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setAudioTracks([]);
    }
  };

  const toggleTrackLanguage = (trackId: number, language: string) => {
    setAudioTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, language } : track
    ));
  };

  const toggleTrackSelection = (trackId: number) => {
    // First track cannot be unselected
    if (trackId === 1) return;
    
    setAudioTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, isSelected: !track.isSelected } : track
    ));
  };

  const updateTrackChannelType = (trackId: number, channelType: 'mono' | 'stereo' | 'surround') => {
    setAudioTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, channelType } : track
    ));
  };

  // Drag and drop handlers for language assignment
  const handleLanguageDragStart = (e: React.DragEvent, language: string) => {
    e.dataTransfer.setData("text/plain", language);
    setDragState({
      isDragging: true,
      draggedLanguage: language,
      dropTarget: null
    });
  };

  const handleLanguageDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedLanguage: null,
      dropTarget: null
    });
  };

  const handleTrackDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTrackDragEnter = (trackId: number) => {
    if (dragState.isDragging) {
      setDragState(prev => ({ ...prev, dropTarget: trackId }));
    }
  };

  const handleTrackDragLeave = () => {
    setDragState(prev => ({ ...prev, dropTarget: null }));
  };

  const handleTrackDrop = (e: React.DragEvent, trackId: number) => {
    e.preventDefault();
    const language = e.dataTransfer.getData("text/plain");
    if (language && LANGUAGE_OPTIONS.includes(language)) {
      // Auto-select track when language is assigned
      setAudioTracks(prev => prev.map(track => 
        track.id === trackId 
          ? { ...track, language, isSelected: true }
          : track
      ));
    }
    setDragState({
      isDragging: false,
      draggedLanguage: null,
      dropTarget: null
    });
  };

  const removeTrackLanguage = (trackId: number) => {
    setAudioTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { 
            ...track, 
            language: undefined, 
            // Only unselect if not the first track
            isSelected: trackId === 1 ? true : false 
          }
        : track
    ));
  };

  const handleUpload = () => {
    const metadata = {
      date: selectedDate,
      audioTracks: audioTracks.filter(track => track.isSelected),
      languages: audioTracks.filter(track => track.isSelected).map(track => track.language),
      channelTypes: audioTracks.filter(track => track.isSelected).map(track => track.channelType)
    };
    onUpload(uploadedFiles, metadata);
  };

  const LANGUAGE_OPTIONS = ["粵語", "英語", "普通話", "環境聲", "其他"];
  const CHANNEL_OPTIONS = [
    { value: 'mono', label: '單聲道', icon: <Circle className="w-3 h-3" /> },
    { value: 'stereo', label: '立體聲', icon: <div className="flex gap-1"><CircleDot className="w-3 h-3" /><CircleDot className="w-3 h-3" /></div> },
    { value: 'surround', label: '環繞聲', icon: <div className="flex gap-0.5"><Circle className="w-2 h-2" /><Circle className="w-2 h-2" /><Circle className="w-2 h-2" /><Circle className="w-2 h-2" /></div> }
  ];
  
  // Language color mapping
  const getLanguageColor = (language: string) => {
    const colors = {
      "粵語": "bg-emerald-500 text-white border-emerald-600",
      "英語": "bg-blue-500 text-white border-blue-600", 
      "普通話": "bg-red-500 text-white border-red-600",
      "環境聲": "bg-gray-500 text-white border-gray-600",
      "其他": "bg-violet-500 text-white border-violet-600"
    };
    return colors[language as keyof typeof colors] || colors["其他"];
  };

  // Channel type icon
  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case 'mono': return <Circle className="w-3 h-3" />;
      case 'stereo': return <div className="flex gap-1"><CircleDot className="w-3 h-3" /><CircleDot className="w-3 h-3" /></div>;
      case 'surround': return <div className="flex gap-0.5"><Circle className="w-2 h-2" /><Circle className="w-2 h-2" /><Circle className="w-2 h-2" /><Circle className="w-2 h-2" /></div>;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  // Generate static waveform bars
  const generateWaveform = () => {
    const bars = [];
    const heights = [24, 32, 28, 36, 30, 26, 34, 22]; // Static heights for consistent appearance
    for (let i = 0; i < 8; i++) {
      bars.push(
        <div
          key={i}
          className="bg-current transition-all duration-300"
          style={{
            width: '2px',
            height: `${heights[i]}px`,
            opacity: 0.7
          }}
        />
      );
    }
    return bars;
  };

  return (
    <div className="space-y-6">
      {uploadedFiles.length === 0 && (
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">📁</div>
          <h3 className="text-lg font-medium mb-2">拖入影片檔案</h3>
          <div className="text-primary text-sm">預期類型：{expectedFileType}</div>
        </div>
      )}

      {uploadedFiles.length === 0 && (
        <Card
          className={cn(
            "border-2 border-dashed p-8 text-center transition-all duration-300",
            dragActive && "border-primary bg-primary/5 scale-105"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-6 py-12">
            <div className="text-6xl text-muted-foreground">🎬</div>
            <div>
              <p className="text-xl font-medium mb-2">拖入或選擇影片</p>
              <p className="text-muted-foreground mb-6">
                支援 MP4, MOV, AVI 格式
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".mp4,.mov,.avi"
                onChange={handleFileInput}
              />
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-large hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-medium">
                <label htmlFor="file-upload" className="cursor-pointer px-8 py-3">
                  選擇檔案
                </label>
              </Button>
            </div>
          </div>
        </Card>
      )}


      {uploadedFiles.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* File List */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">📋 檔案收到了：</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  ❌
                </Button>
              </div>
            ))}
          </Card>

          {/* Date Selection */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">📅 錄製日期：</h4>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "today", label: "今天" },
                { value: "yesterday", label: "昨天" },
                { value: "dayBefore", label: "前天" }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={selectedDate === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDate(option.value)}
                >
                  {option.label}
                </Button>
              ))}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={selectedDate === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDate("custom")}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {selectedDate === "custom" && customDate 
                      ? format(customDate, "MM/dd") 
                      : "自選日期"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={(date) => {
                      setCustomDate(date);
                      if (date) setSelectedDate("custom");
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </Card>

          {/* Interactive Audio Tracks */}
          <Card className="p-6">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <AudioWaveform className="w-5 h-5 text-primary" />
              🗣️ 語言設定
            </h4>

            {/* Draggable Language Pool */}
            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h5 className="text-sm font-medium mb-3 text-muted-foreground">拖拽語言標籤到音軌卡片上</h5>
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map(language => (
                  <div
                    key={language}
                    draggable
                    onDragStart={(e) => handleLanguageDragStart(e, language)}
                    onDragEnd={handleLanguageDragEnd}
                    className={cn(
                      "px-3 py-2 rounded-full text-sm font-medium cursor-move transition-all duration-200",
                      "hover:scale-105 hover:shadow-md active:scale-95",
                      getLanguageColor(language),
                      dragState.draggedLanguage === language && "opacity-50 scale-95"
                    )}
                  >
                    {language}
                  </div>
                ))}
              </div>
              {dragState.isDragging && (
                <p className="text-xs text-muted-foreground mt-2">
                  正在拖拽 "{dragState.draggedLanguage}" - 放到音軌卡片上分配語言
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {audioTracks.map(track => (
                <Card
                  key={track.id}
                  className={cn(
                    "relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    track.isSelected 
                      ? "ring-2 ring-primary bg-primary/5 shadow-md" 
                      : "hover:bg-muted/50",
                    dragState.dropTarget === track.id && 
                      "ring-2 ring-blue-400 bg-blue-50 border-blue-300 border-dashed"
                  )}
                  onClick={() => toggleTrackSelection(track.id)}
                  onDragOver={handleTrackDragOver}
                  onDragEnter={() => handleTrackDragEnter(track.id)}
                  onDragLeave={handleTrackDragLeave}
                  onDrop={(e) => handleTrackDrop(e, track.id)}
                >
                  <CardContent className="p-4">
                    {/* Selection indicator */}
                    {track.isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    {/* Track header */}
                    <div className="mb-3">
                      <span className="font-semibold text-lg">音軌 {track.id}</span>
                    </div>
                    
                    {/* Waveform visualization */}
                    <div className="flex items-center gap-1 mb-4 h-12 justify-center">
                      {generateWaveform()}
                    </div>
                    
                    {/* Channel type selector */}
                    <div className="mb-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-2 gap-2 text-xs text-muted-foreground hover:text-foreground border border-border/50 hover:border-border w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {getChannelIcon(track.channelType)}
                            <span className="uppercase">{track.channelType}</span>
                            <ChevronDown className="w-3 h-3 ml-auto" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2" align="start">
                          <div className="space-y-1">
                            {CHANNEL_OPTIONS.map(option => (
                              <Button
                                key={option.value}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-full justify-start gap-2",
                                  track.channelType === option.value && "bg-primary/10"
                                )}
                                onClick={() => {
                                  updateTrackChannelType(track.id, option.value as 'mono' | 'stereo' | 'surround');
                                }}
                              >
                                {option.icon}
                                <span className="text-xs">{option.label}</span>
                                {track.channelType === option.value && (
                                  <Check className="w-3 h-3 ml-auto" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Language selector */}
                    {track.language ? (
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 justify-between",
                                getLanguageColor(track.language)
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{track.language}</span>
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2" align="start">
                            <div className="space-y-1">
                              {LANGUAGE_OPTIONS.map(lang => (
                                <Button
                                  key={lang}
                                  variant="ghost"
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start",
                                    track.language === lang && "bg-primary/10"
                                  )}
                                  onClick={() => {
                                    toggleTrackLanguage(track.id, lang);
                                  }}
                                >
                                  <div className={cn(
                                    "w-3 h-3 rounded-full mr-2",
                                    getLanguageColor(lang).split(' ')[0]
                                  )} />
                                  {lang}
                                  {track.language === lang && (
                                    <Check className="w-4 h-4 ml-auto" />
                                  )}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2 text-muted-foreground hover:text-destructive hover:border-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTrackLanguage(track.id);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center text-muted-foreground text-sm">
                        {dragState.dropTarget === track.id && dragState.draggedLanguage ? (
                          <span className="text-blue-600">放開以分配 "{dragState.draggedLanguage}"</span>
                        ) : (
                          <span>拖拽語言標籤到此處分配語言</span>
                        )}
                      </div>
                    )}
                    
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Selection summary */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                已選擇 {audioTracks.filter(t => t.isSelected).length} / {audioTracks.length} 個音軌
                {audioTracks.filter(t => t.isSelected && t.language).length > 0 && (
                  <span className="ml-2">
                    ({audioTracks.filter(t => t.isSelected && t.language).map(t => t.language).join(', ')})
                  </span>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-large hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 px-12 py-4 text-lg shadow-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-medium"
              disabled={audioTracks.filter(t => t.isSelected).length === 0}
            >
              🚀 開始處理
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};