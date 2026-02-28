import { useNavigate } from "react-router-dom";
import { Cloud, Monitor, ArrowRight, Sparkles } from "lucide-react";

export default function PlatformSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-foreground tracking-tight">星图</span>
        <span className="text-xs text-muted-foreground">powered by RDMind</span>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">选择你的工作台</h1>
        <p className="text-sm text-muted-foreground">两种风格，相同强大，按你的偏好选择</p>
      </div>

      <div className="grid grid-cols-2 gap-5 w-full max-w-2xl">
        {/* Local Platform */}
        <button
          onClick={() => navigate("/")}
          className="group relative flex flex-col items-start gap-5 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all text-left overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Monitor className="h-5.5 w-5.5 text-primary" />
          </div>
          <div className="relative flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-base font-bold text-foreground">本地工作台</h2>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 leading-none">Beta</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              极简石墨风格，专注内容本身。适合深度工作和开发场景。
            </p>
          </div>
          <div className="relative flex items-center gap-1 text-xs font-medium text-primary">
            <span>进入工作台</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Cloud Platform */}
        <button
          onClick={() => navigate("/cloud")}
          className="group relative flex flex-col items-start gap-5 p-6 rounded-2xl border border-border bg-card hover:border-blue-400/40 hover:shadow-xl transition-all text-left overflow-hidden"
        >
          {/* Gradient glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 55% / 0.06), hsl(196 100% 47% / 0.04))" }}
          />
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, hsl(217 91% 55%), hsl(196 100% 47%))" }}
          >
            <Cloud className="h-5.5 w-5.5 text-white" />
          </div>
          <div className="relative flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-base font-bold text-foreground">云端平台</h2>
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-semibold leading-none text-white"
                style={{ background: "linear-gradient(135deg, hsl(217 91% 55%), hsl(196 100% 47%))" }}
              >
                Cloud
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              蓝色渐变活力风格，数据看板一览全局。适合协作与管理场景。
            </p>
          </div>
          <div className="relative flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(217 91% 55%)" }}>
            <span>进入云端平台</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        你可以随时在两种风格之间切换
      </p>
    </div>
  );
}
