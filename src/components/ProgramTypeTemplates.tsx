import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROGRAM_TEMPLATES = [
  {
    id: "news",
    title: "🗞️ 時事新聞／評論類",
    examples: ["自由風自由Phone", "星期六問責", "新聞天地"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "主持開場、議題重點、來賓意見、聽眾來電、總結評論" },
      { icon: "📝", label: "文字稿", content: "金句語錄、政策解讀、觀點對比、社會爭議" },
      { icon: "📱", label: "社媒素材", content: "議題精華短片、資料圖表、討論焦點卡片" },
      { icon: "🔍", label: "關鍵字標籤", content: "時政人物、焦點政策、社會熱話" }
    ],
    team: [
      { role: "📹 剪輯師", tasks: "新聞重點剪輯、聽眾來電整理" },
      { role: "✍️ 時事記者", tasks: "觀點提煉、事實核查" },
      { role: "🎨 視覺設計", tasks: "政策對比圖、時事資訊卡" },
      { role: "📱 社媒專員", tasks: "網上話題包裝、焦點推廣" }
    ]
  },
  {
    id: "culture",
    title: "🎨 文化藝術／人物專訪類",
    examples: ["講東講西", "我們一直都在說故事", "藝術家專題"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "作品介紹段落、嘉賓訪問、創作展示" },
      { icon: "📝", label: "文字稿", content: "藝術家語錄、作品意義、文化背景" },
      { icon: "📱", label: "社媒素材", content: "訪談重點片段、創作賞析、名言金句" },
      { icon: "🔍", label: "關鍵字標籤", content: "藝術家姓名、作品名稱、藝術類型" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "重點訪談＋創作片段" },
      { role: "✍️ 文化記者", tasks: "背景分析＋深度整理" },
      { role: "🎨 設計師", tasks: "藝術宣傳圖＋故事圖像化" },
      { role: "📱 社媒專員", tasks: "深度人物推廣＋專訪精華分享" }
    ]
  },
  {
    id: "music",
    title: "🎵 音樂娛樂／流行榜類",
    examples: ["中文歌曲龍虎榜", "Made in Hong Kong", "輕談淺唱不夜天"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "音樂播放環節、榜單介紹、歌手互動" },
      { icon: "📝", label: "文字稿", content: "歌曲創作背景、歌手語錄、音樂趨勢" },
      { icon: "📱", label: "社媒素材", content: "MV短片、音樂榜單視覺化、流行精選剪輯" },
      { icon: "🔍", label: "關鍵字標籤", content: "歌手名稱、歌曲標題、流行音樂類型" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "熱門片段＋Live演出" },
      { role: "✍️ 音樂記者", tasks: "流行分析＋新碟資料整理" },
      { role: "🎨 設計師", tasks: "榜單圖像＋藝人宣傳設計" },
      { role: "📱 社媒專員", tasks: "音樂精華推廣＋榜單內容分享" }
    ]
  },
  {
    id: "lifestyle",
    title: "🏡 生活資訊／服務類",
    examples: ["精靈一點", "長者健康之道", "投資新世代"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "專家貼士、實用建議、聽眾參與段落" },
      { icon: "📝", label: "文字稿", content: "重點資訊、建議要點、生活數據摘要" },
      { icon: "📱", label: "社媒素材", content: "健康貼士圖表、理財資訊卡" },
      { icon: "🔍", label: "關鍵字標籤", content: "生活主題、專家姓名、知識分類" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "貼士剪輯＋實用段落" },
      { role: "✍️ 生活記者", tasks: "指引內容＋知識整理" },
      { role: "🎨 設計師", tasks: "資訊圖卡＋健康視覺" },
      { role: "📱 社媒專員", tasks: "生活建議推廣＋資訊重點包裝" }
    ]
  },
  {
    id: "travel",
    title: "🌏 旅遊／國際視野類",
    examples: ["旅遊樂園", "我要走天涯", "The Pulse", "Backchat"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "目的地介紹、旅遊體驗、國際觀察段落" },
      { icon: "📝", label: "文字稿", content: "旅遊感受、全球趨勢、異地故事" },
      { icon: "📱", label: "社媒素材", content: "旅遊精華短片、世界地圖圖示、景點推介" },
      { icon: "🔍", label: "關鍵字標籤", content: "旅遊地點、國家名稱、國際議題" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "遊歷故事＋旅遊片段" },
      { role: "✍️ 旅遊／國際記者", tasks: "異地分析＋文化觀察" },
      { role: "🎨 設計師", tasks: "地圖＋景點圖片" },
      { role: "📱 社媒專員", tasks: "國際內容分享＋旅遊推廣" }
    ]
  },
  {
    id: "opera",
    title: "🎭 戲曲／傳統文化類",
    examples: ["戲曲之夜", "粵曲天地", "晚間粵曲"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "經典演出、藝人介紹、曲藝故事" },
      { icon: "📝", label: "文字稿", content: "曲目背景、戲曲名句、文化傳承" },
      { icon: "📱", label: "社媒素材", content: "經典片段、曲藝知識、藝人故事" },
      { icon: "🔍", label: "關鍵字標籤", content: "曲目名稱、戲曲流派、傳統文化" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "戲曲片段＋名段精華" },
      { role: "✍️ 文化記者", tasks: "曲藝介紹＋藝人資料" },
      { role: "🎨 設計師", tasks: "戲曲主題視覺＋文化推廣圖" },
      { role: "📱 社媒專員", tasks: "戲曲推介＋歷史故事散播" }
    ]
  },
  {
    id: "games",
    title: "🎲 互動娛樂／遊戲類",
    examples: ["鬥秀場", "守下留情", "三五成群"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "開場、遊戲環節、互動討論" },
      { icon: "📝", label: "文字稿", content: "互動對話、遊戲規則、聽眾反應" },
      { icon: "📱", label: "社媒素材", content: "趣味短片、互動精華、遊戲花絮" },
      { icon: "🔍", label: "關鍵字標籤", content: "節目主題、遊戲名稱、娛樂類型" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "趣味段落＋互動精華" },
      { role: "✍️ 娛樂記者", tasks: "有趣內容整理" },
      { role: "🎨 設計師", tasks: "遊戲視覺＋趣味圖卡" },
      { role: "📱 社媒專員", tasks: "娛樂推廣＋爆笑短片" }
    ]
  },
  {
    id: "documentary",
    title: "📚 專題／紀實／教育類",
    examples: ["香港故事", "獅子山下", "CIBS社區計劃"],
    focus: [
      { icon: "⏰", label: "時間索引", content: "故事開端、人物描寫、重要事件" },
      { icon: "📝", label: "文字稿", content: "真實故事、教育信息、深度分析" },
      { icon: "📱", label: "社媒素材", content: "紀實剪輯、人物片段、教育展示" },
      { icon: "🔍", label: "關鍵字標籤", content: "主角名稱、社會事件、教育主題" }
    ],
    team: [
      { role: "🎵 剪輯師", tasks: "故事精華＋人物訪談" },
      { role: "✍️ 專題記者", tasks: "深度分析＋內容梳理" },
      { role: "🎨 設計師", tasks: "紀實圖像＋教育圖卡" },
      { role: "📱 社媒專員", tasks: "故事推廣＋教育資源分享" }
    ]
  }
];

interface ProgramTypeTemplatesProps {
  selectedType?: string;
  onSelectTemplate: (template: any) => void;
}

export const ProgramTypeTemplates = ({ selectedType, onSelectTemplate }: ProgramTypeTemplatesProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">📻 電台節目工作分配範本</h3>
        <p className="text-muted-foreground">選擇最適合的節目類型範本</p>
      </div>

      <div className="grid gap-6">
        {PROGRAM_TEMPLATES.map(template => (
          <Card 
            key={template.id}
            className={cn(
              "p-6 cursor-pointer transition-all duration-300 hover:shadow-medium",
              selectedType === template.id && "border-primary bg-primary/5"
            )}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h4 className="text-lg font-semibold mb-2">{template.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {template.examples.map((example, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-3">重點處理：</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {template.focus.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <span className="font-medium">{item.label}：</span>
                        <span className="text-muted-foreground">{item.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Assignment */}
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-3">建議分工：</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {template.team.map((member, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div>
                        <span className="font-medium text-primary">{member.role}：</span>
                        <span className="text-muted-foreground">{member.tasks}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedType === template.id && (
                <div className="pt-3 border-t">
                  <Button className="w-full bg-gradient-primary">
                    使用此範本
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};