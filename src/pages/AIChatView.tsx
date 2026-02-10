import { useState, useRef, useEffect } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { AIChatMessages, type ChatMessage } from "@/components/AIChatMessages";

function generateDemoResponse(userText: string): ChatMessage[] {
  return [
    { type: "user", content: userText },
    {
      type: "thinking",
      content: `正在分析问题："${userText}"...\n\n1. 理解用户意图\n2. 检索相关知识\n3. 组织回答结构`,
    },
    {
      type: "ai",
      content: `这是对您问题的回答：\n\n**关于「${userText}」**\n\n我已经仔细分析了您的问题，以下是我的建议：\n\n1. 首先，明确核心目标和约束条件\n2. 其次，拆解问题为可执行的子任务\n3. 最后，逐步验证每个环节的输出质量\n\n如需进一步探讨，请随时提问。`,
    },
  ];
}

export function AIChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    const msgs = generateDemoResponse(text);
    setMessages((prev) => [...prev, ...msgs]);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat area */}
      <div className="flex-1 overflow-auto hide-scrollbar min-h-0">
        {hasMessages ? (
          <div className="max-w-2xl mx-auto px-6 py-8">
            <AIChatMessages messages={messages} ref={chatEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">有什么可以帮你的？</h1>
              <p className="text-sm text-muted-foreground">输入任何问题，开始与 AI 对话</p>
            </div>
          </div>
        )}
      </div>

      {/* Input pinned to bottom */}
      <div className="shrink-0 border-t border-border bg-background px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput onSend={handleSend} placeholder="输入你的问题..." />
        </div>
      </div>
    </div>
  );
}
