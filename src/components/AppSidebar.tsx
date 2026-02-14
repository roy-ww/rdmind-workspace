import { useState } from "react";
import {
  MessageSquare,
  BookOpen,
  PenTool,
  Code,
  Settings,
  AlertCircle,
  Plus,
  User,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface AppSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const navItems: { id: string; label: string; icon: any; disabled?: boolean; badge?: string }[] = [
  { id: "qa", label: "通用问答", icon: MessageSquare },
  { id: "chat", label: "AI 会话", icon: Sparkles, disabled: true, badge: "Coming Soon" },
  { id: "chat2", label: "AI 会话2", icon: MessageSquare },
  { id: "chatEditor", label: "写作助手", icon: PenTool },
  { id: "troubleshoot", label: "排障助手", icon: AlertCircle },
  { id: "knowledge", label: "AI 智库", icon: BookOpen },
  { id: "creative", label: "创作工作台", icon: PenTool },
  { id: "dev", label: "开发工作台", icon: Code },
];

export function AppSidebar({ activeView, onNavigate }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar h-screen transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-foreground text-sm tracking-tight">星图</span>
              <span className="text-[9px] text-muted-foreground">powered by RDMind</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* New Task Button */}
      <div className="px-3 pt-4 pb-2">
        <Button
          className={cn(
            "w-full brand-gradient text-primary-foreground shadow-sm",
            collapsed ? "px-0" : ""
          )}
          size={collapsed ? "icon" : "default"}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-1">新建任务</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onNavigate(item.id)}
              disabled={item.disabled}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm transition-colors",
                item.disabled
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-border pt-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>{theme === "dark" ? "浅色模式" : "深色模式"}</span>}
        </button>
        <button
          disabled
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">设置</span>}
          {!collapsed && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium leading-none">
              Coming Soon
            </span>
          )}
        </button>
        <button
          disabled
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed transition-colors"
        >
          <User className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">个人中心</span>}
          {!collapsed && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium leading-none">
              Coming Soon
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
