import { useState } from "react";
import { AIChat } from "@/components/AIChat";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ResourcePanel } from "@/components/ResourcePanel";

export function ChatEditorView() {
  const [resource, setResource] = useState<{ title: string; content: string } | null>(null);

  return (
    <div className="flex-1 flex min-h-0 h-screen">
      {/* Left: AI Chat */}
      <div className="flex-1 flex justify-center border-r border-border">
        <AIChat
          className="w-full flex flex-col h-full max-w-2xl"
          onResourceClick={(title, content) => setResource({ title, content })}
        />
      </div>

      {/* Right: Markdown Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <MarkdownEditor fileName="项目规划与任务管理.md" />
      </div>

      {/* Optional Resource Panel */}
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
  );
}
