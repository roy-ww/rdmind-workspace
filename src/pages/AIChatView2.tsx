import { useState } from "react";
import { AIChat } from "@/components/AIChat";
import { ResourcePanel } from "@/components/ResourcePanel";

export function AIChatView2() {
  const [resource, setResource] = useState<{ title: string; content: string } | null>(null);

  return (
    <div className="flex-1 flex min-h-0 h-screen">
      <div className={`flex justify-center transition-all duration-300 ${resource ? "flex-1" : "flex-1"}`}>
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
  );
}
