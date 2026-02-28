import { useRef } from "react";
import {
  Cloud,
  Zap,
  MessageSquare,
  PenTool,
  BookOpen,
  Code,
  BarChart3,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { ChatInput, type ChatInputHandle } from "@/components/ChatInput";

const quickActions = [
  { label: "智能问答", icon: MessageSquare, color: "text-blue-500" },
  { label: "写作助手", icon: PenTool, color: "text-violet-500" },
  { label: "代码分析", icon: Code, color: "text-emerald-500" },
  { label: "数据洞察", icon: BarChart3, color: "text-amber-500" },
  { label: "AI 智库", icon: BookOpen, color: "text-rose-500" },
  { label: "排障助手", icon: Zap, color: "text-cyan-500" },
];

const stats = [
  { label: "今日对话", value: "128", delta: "+12%", icon: MessageSquare },
  { label: "活跃用户", value: "2.4k", delta: "+5.3%", icon: Users },
  { label: "任务完成", value: "89%", delta: "+2.1%", icon: Activity },
  { label: "知识条目", value: "3,821", delta: "+8 新增", icon: TrendingUp },
];

export function CloudDashboardView() {
  const chatInputRef = useRef<ChatInputHandle>(null);

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden px-8 pt-10 pb-8 border-b border-border">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, hsl(217 91% 55% / 0.12), transparent)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              <span>RDMind Cloud</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">
            你好，今天想探索什么？
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            云端 AI 工作台，让每一个想法都触手可及
          </p>
          {/* Chat Input */}
          <ChatInput ref={chatInputRef} placeholder="输入你的问题，或选择下方快捷功能..." />
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-8 py-5 border-b border-border">
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 p-3.5 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-3.5 w-3.5 text-primary/60" />
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-emerald-500 font-medium pb-0.5">{stat.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">快捷功能</h2>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
              <span>查看全部</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                  style={{ background: "var(--cloud-gradient-soft, hsl(217 91% 55% / 0.1))" }}
                >
                  <action.icon className={`h-4.5 w-4.5 ${action.color}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 ml-auto text-muted-foreground/0 group-hover:text-primary/60 transition-all -translate-x-1 group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="px-8 pb-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-foreground mb-4">最近活动</h2>
          <div className="space-y-2">
            {[
              { text: "使用写作助手完成了季度报告", time: "10 分钟前", icon: PenTool },
              { text: "在 AI 智库中添加了 3 条知识条目", time: "1 小时前", icon: BookOpen },
              { text: "完成了 API Gateway 的代码审查", time: "2 小时前", icon: Code },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card text-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="flex-1 text-foreground">{item.text}</span>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
