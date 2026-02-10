import { useState } from "react";
import { FolderOpen, Brain, Bot, ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LLM_OPTIONS = [
  { value: "gemini-3-flash", label: "Gemini 3 Flash" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "claude-sonnet-4", label: "Claude Sonnet 4" },
  { value: "deepseek-v3", label: "DeepSeek V3" },
  { value: "qwen-max", label: "Qwen Max" },
];

export function SettingsView() {
  const [knowledgePath, setKnowledgePath] = useState("/data/knowledge");
  const [showThinking, setShowThinking] = useState(true);
  const [defaultModel, setDefaultModel] = useState("gemini-3-flash");

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-background">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">设置</h1>
          <p className="text-sm text-muted-foreground mt-1">管理应用偏好和默认配置</p>
        </div>

        {/* Knowledge Directory */}
        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">知识目录</h2>
              <p className="text-xs text-muted-foreground">设置本地知识库文件的存储路径</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={knowledgePath}
              onChange={(e) => setKnowledgePath(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              placeholder="/path/to/knowledge"
            />
            <button className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors whitespace-nowrap">
              浏览…
            </button>
          </div>
        </section>

        {/* Thinking Process Toggle */}
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">展示思考过程</h2>
                <p className="text-xs text-muted-foreground">在 AI 回复中显示推理和思考步骤</p>
              </div>
            </div>
            <Switch checked={showThinking} onCheckedChange={setShowThinking} />
          </div>
        </section>

        {/* Default Model */}
        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">默认大模型</h2>
              <p className="text-xs text-muted-foreground">选择 AI 对话使用的默认语言模型</p>
            </div>
          </div>
          <Select value={defaultModel} onValueChange={setDefaultModel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              {LLM_OPTIONS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
