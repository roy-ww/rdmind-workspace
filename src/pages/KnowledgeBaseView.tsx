import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
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

export function KnowledgeBaseView() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

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
          <div className="text-center max-w-md space-y-6">
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
          </div>
        </div>
      )}

      {/* Right Panel - Assistant Chat */}
      <AIChat />
    </div>
  );
}
