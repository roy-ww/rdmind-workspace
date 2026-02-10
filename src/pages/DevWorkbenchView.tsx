import { useState } from "react";
import {
  Code,
  GitBranch,
  FolderOpen,
  ChevronRight,
  ShieldCheck,
  FileSearch,
  FileText,
  Bug,
} from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { cn } from "@/lib/utils";

const projects = [
  { id: "rdmind-studio", name: "RDMind Studio", lang: "TypeScript", updated: "2 小时前" },
  { id: "api-gateway", name: "API Gateway", lang: "Go", updated: "1 天前" },
  { id: "data-pipeline", name: "Data Pipeline", lang: "Python", updated: "3 天前" },
  { id: "mobile-app", name: "Mobile App", lang: "Dart", updated: "1 周前" },
  { id: "infra-config", name: "Infra Config", lang: "Terraform", updated: "2 周前" },
];

const devTools = [
  {
    id: "code-analysis",
    icon: FileSearch,
    label: "代码分析",
    desc: "分析代码结构、复杂度和依赖关系",
    color: "text-blue-500",
  },
  {
    id: "code-review",
    icon: GitBranch,
    label: "Code Review",
    desc: "自动审查代码变更，发现潜在问题",
    color: "text-green-500",
  },
  {
    id: "prd-analysis",
    icon: FileText,
    label: "PRD 分析",
    desc: "解析产品需求文档，生成技术方案",
    color: "text-amber-500",
  },
  {
    id: "security-analysis",
    icon: ShieldCheck,
    label: "安全分析",
    desc: "扫描代码安全漏洞和合规性检查",
    color: "text-red-500",
  },
];

export function DevWorkbenchView() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <div className="flex-1 flex min-h-0 h-screen">
      {/* Left - Project List */}
      <div className="w-64 border-r border-border bg-sidebar flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">项目列表</h3>
          <p className="text-xs text-muted-foreground mt-0.5">选择一个项目开始工作</p>
        </div>
        <div className="flex-1 overflow-auto hide-scrollbar p-2 space-y-0.5">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={cn(
                "flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left transition-colors group",
                selectedProject === project.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <FolderOpen className="h-4 w-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{project.name}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>{project.lang}</span>
                  <span>·</span>
                  <span>{project.updated}</span>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Right - Chat + Dev Tools */}
      <div className="flex-1 flex flex-col items-center overflow-auto">
        <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Code className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">开发工作台</h1>
            <p className="text-sm text-muted-foreground">
              {selectedProject
                ? `当前项目：${projects.find((p) => p.id === selectedProject)?.name}`
                : "选择一个项目，或直接开始对话"}
            </p>
          </div>

          {/* Chat Input */}
          <ChatInput placeholder="描述你的开发需求，例如：分析这个模块的代码结构" />

          {/* Dev Tools Grid */}
          <div className="w-full grid grid-cols-2 gap-3">
            {devTools.map((tool) => (
              <button
                key={tool.id}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/20 transition-colors text-left group"
              >
                <div className={cn("mt-0.5 shrink-0", tool.color)}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {tool.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {tool.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
