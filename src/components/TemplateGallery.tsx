import { useState } from "react";
import { Star, Search, FileCode, MessageCircle, BarChart3, Mail, Globe, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["公开模板", "我收藏的", "我创建的"];

const templates = [
  { title: "代码审查", desc: "快速审查代码质量，发现潜在问题", icon: FileCode, stars: 128 },
  { title: "群聊总结", desc: "智能总结群聊记录，提取关键信息", icon: MessageCircle, stars: 96 },
  { title: "数据报告", desc: "自动生成数据分析报告", icon: BarChart3, stars: 84 },
  { title: "邮件撰写", desc: "高效撰写专业商务邮件", icon: Mail, stars: 72 },
  { title: "网页摘要", desc: "一键提取网页核心内容", icon: Globe, stars: 63 },
  { title: "创意方案", desc: "头脑风暴，激发创意灵感", icon: Lightbulb, stars: 51 },
];

export function TemplateGallery() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [search, setSearch] = useState("");

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索模板"
            className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-44"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {templates.map((t) => (
          <div
            key={t.title}
            className="group p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-muted">
                <t.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                <span>{t.stars}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">{t.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
