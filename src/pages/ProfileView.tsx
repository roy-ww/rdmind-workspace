import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  TrendingUp,
  Zap,
  BarChart3,
  Clock,
  ChevronRight,
  Edit2,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ModelUsage {
  model: string;
  used: number;
  limit: number;
  color: string;
}

interface UsageRecord {
  date: string;
  model: string;
  tokens: number;
  type: "input" | "output";
}

const MODEL_USAGES: ModelUsage[] = [
  { model: "Gemini 3 Flash", used: 128500, limit: 500000, color: "bg-blue-500" },
  { model: "GPT-4o", used: 76200, limit: 200000, color: "bg-emerald-500" },
  { model: "Claude 3.5 Sonnet", used: 45800, limit: 150000, color: "bg-violet-500" },
  { model: "DeepSeek V3", used: 210300, limit: 1000000, color: "bg-amber-500" },
  { model: "Qwen 3", used: 32100, limit: 300000, color: "bg-rose-500" },
];

const RECENT_RECORDS: UsageRecord[] = [
  { date: "2026-02-10 14:32", model: "Gemini 3 Flash", tokens: 2340, type: "output" },
  { date: "2026-02-10 14:30", model: "Gemini 3 Flash", tokens: 580, type: "input" },
  { date: "2026-02-10 11:15", model: "GPT-4o", tokens: 4120, type: "output" },
  { date: "2026-02-10 11:14", model: "GPT-4o", tokens: 1200, type: "input" },
  { date: "2026-02-09 20:45", model: "DeepSeek V3", tokens: 8900, type: "output" },
  { date: "2026-02-09 20:44", model: "DeepSeek V3", tokens: 3100, type: "input" },
  { date: "2026-02-09 16:20", model: "Claude 3.5 Sonnet", tokens: 3500, type: "output" },
  { date: "2026-02-09 09:10", model: "Qwen 3", tokens: 1800, type: "input" },
];

// Simple bar chart for daily usage (last 7 days)
const DAILY_USAGE = [
  { day: "02/04", tokens: 18200 },
  { day: "02/05", tokens: 32400 },
  { day: "02/06", tokens: 27800 },
  { day: "02/07", tokens: 41500 },
  { day: "02/08", tokens: 35200 },
  { day: "02/09", tokens: 52100 },
  { day: "02/10", tokens: 28300 },
];

function formatTokens(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<"overview" | "records">("overview");

  const totalUsed = MODEL_USAGES.reduce((s, m) => s + m.used, 0);
  const totalLimit = MODEL_USAGES.reduce((s, m) => s + m.limit, 0);
  const maxDaily = Math.max(...DAILY_USAGE.map((d) => d.tokens));

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-foreground">RDMind 用户</h1>
              <Badge variant="secondary" className="text-xs">Pro 会员</Badge>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />user@rdmind.com</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />加入于 2025-06-15</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm"><Edit2 className="h-3.5 w-3.5 mr-1" />编辑</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground"><LogOut className="h-3.5 w-3.5 mr-1" />退出</Button>
          </div>
        </div>

        <Separator />

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">总消耗 Token</p>
                <p className="text-lg font-semibold text-foreground">{formatTokens(totalUsed)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">今日消耗</p>
                <p className="text-lg font-semibold text-foreground">{formatTokens(DAILY_USAGE[DAILY_USAGE.length - 1].tokens)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">总额度</p>
                <p className="text-lg font-semibold text-foreground">{formatTokens(totalLimit)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
          {(["overview", "records"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "overview" ? "用量概览" : "使用记录"}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Per-model usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">各模型用量</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MODEL_USAGES.map((m) => {
                  const pct = Math.round((m.used / m.limit) * 100);
                  return (
                    <div key={m.model} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{m.model}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatTokens(m.used)} / {formatTokens(m.limit)} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", m.color)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Daily usage chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">近 7 日用量趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-36">
                  {DAILY_USAGE.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{formatTokens(d.tokens)}</span>
                      <div className="w-full bg-secondary rounded-t-md overflow-hidden" style={{ height: "100px" }}>
                        <div
                          className="w-full bg-primary/70 rounded-t-md transition-all mt-auto"
                          style={{
                            height: `${(d.tokens / maxDaily) * 100}%`,
                            marginTop: `${100 - (d.tokens / maxDaily) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{d.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "records" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">最近使用记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-border">
                {RECENT_RECORDS.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground text-xs w-32 shrink-0">{r.date}</span>
                      <span className="font-medium text-foreground">{r.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.type === "input" ? "outline" : "secondary"} className="text-xs">
                        {r.type === "input" ? "输入" : "输出"}
                      </Badge>
                      <span className="text-foreground font-mono text-xs w-16 text-right">
                        {r.tokens.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
