import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ResourcePanelProps {
  title: string;
  content: string;
  onClose: () => void;
}

export function ResourcePanel({ title, content, onClose }: ResourcePanelProps) {
  return (
    <div className="h-full flex flex-col border-l border-border bg-background animate-in slide-in-from-right-5 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="text-sm font-medium text-foreground truncate">{title}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
