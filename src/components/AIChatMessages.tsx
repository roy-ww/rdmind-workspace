import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Brain,
  FileText,
  Search,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

export interface ChatMessage {
  type: "user" | "thinking" | "ai" | "tool";
  content: string;
  toolName?: string;
  toolResult?: string;
  toolDetail?: string;
}

function ToolCallBlock({ msg }: { msg: ChatMessage }) {
  return (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs text-muted-foreground hover:bg-muted/60 transition-colors group">
        {msg.toolName === "读取文件" ? (
          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
        ) : (
          <Search className="h-3.5 w-3.5 text-primary shrink-0" />
        )}
        <span className="font-medium text-foreground">{msg.toolName}</span>
        <span className="text-muted-foreground">·</span>
        <span>{msg.content}</span>
        <span className="ml-auto text-muted-foreground/70 flex items-center gap-1">
          {msg.toolResult}
          <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
        </span>
      </CollapsibleTrigger>
      {msg.toolDetail && (
        <CollapsibleContent>
          <div className="mt-1 ml-5 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-auto">
            {msg.toolDetail}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

interface AIChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export const AIChatMessages = forwardRef<HTMLDivElement, AIChatMessagesProps>(
  ({ messages, isLoading }, ref) => {
    if (messages.length === 0) {
      return (
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
      );
    }

    return (
      <div className="space-y-3">
        {messages.map((msg, i) => {
          if (msg.type === "user") {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-primary text-primary-foreground text-xs leading-relaxed">
                  {msg.content}
                </div>
              </div>
            );
          }
          if (msg.type === "tool") {
            return <ToolCallBlock key={i} msg={msg} />;
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
              <div className="max-w-[95%] rounded-2xl rounded-bl-sm px-4 py-3 bg-muted text-foreground text-sm leading-relaxed prose prose-sm prose-neutral dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-xs text-muted-foreground">正在回复...</span>
          </div>
        )}
        <div ref={ref} />
      </div>
    );
  }
);

AIChatMessages.displayName = "AIChatMessages";
