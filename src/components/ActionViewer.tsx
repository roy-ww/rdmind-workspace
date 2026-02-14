import { useState } from "react";
import { FileText, Search, FileCode, ChevronDown, ChevronRight, CheckCircle2, Loader2, AlertCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionItem {
  id: string;
  type: "read" | "search" | "generate" | "analyze" | "view";
  title: string;
  description: string;
  status: "pending" | "running" | "done" | "error";
  detail?: string;
  timestamp?: string;
}

const typeConfig: Record<ActionItem["type"], { icon: any; label: string; color: string }> = {
  read: { icon: FileText, label: "读取文件", color: "text-blue-500" },
  search: { icon: Search, label: "搜索", color: "text-amber-500" },
  generate: { icon: FileCode, label: "生成文件", color: "text-green-500" },
  analyze: { icon: Eye, label: "分析", color: "text-purple-500" },
  view: { icon: Eye, label: "查看", color: "text-cyan-500" },
};

const statusConfig: Record<ActionItem["status"], { icon: any; label: string; className: string }> = {
  pending: { icon: ChevronRight, label: "等待中", className: "text-muted-foreground" },
  running: { icon: Loader2, label: "执行中", className: "text-primary animate-spin" },
  done: { icon: CheckCircle2, label: "完成", className: "text-green-500" },
  error: { icon: AlertCircle, label: "失败", className: "text-destructive" },
};

function ActionCard({ action }: { action: ActionItem }) {
  const [expanded, setExpanded] = useState(action.status === "running");
  const typeInfo = typeConfig[action.type];
  const statusInfo = statusConfig[action.status];
  const TypeIcon = typeInfo.icon;
  const StatusIcon = statusInfo.icon;

  return (
    <div className={cn(
      "rounded-lg border border-border bg-card transition-colors",
      action.status === "running" && "border-primary/30 bg-primary/5"
    )}>
      <button
        onClick={() => action.detail && setExpanded(!expanded)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left"
      >
        <div className={cn("shrink-0", typeInfo.color)}>
          <TypeIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{typeInfo.label}</span>
            {action.timestamp && (
              <span className="text-[10px] text-muted-foreground/60">{action.timestamp}</span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground truncate">{action.title}</p>
          <p className="text-xs text-muted-foreground truncate">{action.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusIcon className={cn("h-4 w-4", statusInfo.className)} />
          {action.detail && (
            <ChevronDown className={cn(
              "h-3 w-3 text-muted-foreground transition-transform",
              !expanded && "-rotate-90"
            )} />
          )}
        </div>
      </button>
      {expanded && action.detail && (
        <div className="px-4 pb-3 border-t border-border/50 pt-2">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed bg-muted/50 rounded-md p-3 max-h-48 overflow-auto">
            {action.detail}
          </pre>
        </div>
      )}
    </div>
  );
}

interface ActionViewerProps {
  actions: ActionItem[];
}

export function ActionViewer({ actions }: ActionViewerProps) {
  const doneCount = actions.filter((a) => a.status === "done").length;
  const runningCount = actions.filter((a) => a.status === "running").length;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">动作视图</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {runningCount > 0 && (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                {runningCount} 执行中
              </span>
            )}
            <span>{doneCount}/{actions.length} 完成</span>
          </div>
        </div>
      </div>

      {/* Action list */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {actions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Eye className="h-8 w-8 opacity-30" />
            <p className="text-sm">等待 AI 执行动作…</p>
          </div>
        ) : (
          actions.map((action) => <ActionCard key={action.id} action={action} />)
        )}
      </div>
    </div>
  );
}
