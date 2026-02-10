import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileSearch,
  Languages,
  ListChecks,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { FileTree } from "@/components/FileTree";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { AIChat } from "@/components/AIChat";

const features = [
  "24小时在线的智能管家，随时回答你的问题",
  "基于知识库的精准检索和智能问答",
  "支持多种文档格式，自动解析和索引",
  "上下文感知的对话体验",
];

const useCases = [
  {
    icon: Sparkles,
    title: "总结文档要点",
    prompt: "请帮我总结当前知识库中所有文档的核心要点，按主题分类整理",
  },
  {
    icon: FileSearch,
    title: "跨文档检索",
    prompt: "在知识库中搜索所有与项目规划相关的内容，并整理成时间线",
  },
  {
    icon: Languages,
    title: "翻译文档内容",
    prompt: "请将当前文档翻译为英文，保留原有的格式和结构",
  },
  {
    icon: ListChecks,
    title: "提取待办事项",
    prompt: "从知识库的所有文档中提取待办事项和行动项，按优先级排列",
  },
  {
    icon: MessageSquare,
    title: "生成会议纪要",
    prompt: "根据知识库中的项目文档，生成一份本周项目进展的会议纪要模板",
  },
  {
    icon: Lightbulb,
    title: "知识关联分析",
    prompt: "分析知识库中各文档之间的关联关系，找出知识盲区并给出补充建议",
  },
];

export function KnowledgeBaseView() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string>("");

  const handleUseCaseClick = (prompt: string) => {
    setPendingPrompt(prompt);
  };

  return (
    <div className="flex-1 flex min-h-0 h-screen">
      {/* Secondary Sidebar - File Tree */}
      <div className="w-64 border-r border-border bg-sidebar flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">知识目录</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <span>~</span>
            <ChevronRight className="h-3 w-3" />
            <span>rdmind_workspace</span>
            <ChevronRight className="h-3 w-3" />
            <span>docs_studio</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto hide-scrollbar p-2">
          <FileTree onFileSelect={setSelectedFile} selectedFile={selectedFile} />
        </div>
      </div>

      {/* Main Content */}
      {selectedFile ? (
        <MarkdownEditor fileName={selectedFile} />
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div className="text-center max-w-lg space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                AI 智库 - 你的第二大脑
              </h2>
              <p className="text-sm text-muted-foreground">
                将你的知识组织起来，让 AI 帮你管理和检索
              </p>
            </div>
            <div className="space-y-3 text-left">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60">
              选择左侧目录中的文件开始使用，或在右侧面板与 AI 助手对话
            </p>

            {/* Use Case Cards */}
            <div className="grid grid-cols-2 gap-3 text-left pt-2">
              {useCases.map((uc) => (
                <button
                  key={uc.title}
                  onClick={() => handleUseCaseClick(uc.prompt)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <uc.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {uc.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {uc.prompt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Assistant Chat */}
      <AIChat
        externalPrompt={pendingPrompt}
        onExternalPromptConsumed={() => setPendingPrompt("")}
      />
    </div>
  );
}