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
      <div className="w-full max-w-3xl mx-auto px-6 py-16 flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">RDMind</h1>
          <p className="text-muted-foreground">欢迎来到工作空间</p>
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
