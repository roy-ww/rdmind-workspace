import { useState, useRef, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { AIChatMessages, type ChatMessage } from "@/components/AIChatMessages";

const quickPrompts = ["快速生成今日日记", "总结本周项目进度", "整理知识库内容"];

function generateDemoResponse(userText: string): ChatMessage[] {
  return [
    { type: "user", content: userText },
    {
      type: "thinking",
      content: `正在分析用户的问题："${userText}"...\n\n1. 理解用户意图与上下文\n2. 确定需要调用的工具链\n3. 规划多步骤执行方案`,
    },
    {
      type: "ai",
      content: `好的，我来帮您处理这个问题。我需要先查阅一些相关资料。`,
    },
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
      type: "tool",
      content: "周报_2024W22.md",
      toolName: "读取文件",
      toolResult: "成功读取，共 58 行",
    },
    {
      type: "tool",
      content: "技术方案_v2.md",
      toolName: "语义检索",
      toolResult: "相关度 0.92，匹配 5 个段落",
    },
    {
      type: "ai",
      content: `根据我检索到的资料，为您整理如下：\n\n**核心发现：**\n- 项目当前处于 Q2 开发阶段，核心功能开发进度约 60%\n- 知识库 CRUD 和 Markdown 编辑器已基本完成\n- AI 对话集成模块正在开发中`,
    },
    {
      type: "ai",
      content: `**建议下一步行动：**\n1. 完善语义检索功能的技术方案\n2. 开始 AI 对话模块的原型开发\n3. 安排一次技术评审会议\n4. 补充单元测试覆盖率至 80% 以上`,
    },
    {
      type: "tool",
      content: "进度跟踪_Q2.xlsx",
      toolName: "读取文件",
      toolResult: "成功读取，共 24 行",
    },
    {
      type: "tool",
      content: "团队成员_任务分配.md",
      toolName: "搜索知识库",
      toolResult: "匹配到 2 篇相关文档",
    },
    {
      type: "ai",
      content: `经过进一步分析，我找到了更详细的进度数据。以下是各模块的完成情况：`,
    },
    {
      type: "ai",
      content: `### 📊 项目各模块详细进度报告

| 模块名称 | 负责人 | 计划完成日期 | 当前进度 | 状态 |
|---------|--------|------------|---------|------|
| 知识库 CRUD | 张三 | 2024-06-15 | 95% | ✅ 即将完成 |
| Markdown 编辑器 | 李四 | 2024-06-20 | 88% | 🔄 进行中 |
| AI 对话集成 | 王五 | 2024-07-10 | 45% | 🔄 进行中 |
| 语义检索引擎 | 赵六 | 2024-07-05 | 60% | 🔄 进行中 |
| 用户权限系统 | 孙七 | 2024-06-30 | 72% | 🔄 进行中 |
| 文件存储服务 | 周八 | 2024-06-25 | 80% | 🔄 进行中 |
| 数据可视化 | 吴九 | 2024-07-15 | 30% | ⚠️ 需加速 |
| API 网关 | 郑十 | 2024-07-01 | 55% | 🔄 进行中 |

#### 📌 关键风险点
- **数据可视化模块**进度偏慢，建议增派人手或调整优先级
- **AI 对话集成**依赖语义检索引擎，需确保后者按时交付
- 整体项目健康度评分：**7.5 / 10**

#### 💡 优化建议
1. 将「知识库 CRUD」的剩余工作尽快收尾，释放张三支援数据可视化
2. 语义检索与 AI 对话两个模块建议做一次联合技术评审，减少集成风险
3. 建议每周五增加 30 分钟 stand-up 会议，聚焦跨模块依赖问题

如需了解某个模块的更多细节，或需要我生成甘特图，请随时告诉我。`,
    },
  ];
}

interface AIChatProps {
  className?: string;
  externalPrompt?: string;
  onExternalPromptConsumed?: () => void;
}

export function AIChat({ className, externalPrompt, onExternalPromptConsumed }: AIChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (externalPrompt) {
      handleSend(externalPrompt);
      onExternalPromptConsumed?.();
    }
  }, [externalPrompt]);

  const isSendingRef = useRef(false);

  const handleSend = async (text: string) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;
    abortRef.current = false;
    setIsStreaming(true);
    const msgs = generateDemoResponse(text);
    for (const msg of msgs) {
      if (abortRef.current) break;
      setChatMessages((prev) => [...prev, msg]);
      await new Promise((r) => setTimeout(r, 500));
    }
    setIsStreaming(false);
    isSendingRef.current = false;
  };

  const handleStop = () => {
    abortRef.current = true;
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
        <AIChatMessages messages={chatMessages} ref={chatEndRef} isLoading={isStreaming} />
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
          isLoading={isStreaming}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
