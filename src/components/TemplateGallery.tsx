import { useState } from "react";
import { Star, Search, FileCode, MessageCircle, BarChart3, Mail, Globe, Lightbulb, Plus, Upload, Pencil, Copy, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const tabs = ["公开模板", "我收藏的", "我创建的"];

interface Template {
  title: string;
  desc: string;
  icon: typeof FileCode;
  stars: number;
  prompt: string;
}

const templates: Template[] = [
  {
    title: "代码审查",
    desc: "快速审查代码质量，发现潜在问题",
    icon: FileCode,
    stars: 128,
    prompt: "对 前端·代码进行代码审查，关注 {审查重点，如：性能、安全、代码规范等}，代码路径：{代码文件或目录路径}",
  },
  {
    title: "群聊总结",
    desc: "智能总结群聊记录，提取关键信息",
    icon: MessageCircle,
    stars: 96,
    prompt: "请总结以下群聊记录的关键信息，提取 {重点话题}，并列出待办事项和决策要点：{粘贴群聊内容}",
  },
  {
    title: "数据报告",
    desc: "自动生成数据分析报告",
    icon: BarChart3,
    stars: 84,
    prompt: "根据以下数据生成分析报告，包含 {分析维度，如：趋势、对比、异常检测}，数据来源：{数据描述或粘贴数据}",
  },
  {
    title: "邮件撰写",
    desc: "高效撰写专业商务邮件",
    icon: Mail,
    stars: 72,
    prompt: "撰写一封 {邮件类型，如：商务合作、项目汇报、会议邀请} 邮件，收件人：{收件人角色}，核心内容：{邮件要点}",
  },
  {
    title: "网页摘要",
    desc: "一键提取网页核心内容",
    icon: Globe,
    stars: 63,
    prompt: "请提取以下网页的核心内容并生成摘要，重点关注 {关注方向}，网页链接：{URL}",
  },
  {
    title: "创意方案",
    desc: "头脑风暴，激发创意灵感",
    icon: Lightbulb,
    stars: 51,
    prompt: "围绕 {主题或产品} 进行头脑风暴，从 {创意方向，如：用户体验、营销策略、技术创新} 角度提出 5 个创新方案",
  },
];

/** Render prompt text with {placeholder} highlighted */
function PromptContent({ prompt }: { prompt: string }) {
  const parts = prompt.split(/(\{[^}]+\})/g);
  return (
    <p className="text-sm text-foreground leading-relaxed">
      {parts.map((part, i) =>
        part.startsWith("{") && part.endsWith("}") ? (
          <span
            key={i}
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

interface TemplateGalleryProps {
  onSendTemplate?: (prompt: string) => void;
}

export function TemplateGallery({ onSendTemplate }: TemplateGalleryProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleCopy = () => {
    if (selectedTemplate) {
      navigator.clipboard.writeText(selectedTemplate.prompt);
    }
  };

  const handleSend = () => {
    if (selectedTemplate) {
      onSendTemplate?.(selectedTemplate.prompt);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索模板"
            className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-44"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Create Card */}
        <div className="p-4 rounded-xl border-2 border-dashed border-border bg-muted/30 hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Plus className="h-4 w-4" />
              创建模板
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              沉淀你的专属指令与经验，提升团队效率。
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button className="px-4 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors">
              创建
            </button>
            <button className="px-4 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors inline-flex items-center gap-1">
              <Upload className="h-3 w-3" />
              导入
            </button>
          </div>
        </div>

        {templates.map((t) => (
          <div
            key={t.title}
            onClick={() => setSelectedTemplate(t)}
            className="group p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-muted">
                <t.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                <span>{t.stars}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">{t.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Template Detail Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 flex flex-col max-h-[80vh]">
          {selectedTemplate && (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-xl font-bold text-foreground">{selectedTemplate.title}</h2>
                  <span className="px-2 py-0.5 rounded-md border border-border bg-muted text-xs text-muted-foreground">
                    公开
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    AI
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedTemplate.desc}
                  </p>
                </div>
              </div>

              {/* Prompt Content */}
              <div className="flex-1 overflow-auto px-6 py-6">
                <PromptContent prompt={selectedTemplate.prompt} />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-5 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors inline-flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  复制模板
                </button>
                <button
                  onClick={handleSend}
                  className="px-5 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  发送
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
