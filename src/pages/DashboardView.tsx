import { Sparkles } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { QuickActions } from "@/components/QuickActions";
import { TemplateGallery } from "@/components/TemplateGallery";

export function DashboardView() {
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
        <ChatInput />

        {/* Quick Actions */}
        <QuickActions />

        {/* Template Gallery */}
        <TemplateGallery />
      </div>
    </div>
  );
}
