import { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Send,
  ChevronRight,
  ChevronDown,
  Brain,
} from "lucide-react";
import { FileTree } from "@/components/FileTree";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const features = [
  "24小时在线的智能管家，随时回答你的问题",
  "基于知识库的精准检索和智能问答",
  "支持多种文档格式，自动解析和索引",
  "上下文感知的对话体验",
];

const quickPrompts = ["快速生成今日日记", "总结本周项目进度", "整理知识库内容"];

interface ChatMessage {
  type: "user" | "thinking" | "ai";
  content: string;
}

function generateDemoResponse(userText: string): ChatMessage[] {
  return [
    { type: "user", content: userText },
    {
      type: "thinking",
      content: `正在分析用户的问题："${userText}"...\n\n1. 检索知识库中的相关文档\n2. 匹配到 3 篇相关文档\n3. 综合分析文档内容与用户问题的关联性\n4. 生成结构化回答`,
    },
    {
      type: "ai",
      content: `根据您的知识库内容，我为您整理了以下信息：\n\n**核心发现：**\n- 项目当前处于 Q2 开发阶段，核心功能开发进度约 60%\n- 知识库 CRUD 和 Markdown 编辑器已基本完成\n- AI 对话集成模块正在开发中\n\n**建议下一步行动：**\n1. 完善语义检索功能的技术方案\n2. 开始 AI 对话模块的原型开发\n3. 安排一次技术评审会议\n\n如需了解更多细节，请随时提问。`,
    },
  ];
}

export function KnowledgeBaseView() {
  const [assistantInput, setAssistantInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    const text = assistantInput.trim();
    if (!text) return;
    setAssistantInput("");
    const msgs = generateDemoResponse(text);
    setChatMessages((prev) => [...prev, ...msgs]);
  };

  return (
    <div className="flex-1 flex min-h-0">
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
        <div className="flex-1 overflow-auto p-2">
          <FileTree onFileSelect={setSelectedFile} selectedFile={selectedFile} />
        </div>
      </div>

      {/* Main Content */}
      {selectedFile ? (
        <MarkdownEditor fileName={selectedFile} />
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
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
      <div className="w-80 border-l border-border bg-sidebar flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full brand-gradient flex items-center justify-center">
              <BookOpen className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {chatMessages.length > 0 ? "对话中" : "开始对话"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-3 overflow-auto">
          {chatMessages.length === 0 ? (
            <div className="space-y-3">
              {[
                "访问当前文档相关的问题，获取精准回答",
                "请求总结、翻译或改写文档内容",
                "基于知识库进行跨文档检索和问答",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2">
                  <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, i) => {
                if (msg.type === "user") {
                  return (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-primary text-primary-foreground text-xs leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  );
                }
                if (msg.type === "thinking") {
                  return (
                    <Collapsible key={i} defaultOpen={false}>
                      <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group w-full">
                        <Brain className="h-3 w-3" />
                        <span className="italic">思考过程</span>
                        <ChevronDown className="h-3 w-3 ml-auto transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-1.5 rounded-lg bg-muted/50 border border-border px-3 py-2 text-xs text-muted-foreground italic whitespace-pre-line leading-relaxed">
                          {msg.content}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }
                return (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-muted text-foreground text-xs leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setAssistantInput(prompt)}
                className="px-2.5 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <input
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="发送消息给 Assistant"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none text-foreground"
            />
            <button
              onClick={handleSend}
              className="p-1.5 rounded-md brand-gradient text-primary-foreground"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
