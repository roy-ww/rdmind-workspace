import { useState, useRef, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { AIChatMessages, type ChatMessage } from "@/components/AIChatMessages";

const quickPrompts = ["快速生成今日日记", "总结本周项目进度", "整理知识库内容"];

function generateDemoResponse(userText: string): ChatMessage[] {
  return [
    { type: "user", content: userText },
    {
      type: "tool",
      content: "待处理笔记.md",
      toolName: "读取文件",
      toolResult: "成功读取，共 112 行",
    },
    {
      type: "tool",
      content: "项目A_规划.md",
      toolName: "搜索知识库",
      toolResult: "匹配到 3 篇相关文档",
    },
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

interface AIChatProps {
  className?: string;
}

export function AIChat({ className }: AIChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = (text: string) => {
    const msgs = generateDemoResponse(text);
    setChatMessages((prev) => [...prev, ...msgs]);
  };

  const hasMessages = chatMessages.length > 0;

  return (
    <div className={className || "w-80 border-l border-border bg-sidebar flex flex-col shrink-0 h-full"}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full brand-gradient flex items-center justify-center">
            <BookOpen className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {hasMessages ? "对话中" : "开始对话"}
          </span>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-auto hide-scrollbar min-h-0">
        <AIChatMessages messages={chatMessages} ref={chatEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 pb-2 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full border border-border bg-card text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input pinned to bottom */}
      <div className="p-3 shrink-0">
        <ChatInput
          compact
          onSend={handleSend}
          placeholder="发送消息给 Assistant"
        />
      </div>
    </div>
  );
}
