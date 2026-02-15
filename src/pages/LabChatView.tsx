import { useState, useRef } from "react";
import { Lightbulb } from "lucide-react";
import { ChatInput, type ChatInputHandle } from "@/components/ChatInput";
import { AIChat } from "@/components/AIChat";
import { ResourcePanel } from "@/components/ResourcePanel";

export function LabChatView() {
  const [resource, setResource] = useState<{ title: string; content: string } | null>(null);
  const [started, setStarted] = useState(false);
  const chatInputRef = useRef<ChatInputHandle>(null);

  const handleFirstSend = (text: string) => {
    setStarted(true);
  };

  if (started) {
  return (
      <div className="flex-1 flex flex-col min-h-0 h-screen">
        {/* Lab Header */}
        <div className="shrink-0 border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3 max-w-3xl mx-auto w-full">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-foreground leading-tight">灵感源泉</h1>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                轻松获得海量灵感，包括派对活动、送礼、商务等方面的建议。
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="flex justify-center transition-all duration-300 flex-1">
            <AIChat
              className={`w-full flex flex-col h-full transition-all duration-300 ${resource ? "max-w-2xl" : "max-w-3xl"}`}
              onResourceClick={(title, content) => setResource({ title, content })}
            />
          </div>
          {resource && (
            <div className="w-[420px] shrink-0 h-full">
              <ResourcePanel
                title={resource.title}
                content={resource.content}
                onClose={() => setResource(null)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center overflow-auto">
      <div className="w-full max-w-3xl mx-auto px-6 flex flex-col gap-10">
        {/* Lab Branding */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">灵感源泉</h1>
          <p className="text-sm text-muted-foreground">
            轻松获得海量灵感，包括派对活动、送礼、商务等方面的建议。
          </p>
        </div>

        {/* Chat Input */}
        <ChatInput ref={chatInputRef} onSend={handleFirstSend} />

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {["派对策划灵感", "创意礼物推荐", "商务方案建议"].map((prompt) => (
            <button
              key={prompt}
              onClick={() => chatInputRef.current?.setContent(prompt)}
              className="px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
