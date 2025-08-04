import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  expectedFileType: string;
  onUpload: (files: File[], metadata: any) => void;
}

interface AudioTrack {
  id: number;
  language: string;
  isSelected: boolean;
}

export const FileUpload = ({ expectedFileType, onUpload }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [selectedDate, setSelectedDate] = useState("today");

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
    // Mock audio track detection
    const mockTracks: AudioTrack[] = [
      { id: 1, language: "粵語", isSelected: true },
      { id: 2, language: "英語", isSelected: false },
      { id: 3, language: "普通話", isSelected: false },
      { id: 4, language: "環境聲", isSelected: false }
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
    setAudioTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, isSelected: !track.isSelected } : track
    ));
  };

  const handleUpload = () => {
    const metadata = {
      date: selectedDate,
      audioTracks: audioTracks.filter(track => track.isSelected),
      languages: audioTracks.filter(track => track.isSelected).map(track => track.language)
    };
    onUpload(uploadedFiles, metadata);
  };

  const LANGUAGE_OPTIONS = ["粵語", "英語", "普通話", "環境聲", "其他"];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">📁</div>
        <h3 className="text-lg font-medium mb-2">拖入影片檔案</h3>
        <div className="text-primary text-sm">預期類型：{expectedFileType}</div>
      </div>

      <Card
        className={cn(
          "border-2 border-dashed p-8 text-center transition-all duration-300",
          dragActive && "border-primary bg-primary/5 scale-105",
          uploadedFiles.length > 0 && "border-success bg-success/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadedFiles.length === 0 ? (
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
              <Button asChild size="lg" className="bg-gradient-primary">
                <label htmlFor="file-upload" className="cursor-pointer px-8 py-3">
                  選擇檔案
                </label>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            <div className="text-3xl text-success">✨</div>
            <p className="text-lg font-medium text-success">檔案收到了！</p>
          </div>
        )}
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* File List */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">📊 檔案檢測：</h4>
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
            <div className="flex gap-2">
              {[
                { value: "today", label: "今天" },
                { value: "yesterday", label: "昨天" },
                { value: "dayBefore", label: "前天" },
                { value: "custom", label: "自選日期" }
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
            </div>
          </Card>

          {/* Audio Tracks */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">🎵 音軌：偵測到 {audioTracks.length} 個音軌</h4>
            <div className="space-y-3">
              {audioTracks.map(track => (
                <div key={track.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Checkbox
                    checked={track.isSelected}
                    onCheckedChange={() => toggleTrackSelection(track.id)}
                  />
                  <span className="font-medium">音軌 {track.id}</span>
                  <div className="flex gap-2">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <Button
                        key={lang}
                        variant={track.language === lang ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTrackLanguage(track.id, lang)}
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={handleUpload}
              size="lg"
              className="bg-gradient-primary hover:scale-105 transition-transform px-12 py-4 text-lg"
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