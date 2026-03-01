import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  BookOpen,
  PenTool,
  Code,
  Settings,
  Plus,
  User,
  Star,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Zap,
  LayoutDashboard,
  ChevronRight,
  Monitor,
  History,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const mockHistory = [
  { id: "1", title: "总结本周项目进度", time: "10 分钟前", category: "智能问答" },
  { id: "2", title: "API Gateway 代码审查", time: "2 小时前", category: "代码分析" },
  { id: "3", title: "Q2 季度报告写作", time: "昨天", category: "写作助手" },
  { id: "4", title: "数据库性能优化方案", time: "昨天", category: "排障助手" },
  { id: "5", title: "用户权限系统设计", time: "2 天前", category: "智能问答" },
  { id: "6", title: "前端性能瓶颈分析", time: "3 天前", category: "排障助手" },
  { id: "7", title: "知识库内容整理", time: "上周", category: "AI 智库" },
  { id: "8", title: "微服务架构迁移计划", time: "上周", category: "写作助手" },
];

interface CloudSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems = [
  { id: "home", label: "控制台", icon: LayoutDashboard },
  { id: "qa", label: "智能问答", icon: MessageSquare },
  { id: "chatEditor", label: "写作助手", icon: PenTool },
  { id: "troubleshoot", label: "排障助手", icon: Zap },
  { id: "knowledge", label: "AI 智库", icon: BookOpen },
  { id: "lab", label: "RDMind 实验室", icon: Sparkles },
  { id: "dev", label: "开发工作台", icon: Code },
  { id: "wishpool", label: "星愿池", icon: Star },
];

export function CloudSidebar({ activeView, onNavigate }: CloudSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const filteredHistory = mockHistory.filter(
    (h) =>
      h.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.category.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "flex flex-col h-screen transition-all duration-200 shrink-0",
        "bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg cloud-gradient-bg shadow-md">
              <Cloud className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sidebar-foreground text-sm tracking-tight">
                  星图云
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 leading-none">
                  Cloud
                </span>
              </div>
              <span className="text-[9px] text-sidebar-foreground/40">
                powered by RDMind
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* New Task Button */}
      <div className="px-3 pt-4 pb-2">
        <button
          className={cn(
            "w-full cloud-gradient-bg text-white rounded-lg font-medium text-sm transition-all",
            "shadow-md hover:opacity-90 hover:shadow-lg active:scale-95",
            "flex items-center justify-center gap-2",
            collapsed ? "h-9 w-9 p-0 mx-auto" : "h-9 px-4"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>新建任务</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-all group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-sidebar-border pt-3">
        {/* Switch to local */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <Monitor className="h-4 w-4 shrink-0" />
          {!collapsed && <span>切换本地版</span>}
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>{theme === "dark" ? "浅色模式" : "深色模式"}</span>}
        </button>
        <button
          onClick={() => onNavigate("settings")}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>设置</span>}
        </button>
        <button
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <User className="h-4 w-4 shrink-0" />
          {!collapsed && <span>个人中心</span>}
        </button>
      </div>
    </aside>
  );
}
