import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { ChatInput, type ChatInputHandle } from "@/components/ChatInput";
import { QuickActions } from "@/components/QuickActions";
import { TemplateGallery } from "@/components/TemplateGallery";

export function DashboardView() {
  const chatInputRef = useRef<ChatInputHandle>(null);

  const handleSendTemplate = (prompt: string, templateName: string) => {
    chatInputRef.current?.setTemplateContent(templateName, prompt);
  };

  return (
    <div className="flex-1 flex flex-col items-center overflow-auto">
      <div className="w-full max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8">
        {/* Header */}
        <div className="w-full space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-base text-muted-foreground">你好，欢迎回来</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">需要我为你做些什么？</h1>
        </div>

        {/* Chat Input */}
        <ChatInput ref={chatInputRef} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Template Gallery */}
        <TemplateGallery onSendTemplate={handleSendTemplate} />
      </div>
    </div>
  );
}
