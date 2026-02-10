import { PenTool, Image, BarChart3, Code, AlertCircle } from "lucide-react";

const actions = [
  { label: "写作助手", icon: PenTool },
  { label: "绘图助手", icon: Image },
  { label: "数据分析", icon: BarChart3 },
  { label: "代码分析", icon: Code },
  { label: "问题排查", icon: AlertCircle },
];

export function QuickActions() {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {actions.map((action) => (
        <button
          key={action.label}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shadow-sm"
        >
          <action.icon className="h-3.5 w-3.5" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
